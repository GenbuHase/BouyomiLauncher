(() => {
	/** @return {String} A type of the instance */
	Object.prototype.getClassName = function () {
		return Object.prototype.toString.call(this).slice(8, -1);
	}

	Object.defineProperties(Object.prototype, {
		getClassName: { configurable: true, writable: true, enumerable: false }
	});
})();

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
		chrome.i18n.language = new URLSearchParams(location.search).get("lang") || navigator.language;

		fetch("/_locales/en/messages.json")
			.then(resp => resp.json()).then(messages => chrome.i18n.defaultMessages = messages)

			.then(() => fetch(`/_locales/${chrome.i18n.language}/messages.json`))
				.then(resp => resp.json()).then(messages => chrome.i18n.messages = Object.assign({}, chrome.i18n.defaultMessages, messages))
				.catch(err => chrome.i18n.messages = chrome.i18n.defaultMessages);
	}

	if (!chrome.i18n.getMessage) {
		/**
		 * @param {string} varName
		 * @return {string}
		 */
		chrome.i18n.getMessage = varName => (chrome.i18n.messages[varName] && chrome.i18n.messages[varName].message) || null;
	}
})();