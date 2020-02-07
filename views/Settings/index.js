/* global ChromeStorage */
import I18n from "../libs/I18n.js";



const SELECTORS = {
	Form: "#form.ui.form",
	Form_Services: "#form_services",
	Form_Services_Service: ".ui.toggle[Data-Service]",
	Form_Services_Service_Toggle: "Input[Type='checkbox']"
};


const storage = new ChromeStorage("sync");

I18n.autoApply().then(() => {
	return storage.get({
		YouTubeLiveOnViewer: false,
		YouTubeLiveOnBroadcaster: false
	}).then(store => {
		const toggles = document.querySelectorAll(`${SELECTORS.Form} ${SELECTORS.Form_Services} > ${SELECTORS.Form_Services_Service}`);
		for (const toggle of toggles) {
			const { service } = toggle.dataset;
			toggle.querySelector(SELECTORS.Form_Services_Service_Toggle).checked = store[service];
		}
	});
}).then(() => {
	$(".ui.checkbox")
		.checkbox()
		.each(function () {
			this.addEventListener("change", function () {
				const { service } = this.dataset;

				storage.set(service, this.querySelector(SELECTORS.Form_Services_Service_Toggle).checked).then(store => {
					$("body").toast({
						message: I18n.get(`view_Settings_toast__${store[service] ? "enabled" : "disabled"}`, I18n.get(`service_${service}`)),

						class: "success",
						className: { toast: "ui icon message" },
						showIcon: `toggle ${store[service] ? "on" : "off"}`
					});
				});
			});
		});
});