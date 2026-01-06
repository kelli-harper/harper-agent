import {applyPatchTool} from '@openai/agents';
import {WorkspaceEditor} from './workspaceEditor.ts';
import {promptApplyPatchApproval} from '../utils/promptApplyPatchApproval.ts';

export function createApplyPatchTool(workspaceRoot: string) {
	return applyPatchTool({
		editor: new WorkspaceEditor(workspaceRoot),
		// could also be a function for you to determine if approval is needed
		needsApproval: true,
		onApproval: async (_ctx, approvalItem) => {
			const op =
				approvalItem.rawItem.type === 'apply_patch_call'
					? approvalItem.rawItem.operation
					: undefined;
			const approve = op ? await promptApplyPatchApproval(op) : false;
			return {approve};
		},
	});
}
