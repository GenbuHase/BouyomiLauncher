export default class I18n {
	static get VariablePattern () { return /{{\s*__MSG_([^{}]+)__\s*}}/ }
	static get isLoaded () { return chrome.extension || chrome.i18n.messages ? true : false }


	static get (localeId, ...placeholders) { return chrome.i18n.getMessage(localeId, ...placeholders) }

	static apply () {
		const docElem = document.documentElement;

		const variables = docElem.innerHTML.matchGlobally(RegExp(this.VariablePattern, "g"));
		for (const variable of variables) {
			docElem.innerHTML = docElem.innerHTML.replace(RegExp(variable[0], "g"), chrome.i18n.getMessage(variable[1]));
		}
	}

	static async autoApply () {
		return new Promise(resolve => {
			let observer = setInterval(() => {
				if (this.isLoaded) {
					clearInterval(observer);
					this.apply();
		
					resolve();
				}
			}, 80);
		});
	}
}