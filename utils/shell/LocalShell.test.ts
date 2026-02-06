import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalShell } from './LocalShell';

describe('LocalShell', () => {
	beforeEach(() => {
		delete process.env.HAIRPER_SHELL_TIMEOUT_MS;
		delete process.env.SHELL_DEFAULT_TIMEOUT_MS;
	});

	it('uses HAIRPER_SHELL_TIMEOUT_MS from environment', async () => {
		process.env.HAIRPER_SHELL_TIMEOUT_MS = '100';
		const shell = new LocalShell();
		const result = await shell.run({
			commands: ['node -e "setTimeout(()=>{}, 500)"'],
		} as any);
		expect(result.output[0].outcome.type).toBe('timeout');
	});

	it('uses SHELL_DEFAULT_TIMEOUT_MS from environment and logs warning', async () => {
		process.env.SHELL_DEFAULT_TIMEOUT_MS = '100';
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const shell = new LocalShell();
		const result = await shell.run({
			commands: ['node -e "setTimeout(()=>{}, 500)"'],
		} as any);

		expect(result.output[0].outcome.type).toBe('timeout');
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('SHELL_DEFAULT_TIMEOUT_MS is deprecated'));
		warnSpy.mockRestore();
	});

	it('times out long-running command using default timeout', async () => {
		const shell = new LocalShell({ defaultTimeoutMs: 200 });
		const result = await shell.run({
			commands: ['node -e "setTimeout(()=>{}, 2000)"'],
		} as any);

		expect(result.output).toHaveLength(1);
		expect(result.output[0].outcome.type).toBe('timeout');
	});

	it('runs a quick command without timing out', async () => {
		const shell = new LocalShell({ defaultTimeoutMs: 2000 });
		const result = await shell.run({
			commands: ['node -e "console.log(123)"'],
		} as any);

		expect(result.output).toHaveLength(1);
		expect(result.output[0].outcome.type).toBe('exit');
		expect(result.output[0].stdout).toContain('123');
	});
});
