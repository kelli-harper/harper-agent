import { describe, expect, it } from 'vitest';
import { LocalShell } from './LocalShell';

describe('LocalShell', () => {
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
