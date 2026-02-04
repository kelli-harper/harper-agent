import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { trackedState } from '../../lifecycle/trackedState';
import { execute as changeCwd } from './changeCwdTool';

describe('changeCwdTool', () => {
	const originalCwd = process.cwd();
	let tempDir: string;

	beforeEach(async () => {
		// Create a temp directory inside the repository workspace to satisfy resolvePath constraints
		const base = path.join(originalCwd, `.tmp-cwd-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		tempDir = base;
		await mkdir(tempDir, { recursive: true });
	});

	afterEach(async () => {
		try {
			process.chdir(originalCwd);
			trackedState.cwd = originalCwd;
		} catch {}
		try {
			await rm(tempDir, { recursive: true, force: true });
		} catch {}
	});

	it('switches to an absolute directory path', async () => {
		const result = await changeCwd({ path: tempDir } as any);
		expect(result).toContain('Switched current working directory');
		expect(process.cwd()).toBe(tempDir);
		expect(trackedState.cwd).toBe(tempDir);
	});

	it('switches to a relative directory path from current tracked cwd', async () => {
		// First hop to tempDir, then create a child directory and cd into it by relative name
		await changeCwd({ path: tempDir } as any);
		const child = path.join(tempDir, 'child');
		await (await import('node:fs/promises')).mkdir(child);
		const result = await changeCwd({ path: 'child' } as any);
		expect(result).toContain('Switched current working directory');
		expect(process.cwd()).toBe(child);
		expect(trackedState.cwd).toBe(child);
	});

	it('returns an error for non-existent path and does not change cwd', async () => {
		const before = process.cwd();
		const result = await changeCwd({ path: path.join(tempDir, 'does-not-exist') } as any);
		expect(result).toContain('Failed to change directory');
		expect(process.cwd()).toBe(before);
		expect(trackedState.cwd).toBe(before);
	});
});
