import { describe, expect, it } from 'vitest';
import { isFalse } from './isFalse';

describe('isFalse', () => {
	it('returns true for "false"', () => {
		expect(isFalse('false')).toBe(true);
	});

	it('returns true for "0"', () => {
		expect(isFalse('0')).toBe(true);
	});

	it('returns false for undefined', () => {
		expect(isFalse(undefined)).toBe(false);
	});

	it('returns false for "true"', () => {
		expect(isFalse('true')).toBe(false);
	});

	it('returns false for "1"', () => {
		expect(isFalse('1')).toBe(false);
	});

	it('returns false for random strings', () => {
		expect(isFalse('random')).toBe(false);
	});

	it('should be case-insensitive', () => {
		expect(isFalse('False')).toBe(true);
		expect(isFalse('FALSE')).toBe(true);
	});

	it('should handle whitespace', () => {
		expect(isFalse('  false  ')).toBe(true);
		expect(isFalse('\n0\t')).toBe(true);
	});

	it('should handle "no" and "off"', () => {
		expect(isFalse('no')).toBe(true);
		expect(isFalse('off')).toBe(true);
	});
});
