import {createApplyPatchTool} from './applyPatchTool.ts';
import {findTool} from './findTool.ts';
import {readFileTool} from './readFileTool.ts';
import {readDirTool} from './readDirTool.ts';
import {createNewHarperApplicationTool} from './createNewHarperApplicationTool.ts';

export function createTools() {
	return [
		createApplyPatchTool(),
		findTool,
		readFileTool,
		readDirTool,
		createNewHarperApplicationTool,
	];
}
