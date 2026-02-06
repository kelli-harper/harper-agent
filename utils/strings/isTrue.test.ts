import { describe, expect, it } from 'vitest';
import { isTrue } from './isTrue';

describe('isTrue', () => {
	it('returns true for "true"', () => {
		expect(isTrue('true')).toBe(true);
	});

	it('returns true for "1"', () => {
		expect(isTrue('1')).toBe(true);
	});

	it('returns false for undefined', () => {
		expect(isTrue(undefined)).toBe(false);
	});

	it('returns false for "false"', () => {
		expect(isTrue('false')).toBe(false);
	});

	it('returns false for "0"', () => {
		expect(isTrue('0')).toBe(false);
	});

	it('returns false for random strings', () => {
		expect(isTrue('random')).toBe(false);
	});

	it('should be case-insensitive', () => {
		expect(isTrue('True')).toBe(true);
		expect(isTrue('TRUE')).toBe(true);
	});

	it('should handle whitespace', () => {
		expect(isTrue('  true  ')).toBe(true);
		expect(isTrue('\n1\t')).toBe(true);
	});

	it('should handle "yes" and "on"', () => {
		expect(isTrue('yes')).toBe(true);
		expect(isTrue('on')).toBe(true);
	});
});
