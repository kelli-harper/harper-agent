import type {ApplyPatchOperation, ApplyPatchResult, Editor} from "@openai/agents-core";
import {mkdir, readFile, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import {applyDiff} from "@openai/agents";

export class WorkspaceEditor implements Editor {
    private readonly root: string;

    constructor(root: string) {
        this.root = root;
    }

    async createFile(
        operation: Extract<ApplyPatchOperation, { type: 'create_file' }>,
    ): Promise<ApplyPatchResult | void> {
        const targetPath = await this.resolve(operation.path);
        await mkdir(path.dirname(targetPath), {recursive: true});
        const content = applyDiff('', operation.diff, 'create');
        await writeFile(targetPath, content, 'utf8');
        return {status: 'completed', output: `Created ${operation.path}`};
    }

    async updateFile(
        operation: Extract<ApplyPatchOperation, { type: 'update_file' }>,
    ): Promise<ApplyPatchResult | void> {
        const targetPath = await this.resolve(operation.path);
        const original = await readFile(targetPath, 'utf8').catch((error: any) => {
            if (error?.code === 'ENOENT') {
                throw new Error(`Cannot update missing file: ${operation.path}`);
            }
            throw error;
        });
        const patched = applyDiff(original, operation.diff);
        await writeFile(targetPath, patched, 'utf8');
        return {status: 'completed', output: `Updated ${operation.path}`};
    }

    async deleteFile(
        operation: Extract<ApplyPatchOperation, { type: 'delete_file' }>,
    ): Promise<ApplyPatchResult | void> {
        const targetPath = await this.resolve(operation.path);
        await rm(targetPath, {force: true});
        return {status: 'completed', output: `Deleted ${operation.path}`};
    }

    private async resolve(relativePath: string): Promise<string> {
        const resolved = path.resolve(this.root, relativePath);
        if (!resolved.startsWith(this.root)) {
            throw new Error(`Operation outside workspace: ${relativePath}`);
        }
        return resolved;
    }
}
