/**
 * @param {string} str
 * @param {RegExp} matcher
 * 
 * @return {RegExpMatchArray[]}
 */
String.prototype.matchGlobally = function (matcher) {
	const result = [];

	let mem;
	while ((mem = matcher.exec(this))) {
		if (mem.index === matcher.lastIndex) matcher.lastIndex++;

		result.push(mem);
	}

	return result;
}

Object.defineProperties(String.prototype, {
	matchGlobally: { configurable: true, writable: true, enumerable: false }
})