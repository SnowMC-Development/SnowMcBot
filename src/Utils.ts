export const trimArray = (arr: any, maxLen = 10) => {
	if (arr.length > maxLen) {
		const len = arr.length - maxLen;
		arr = arr.slice(0, maxLen);
		arr.push(`${len} more...`);
	}
	return arr;
};

export function removeDuplicates<T extends Array<T>>(arr: T) {
	return [...new Set(arr)];
}

export const capitalise = (string: any) => {
	return string
		.split(' ')
		.map((str: any) => str.slice(0, 1).toUpperCase() + str.slice(1))
		.join(' ');
};
