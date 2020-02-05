
(() => {
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
	});
})();

(() => {
	chrome = chrome || {};

	if (!chrome.i18n) {
		chrome.i18n = {};

		fetch(`/_locales/${navigator.language}/messages.json`)
			.catch(err => fetch("/_locales/en/messages.json"))
			.then(resp => resp.json())
			.then(messages => chrome.i18n.messages = messages);
	}

	if (!chrome.i18n.getMessage) {
		/**
		 * @param {string} varName
		 * @return {string}
		 */
		chrome.i18n.getMessage = varName => chrome.i18n.messages[varName] ? chrome.i18n.messages[varName].message : null;
	}
})();