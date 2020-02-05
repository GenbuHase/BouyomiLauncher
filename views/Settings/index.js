import I18n from "../libs/I18n.js";


(() => {
	let i18nLooper = setInterval(() => {
		if (I18n.isLoaded) {
			clearInterval(i18nLooper);
			I18n.apply();
		}
	}, 80);
})();