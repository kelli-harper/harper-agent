import type {ApplyPatchOperation} from '@openai/agents-core';
import chalk from 'chalk';
import {printDiff} from './printDiff.ts';
import {askQuestion} from './askQuestion.ts';
import {spinner} from './spinner.ts';

export async function promptApplyPatchApproval(
	operation: ApplyPatchOperation,
): Promise<boolean> {
	if (process.env.APPLY_PATCH_AUTO_APPROVE === '1') {
		return true;
	}
	spinner.stop();

	console.log(chalk.bold.bgYellow.black(' Apply patch approval required: '));
	console.log(`${chalk.bold(operation.type)}: ${operation.path}`);
	if ('diff' in operation && typeof operation.diff === 'string') {
		printDiff(operation.diff);
	}
	const answer = await askQuestion(`Proceed? [y/N] `);
	const approved = answer.trim().toLowerCase();

	spinner.start();

	return approved === 'y' || approved === 'yes' || approved === 'ok' || approved === 'k';
}
