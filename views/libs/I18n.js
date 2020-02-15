export default class I18n {
	static get VariablePattern () { return /{{\s*__MSG_([^{}]+)__\s*}}/ }
	static get isLoaded () { return chrome.extension || chrome.i18n.messages ? true : false }


	/**
	 * @param {string} localeId
	 * @param  {...any} [placeholders]
	 * 
	 * @return {string}
	 */
	static get (localeId, ...placeholders) { return chrome.i18n.getMessage(localeId, ...placeholders) }

	/** @param {HTMLElement} rootElement */
	static apply (rootElement) {
		const variables = rootElement.innerHTML.matchGlobally(RegExp(this.VariablePattern, "g"));
		for (const variable of variables) {
			rootElement.innerHTML = rootElement.innerHTML.replace(RegExp(variable[0], "g"), chrome.i18n.getMessage(variable[1]));
		}
	}

	static applyAll () {
		this.apply(document.documentElement);
	}

	static async autoApply () {
		return new Promise(resolve => {
			let observer = setInterval(() => {
				if (this.isLoaded) {
					clearInterval(observer);
					this.applyAll();
		
					resolve();
				}
			}, 80);
		});
	}
}