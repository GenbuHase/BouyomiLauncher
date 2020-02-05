import I18n from "../libs/I18n.js";



new Promise(resolve => {
	let i18nLooper = setInterval(() => {
		if (I18n.isLoaded) {
			clearInterval(i18nLooper);
			I18n.apply();

			resolve();
		}
	}, 80);
}).then(() => {
	$(".ui.checkbox").checkbox();
});