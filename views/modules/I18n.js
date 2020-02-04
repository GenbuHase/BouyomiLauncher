export default class I18n {
	static get VariablePattern () { return /{{\s*__MSG_([^{}]+)__\s*}}/ }


	static apply () {
		const docElem = document.documentElement;

		const variables = docElem.innerHTML.matchGlobally(RegExp(this.VariablePattern, "g"));
		for (const variable of variables) {
			docElem.innerHTML = docElem.innerHTML.replace(RegExp(variable[0], "g"), chrome.i18n.getMessage(variable[1]));
		}
	}
}