import {tool} from '@openai/agents';
import {execSync} from 'node:child_process';
import {z} from 'zod';

const ToolParameters = z.object({
	path: z.string()
		.describe('The path to start the search from.'),
	pattern: z
		.string()
		.describe('The pattern to search'),
});

export const egrepTool = tool({
	name: 'egrep',
	description:
		'File pattern searcher.',
	parameters: ToolParameters,
	async execute({ path, pattern }: z.infer<typeof ToolParameters>) {
		try {
			return execSync(`egrep -ir "${pattern}" ${path}`).toString('utf8');
		} catch (error) {
			return `Error executing egrep command: ${error}`;
		}
	},
});
