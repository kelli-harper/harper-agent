import type { Agent, Session } from '@openai/agents';
import type { WithRunCompaction } from './withRunCompaction';
import type { WithSkillsRead } from './withSkillsRead';

export interface TrackedState {
	agent: Agent | null;
	cwd: string;
	atStartOfLine: boolean;
	emptyLines: number;
	approvalState: any | null;
	controller: AbortController | null;
	model: string;
	compactionModel: string;
	sessionPath: string | null;
	useFlexTier: boolean;
	disableSpinner: boolean;
	enableInterruptions: boolean; // whether stdin can interrupt model runs
	// Current session instance (may implement additional capabilities like skills tracking)
	session: (Session & WithRunCompaction & WithSkillsRead) | null;
}

export const trackedState: TrackedState = {
	agent: null,
	cwd: process.cwd(),
	atStartOfLine: true,
	emptyLines: 0,
	approvalState: null,
	controller: null,
	model: '',
	compactionModel: '',
	sessionPath: null,
	useFlexTier: false,
	disableSpinner: false,
	enableInterruptions: true,
	session: null,
};
