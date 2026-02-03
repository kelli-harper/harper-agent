import 'dotenv/config';
import { describe, expect, test } from 'vitest';
import { Chat } from './utils/chat';

describe('End-to-End Tests', () => {
	const chat = new Chat();

	test(
		'creates a simple react app',
		async () => {
			chat.bootstrap('I want to make a react app that shows the current time in really big letters. Really simple.');

			const ok = await chat.waitForFiles(60_000, (files: string[]) => {
				const pkgJson = files.some(a => a.endsWith('package.json'));
				const gitDir = files.some(a => a.includes('.git/'));
				const appFile = files.some(a => (a.endsWith('App.tsx') || a.endsWith('App.jsx')));
				return pkgJson && gitDir && appFile;
			});

			chat.stop();

			expect(ok, `Expected files to be created. CLI output so far:\n${chat.stdoutBuf}`).toBe(true);
		},
		60_000,
	);
});
