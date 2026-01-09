import { webSearchTool } from '@openai/agents';

export const webTool = webSearchTool({
	filters: {
		allowedDomains: [
			'docs.harperdb.io',
		],
	},
	searchContextSize: 'medium',
});
