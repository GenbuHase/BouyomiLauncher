import I18n from "../libs/I18n.js";
import ChromeStorage from "../libs/ChromeStorage.js";



const storage = new ChromeStorage("sync");

new Promise(resolve => {
	let i18nLooper = setInterval(() => {
		if (I18n.isLoaded) {
			clearInterval(i18nLooper);
			I18n.apply();

			resolve();
		}
	}, 80);
}).then(() => {
	return storage.get({
		YouTube: false,
		YouTubeLive: false
	}).then(store => {
		const toggles = document.querySelectorAll("*[ID*='form_services--']");
		for (const toggle of toggles) {
			const serviceName = toggle.id.split("--")[1];
			toggle.querySelector("input").checked = store[serviceName];
		}
	});
}).then(() => {
	$(".ui.checkbox")
		.checkbox()
		.each(function (index) {
			this.addEventListener("change", function () {
				const serviceName = this.id.split("--")[1];

				storage.set(serviceName, this.querySelector("input").checked).then(store => {
					console.info(`[BouyomiLauncher] ${serviceName} is ${store[serviceName] ? "enabled" : "disabled"}.`);
				});
			});
		});
});