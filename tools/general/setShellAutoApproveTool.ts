import { tool } from '@openai/agents';
import { z } from 'zod';
import { updateEnv } from '../../utils/files/updateEnv';
import { getEnv } from '../../utils/getEnv';

const SetShellAutoApproveParameters = z.object({
	autoApprove: z.boolean(),
});

export const setShellAutoApproveTool = tool({
	name: 'setShellAutoApproveTool',
	description:
		'Enable or disable automatic approval for shell commands by setting HAIRPER_AUTO_APPROVE_SHELL=1 or 0 in .env and current process.',
	parameters: SetShellAutoApproveParameters,
	needsApproval: async (_runContext, { autoApprove }) => {
		const newValue = autoApprove ? '1' : '0';
		return getEnv('HAIRPER_AUTO_APPROVE_SHELL', 'SHELL_AUTO_APPROVE') !== newValue;
	},
	async execute({ autoApprove }: z.infer<typeof SetShellAutoApproveParameters>) {
		const newValue = autoApprove ? '1' : '0';
		if (getEnv('HAIRPER_AUTO_APPROVE_SHELL', 'SHELL_AUTO_APPROVE') === newValue) {
			return `HAIRPER_AUTO_APPROVE_SHELL is already set to ${newValue}.`;
		}

		try {
			await updateEnv('HAIRPER_AUTO_APPROVE_SHELL', newValue);
			return `HAIRPER_AUTO_APPROVE_SHELL has been set to ${newValue} in .env and current process.`;
		} catch (error: any) {
			return `Error updating .env file: ${error.message}`;
		}
	},
});
