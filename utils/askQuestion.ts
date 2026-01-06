import {createInterface} from 'node:readline/promises';
import {harperResponse} from './harperResponse.ts';

export async function askQuestion(query: string): Promise<string> {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.on('SIGINT', () => {
		console.log('');
		harperResponse('See you later!');
		rl.close();
		process.exit(0);
	});

	try {
		return await rl.question(query);
	} finally {
		rl.close();
	}
}
