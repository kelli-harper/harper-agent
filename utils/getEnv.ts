import chalk from 'chalk';

const warnedKeys = new Set<string>();

/**
 * Gets an environment variable value, preferring the new key.
 * If the old key is used, it logs a deprecation notice.
 * @param newKey The new environment variable key.
 * @param oldKey The old (deprecated) environment variable key.
 * @returns The value of the environment variable, or undefined if neither is set.
 */
export function getEnv(newKey: string, oldKey: string): string | undefined {
	const newValue = process.env[newKey];
	if (newValue !== undefined) {
		return newValue;
	}

	const oldValue = process.env[oldKey];
	if (oldValue !== undefined) {
		if (!warnedKeys.has(oldKey)) {
			console.warn(
				chalk.yellow(
					`[DEPRECATION NOTICE] The environment variable ${oldKey} is deprecated and will be removed in a future version. Please use ${newKey} instead.`,
				),
			);
			warnedKeys.add(oldKey);
		}
		return oldValue;
	}

	return undefined;
}
