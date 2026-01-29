import { shellTool } from '@openai/agents';
import { LocalShell } from '../../utils/LocalShell';
import { promptShellApproval } from '../../utils/promptShellApproval';

const tool = shellTool({
	shell: new LocalShell(),
	name: 'shellToolForCommandsWithoutABetterTool',
	needsApproval: true,
	onApproval: async (_ctx, approvalItem) => {
		const commands = approvalItem.rawItem.type === 'shell_call'
			? approvalItem.rawItem.action.commands
			: [];
		const approve = await promptShellApproval(commands);
		return { approve };
	},
});

export { tool as shellTool };
