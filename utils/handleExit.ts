import { cleanUpAndSayBye } from './cleanUpAndSayBye';
import { costTracker } from './cost';
import { spinner } from './spinner';

export function handleExit() {
	spinner.stop();
	costTracker.logFinalStats();
	cleanUpAndSayBye();
	process.exit(0);
}
