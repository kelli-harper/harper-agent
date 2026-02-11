import { tool } from '@openai/agents';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { trackedState } from '../../lifecycle/trackedState';
import { resolvePath } from '../../utils/files/paths';

const ToolParameters = z.object({
	fileName: z
		.string()
		.describe('The name of the file to read.'),
});

export const readFileTool = tool({
	name: 'readFile',
	description: 'Reads the contents of a specified file.',
	parameters: ToolParameters,
	async execute({ fileName }: z.infer<typeof ToolParameters>) {
		try {
			// If the requested file appears to be a Harper skill markdown, record the skill name
			const normalized = String(fileName).replace(/\\/g, '/');
			const m = normalized.match(/(?:^|\/)skills\/([A-Za-z0-9_-]+)\.md(?:$|[?#])/);
			if (m && m[1]) {
				trackedState.session?.addSkillRead?.(m[1]);
			}
			const resolvedPath = resolvePath(trackedState.cwd, fileName);
			return readFile(resolvedPath, 'utf8');
		} catch (error) {
			return `Error reading file: ${error}`;
		}
	},
});
