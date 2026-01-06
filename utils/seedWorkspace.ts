import {mkdir} from 'node:fs/promises';

export async function seedWorkspace(root: string): Promise<void> {
	await mkdir(root, {recursive: true});
}
