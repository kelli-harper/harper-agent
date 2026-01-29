import { harperProcess } from './harperProcess';
import { harperResponse } from './harperResponse';

export function cleanUpAndSayBye() {
	if (harperProcess.startedByHairper) {
		harperProcess.stop();
	}
	console.log('');
	harperResponse('See you later!');
}
