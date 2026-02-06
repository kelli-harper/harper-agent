import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getEnv } from './getEnv';

describe('getEnv', () => {
	beforeEach(() => {
		vi.resetModules();
		delete process.env.NEW_KEY;
		delete process.env.OLD_KEY;
		vi.restoreAllMocks();
	});

	it('should return value from new key if it exists', () => {
		process.env.NEW_KEY = 'new_value';
		process.env.OLD_KEY = 'old_value';
		const result = getEnv('NEW_KEY', 'OLD_KEY');
		expect(result).toBe('new_value');
	});

	it('should return value from old key if new key does not exist and log warning', () => {
		process.env.OLD_KEY = 'old_value';
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = getEnv('NEW_KEY', 'OLD_KEY');

		expect(result).toBe('old_value');
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('OLD_KEY is deprecated'));
	});

	it('should only log deprecation warning once for the same key', () => {
		process.env.OLD_KEY_2 = 'old_value';
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		getEnv('NEW_KEY_2', 'OLD_KEY_2');
		getEnv('NEW_KEY_2', 'OLD_KEY_2');

		expect(warnSpy).toHaveBeenCalledTimes(1);
	});

	it('should return undefined if neither key exists', () => {
		const result = getEnv('NEW_KEY', 'OLD_KEY');
		expect(result).toBe(undefined);
	});
});
