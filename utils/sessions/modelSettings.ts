import { trackedState } from '../../lifecycle/trackedState';

export const modelSettings = {
	providerData: {
		service_tier: trackedState.useFlexTier ? 'flex' : 'auto',
	},
};
