import {tool} from '@openai/agents';
import {execSync} from 'node:child_process';
import {z} from 'zod';

const ToolParameters = z.object({
	directoryName: z
		.string()
		.describe('The name of the directory to clone the template into.'),
});

export const createNewHarperApplicationTool = tool({
	name: 'createNewHarperApplicationTool',
	description:
		'Creates a new harper application by cloning the application template through Git.',
	parameters: ToolParameters,
	async execute({directoryName}: z.infer<typeof ToolParameters>) {
		try {
			// TODO: May not work if we don't have git locally. But I think that's ok for POC purposes.
			return execSync(`git clone https://github.com/HarperFast/application-template.git ${directoryName}`);
		} catch (error) {
			return `Error creating new harper application: ${error.message}`;
		}
	},
});
