import { handleHelp, handleVersion, isHelpRequest, isVersionRequest } from '../utils/shell/cli';
import { isFalse } from '../utils/strings/isFalse';
import { isTrue } from '../utils/strings/isTrue';
import { isOpenAIModel } from './getModel';
import { trackedState } from './trackedState';

function stripQuotes(str: string): string {
	if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
		return str.slice(1, -1);
	}
	return str;
}

export function parseArgs() {
	const args = process.argv.slice(2);
	if (isHelpRequest(args)) {
		handleHelp();
	}
	if (isVersionRequest(args)) {
		handleVersion();
	}

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]!;

		const flagPairs = [
			['model', ['--model', '-m', 'model']],
			['compactionModel', ['--compaction-model', '-c', 'compaction-model']],
			['sessionPath', ['--session', '-s', 'session']],
		] as const;

		let handled = false;
		for (const [key, prefixes] of flagPairs) {
			for (const prefix of prefixes) {
				if (arg === prefix) {
					if (args[i + 1]) {
						trackedState[key] = stripQuotes(args[++i]!);
					}
					handled = true;
					break;
				} else if (arg.startsWith(`${prefix}=`)) {
					trackedState[key] = stripQuotes(arg.slice(prefix.length + 1));
					handled = true;
					break;
				}
			}
			if (handled) { break; }
		}

		if (handled) { continue; }

		// Handle boolean flags
		if (arg === '--flex-tier') {
			trackedState.useFlexTier = true;
		} else if (arg === '--no-spinner' || arg === '--disable-spinner') {
			trackedState.disableSpinner = true;
		} else if (
			[
				'--no-interrupt',
				'--no-interrupts',
				'--no-interruptions',
				'--disable-interrupt',
				'--disable-interrupts',
				'--disable-interruptions',
			].includes(arg)
		) {
			trackedState.enableInterruptions = false;
		}
	}

	// Explicit env overrides for direct model configuration
	if (!trackedState.model && process.env.HAIRPER_MODEL) {
		trackedState.model = process.env.HAIRPER_MODEL;
	}
	if (!trackedState.compactionModel && process.env.HAIRPER_COMPACTION_MODEL) {
		trackedState.compactionModel = process.env.HAIRPER_COMPACTION_MODEL;
	}
	if (!trackedState.sessionPath && process.env.HAIRPER_SESSION) {
		trackedState.sessionPath = process.env.HAIRPER_SESSION;
	}

	if (!trackedState.useFlexTier && isTrue(process.env.HAIRPER_FLEX_TIER)) {
		trackedState.useFlexTier = true;
	}

	// Spinner control via env
	if (
		!trackedState.disableSpinner
		&& (isTrue(process.env.HAIRPER_NO_SPINNER) || isTrue(process.env.HAIRPER_DISABLE_SPINNER))
	) {
		trackedState.disableSpinner = true;
	}

	// Interruption control via env (default is enabled)
	if (
		isTrue(process.env.HAIRPER_DISABLE_INTERRUPTION) || isTrue(process.env.HAIRPER_DISABLE_INTERRUPTIONS)
		|| isFalse(process.env.HAIRPER_ENABLE_INTERRUPTION) || isFalse(process.env.HAIRPER_ENABLE_INTERRUPTIONS)
	) {
		trackedState.enableInterruptions = false;
	}

	// If no model was provided, select a sensible default based on available provider env keys
	if (!trackedState.model) {
		if (process.env.ANTHROPIC_API_KEY) {
			trackedState.model = 'claude-3-7-sonnet-latest';
		} else if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
			trackedState.model = 'gemini-2.0-flash';
		} else if (process.env.OPENAI_API_KEY) {
			trackedState.model = 'gpt-5.2';
		} else if (process.env.OLLAMA_BASE_URL) {
			trackedState.model = 'ollama-qwen3-coder:30b';
		} else {
			trackedState.model = 'gpt-5.2';
		}
	}

	// If no compaction model was provided, align it with the chosen provider to avoid extra API key prompts
	if (!trackedState.compactionModel) {
		const m = trackedState.model;
		if (m.startsWith('claude-')) {
			trackedState.compactionModel = 'claude-3-5-haiku-latest';
		} else if (m.startsWith('gemini-')) {
			trackedState.compactionModel = 'gemini-1.5-flash';
		} else if (m.startsWith('ollama-')) {
			trackedState.compactionModel = 'ollama-qwen2.5-coder';
		} else {
			trackedState.compactionModel = 'gpt-4o-mini';
		}
	}

	if (!isOpenAIModel(trackedState.model)) {
		process.env.OPENAI_AGENTS_DISABLE_TRACING = process.env.OPENAI_AGENTS_DISABLE_TRACING || '1';
	}
}
