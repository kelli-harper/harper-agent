import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach } from 'vitest';

export class Chat {
	private originalCwd = process.cwd();
	private tempDir: string | undefined;
	private child: ChildProcessWithoutNullStreams | null = null;
	public stdoutBuf: string = '';

	constructor() {
		beforeEach(async () => {
			// Create a fresh temporary working directory and switch into it
			this.tempDir = mkdtempSync(join(os.tmpdir(), 'hairper-e2e-'));
			process.chdir(this.tempDir);
		}, 60_000);

		afterEach(() => {
			// Attempt to stop the CLI if still running
			try {
				this.child?.kill('SIGINT');
			} catch {}

			// Restore cwd then cleanup temp directory
			try {
				process.chdir(this.originalCwd);
			} catch {}
			try {
				if (this.tempDir) {
					rmSync(this.tempDir, { recursive: true, force: true });
				}
			} catch {}
		});
	}

	bootstrap(instruction: string) {
		const cliPath = join(this.originalCwd, 'dist', 'agent.js');

		this.stdoutBuf = '';

		this.child = spawn(process.execPath, [
			cliPath,
			'--model',
			process.env.HAIRPER_MODEL || 'gpt-4o-mini',
			'--no-spinner',
		], {
			cwd: this.tempDir,
			env: {
				...process.env,
				HAIRPER_SKIP_UPDATE: 'true',
				_HARPER_TEST_CLI: 'true',
				APPLY_PATCH_AUTO_APPROVE: '1',
				CODE_INTERPRETER_AUTO_APPROVE: '1',
				SHELL_AUTO_APPROVE: '1',
				OPENAI_AGENTS_DISABLE_TRACING: process.env.OPENAI_AGENTS_DISABLE_TRACING || '1',
				OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
			},
			stdio: ['pipe', 'pipe', 'pipe'],
		});

		// Watch for prompts and approve when needed
		this.child.stdout.on('data', (chunk: Buffer) => {
			const text = chunk.toString();
			this.stdoutBuf += text;
			process.stdout.write(text);

			// When prompt appears, send the task
			if (text.includes('\n> ') || /\n>\s*$/.test(this.stdoutBuf)) {
				// Only send once
				if (!this.stdoutBuf.includes('[TASK_SENT]')) {
					this.sendLine(instruction);
					// mark to avoid resending if prompt reappears
					this.stdoutBuf += '[TASK_SENT]';
				}
			}
		});

		// If CLI logs errors, surface them to the test output
		this.child.stderr.on('data', (chunk: Buffer) => {
			this.stdoutBuf += chunk.toString();
		});
	}

	sendLine(line: string) {
		this.child!.stdin.write(line + '\n');
		process.stdout.write(line + '\n');
	}

	async waitForFiles(timeoutMs: number, filesFound: (files: string[]) => boolean) {
		const start = Date.now();
		while (Date.now() - start < timeoutMs) {
			const readDir = readdirSync(this.tempDir!, { recursive: true }).filter(a => typeof a === 'string');
			if (filesFound(readDir)) {
				return true;
			}
			await new Promise((r) => setTimeout(r, 1000));
		}
		return false;
	}

	stop() {
		// Stop the CLI (gracefully)
		try {
			this.child!.kill('SIGINT');
		} catch {}
	}
}
