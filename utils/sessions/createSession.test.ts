import { MemorySession } from '@openai/agents';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as trackCompactionModule from '../../lifecycle/trackCompaction';
import { createSession } from './createSession';
import { DiskSession } from './DiskSession';
import { MemoryCompactionSession } from './MemoryCompactionSession';

vi.mock('@openai/agents', () => {
	return {
		MemorySession: vi.fn().mockImplementation(function() {
			(this as any).items = [];
			(this as any).sessionId = 'mock-session-id';
			this.getSessionId = vi.fn().mockResolvedValue('mock-session-id');
		}),
	};
});

vi.mock('./DiskSession', () => {
	return {
		DiskSession: vi.fn().mockImplementation(function() {
			(this as any).items = [];
			(this as any).sessionId = 'mock-disk-session-id';
			this.getSessionId = vi.fn().mockResolvedValue('mock-disk-session-id');
		}),
	};
});

vi.mock('./MemoryCompactionSession', () => ({
	MemoryCompactionSession: vi.fn(),
}));

vi.mock('../../lifecycle/trackCompaction', () => ({
	trackCompaction: vi.fn(),
}));

describe('createSession', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create a MemoryCompactionSession with MemorySession when no path is provided', () => {
		createSession(null);

		expect(MemorySession).toHaveBeenCalled();
		expect(MemoryCompactionSession).toHaveBeenCalledWith(expect.objectContaining({
			underlyingSession: expect.any(MemorySession),
		}));
		expect(trackCompactionModule.trackCompaction).toHaveBeenCalled();
	});

	it('should create a MemoryCompactionSession with DiskSession when a path is provided', () => {
		createSession('test-session.db');

		expect(DiskSession).toHaveBeenCalledWith('test-session.db');
		expect(MemoryCompactionSession).toHaveBeenCalledWith(expect.objectContaining({
			underlyingSession: expect.any(DiskSession),
		}));
		expect(trackCompactionModule.trackCompaction).toHaveBeenCalled();
	});
});
