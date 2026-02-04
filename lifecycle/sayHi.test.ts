import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { harperResponse } from '../utils/shell/harperResponse';
import { sayHi } from './sayHi';
import { trackedState } from './trackedState';

vi.mock('../utils/shell/harperResponse', () => ({
	harperResponse: vi.fn(),
}));

describe('sayHi', () => {
	const testDir = join(process.cwd(), '.tmp-test-sayhi');

	beforeEach(() => {
		if (existsSync(testDir)) {
			rmSync(testDir, { recursive: true, force: true });
		}
		mkdirSync(testDir);
		trackedState.cwd = testDir;
		vi.clearAllMocks();
	});

	afterEach(() => {
		rmSync(testDir, { recursive: true, force: true });
	});

	it('suggests reading AGENTS.md if it exists in a harper app', () => {
		writeFileSync(join(testDir, 'config.yaml'), 'foo: bar');
		writeFileSync(join(testDir, 'AGENTS.md'), '# Agents');

		sayHi();

		expect(harperResponse).toHaveBeenCalledWith(
			expect.stringContaining('I see an AGENTS.md file here – you should probably read that next!'),
		);
	});

	it('does not suggest reading AGENTS.md if it does not exist', () => {
		writeFileSync(join(testDir, 'config.yaml'), 'foo: bar');

		sayHi();

		expect(harperResponse).toHaveBeenCalledWith(
			expect.not.stringContaining('AGENTS.md'),
		);
	});

	it('does not suggest reading AGENTS.md if it is not a harper app', () => {
		writeFileSync(join(testDir, 'AGENTS.md'), '# Agents');

		sayHi();

		expect(harperResponse).toHaveBeenCalledWith(
			expect.not.stringContaining('AGENTS.md'),
		);
	});
});
