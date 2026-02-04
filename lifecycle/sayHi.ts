import chalk from 'chalk';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { harperResponse } from '../utils/shell/harperResponse';
import { trackedState } from './trackedState';

export function sayHi() {
	const harperAppExists = existsSync(join(trackedState.cwd, 'config.yaml'));
	const agentsMdExists = harperAppExists && existsSync(join(trackedState.cwd, 'AGENTS.md'));
	const vibing = harperAppExists ? 'updating' : 'creating';

	console.log(chalk.dim(`Working directory: ${chalk.cyan(trackedState.cwd)}`));
	console.log(chalk.dim(`Harper app detected: ${chalk.cyan(harperAppExists ? 'Yes' : 'No')}`));
	console.log(chalk.dim(`Press Ctrl+C or hit enter twice to exit.\n`));

	harperResponse(
		harperAppExists
			? 'What do you want to do together today?'
			: 'What kind of Harper app do you want to make together?',
	);

	let instructions = `You are working on ${vibing} a harper app with the user.`;
	if (agentsMdExists) {
		instructions += ' I see an AGENTS.md file here – you should probably read that next!';
	}

	return {
		name: 'Harper App Development Assistant',
		instructions,
	};
}
