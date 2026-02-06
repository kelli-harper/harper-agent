export function isFalse(v: string | undefined) {
	if (v === undefined) {
		return false;
	}
	const val = v.trim().toLowerCase();
	return val === 'false' || val === '0' || val === 'no' || val === 'off';
}
