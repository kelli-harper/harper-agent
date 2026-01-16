import chalk from 'chalk';

const MODEL_PRICES: Record<string, { input: number; cachedInput: number; output: number }> = {
	'gpt-5.2': { input: 0.875 / 1_000_000, cachedInput: 0.0875 / 1_000_000, output: 7.00 / 1_000_000 }, // flex tier (slower and less expensive)
};

export function extractCachedTokens(inputTokenDetails?: Array<Record<string, number>>): number {
	let cachedInputTokens = 0;
	if (inputTokenDetails) {
		for (const inputTokenDetail of inputTokenDetails) {
			if (inputTokenDetail['cached_tokens']) {
				cachedInputTokens += inputTokenDetail['cached_tokens'];
			}
		}
	}
	return cachedInputTokens;
}

export function calculateCost(
	model: string | undefined,
	inputTokens: number,
	outputTokens: number,
	inputTokenDetails: Array<Record<string, number>> | undefined,
): number {
	const prices = MODEL_PRICES[model || 'gpt-5.2'] || MODEL_PRICES['gpt-5.2']!;
	const cachedInputTokens = extractCachedTokens(inputTokenDetails);
	const fullRateInputTokens = inputTokens - cachedInputTokens;
	return fullRateInputTokens * prices.input
		+ cachedInputTokens * prices.cachedInput
		+ outputTokens * prices.output;
}

export class CostTracker {
	private totalInputTokens = 0;
	private totalCachedInputTokens = 0;
	private totalOutputTokens = 0;
	private totalCost = 0;

	public recordTurn(
		model: string,
		usage: { inputTokens: number; outputTokens: number; inputTokensDetails?: Array<Record<string, number>> },
	) {
		const turnCost = calculateCost(model, usage.inputTokens, usage.outputTokens, usage.inputTokensDetails);
		this.totalInputTokens += usage.inputTokens;
		this.totalCachedInputTokens += extractCachedTokens(usage.inputTokensDetails);
		this.totalOutputTokens += usage.outputTokens;
		this.totalCost += turnCost;
		return turnCost;
	}

	public getStatusString(
		currentTurnUsage: { inputTokens: number; outputTokens: number; inputTokensDetails?: Array<Record<string, number>> },
		model: string,
	) {
		const turnCost = calculateCost(
			model,
			currentTurnUsage.inputTokens,
			currentTurnUsage.outputTokens,
			currentTurnUsage.inputTokensDetails,
		);
		const cachedInputTokens = extractCachedTokens(currentTurnUsage.inputTokensDetails);
		const fmt = (n: number) => new Intl.NumberFormat().format(n);
		const cachedStr = cachedInputTokens > 0 ? ` (${chalk.cyan(fmt(cachedInputTokens))} cached)` : '';

		return chalk.dim(
			`[Tokens: ${chalk.cyan(fmt(currentTurnUsage.inputTokens))} in${cachedStr}, ${
				chalk.cyan(fmt(currentTurnUsage.outputTokens))
			} out | Cost: ${chalk.cyan('$' + turnCost.toFixed(4))} (Total: ~${
				chalk.cyan('$' + (this.totalCost + turnCost).toFixed(4))
			})]`,
		);
	}

	public logFinalStats() {
		if (this.totalInputTokens > 0 || this.totalOutputTokens > 0) {
			const fmt = (n: number) => new Intl.NumberFormat().format(n);
			const cachedStr = this.totalCachedInputTokens > 0
				? ` (${chalk.cyan(fmt(this.totalCachedInputTokens))} cached)`
				: '';
			console.log(
				chalk.dim(
					`Final session usage: ${chalk.cyan(fmt(this.totalInputTokens))} input${cachedStr}, ${
						chalk.cyan(fmt(this.totalOutputTokens))
					} output tokens. Total cost: ~${chalk.cyan('$' + this.totalCost.toFixed(4))}`,
				),
			);
		}
	}
}
