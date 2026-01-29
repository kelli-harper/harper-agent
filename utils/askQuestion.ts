import { createInterface } from 'node:readline/promises';
import { cleanUpAndSayBye } from './cleanUpAndSayBye';
import { costTracker } from './cost';

export async function askQuestion(query: string): Promise<string> {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.on('SIGINT', () => {
		costTracker.logFinalStats();
		cleanUpAndSayBye();
		rl.close();
		process.exit(0);
	});

	try {
		const response = await rl.question(query);
		console.log('');
		return response;
	} finally {
		rl.close();
	}
}
