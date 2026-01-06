import {createApplyPatchTool} from './applyPatchTool.ts';
import {readFileTool} from './readFileTool.ts';
import {readDirTool} from './readDirTool.ts';

export function createTools() {
	return [
		createApplyPatchTool(),
		readFileTool,
		readDirTool,
	];
}
