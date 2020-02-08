/* global ChromeStorage */
/* global SERVICES */
import I18n from "../libs/I18n.js";



const SELECTORS = {
	Form: "#form.ui.form",
	Form_Services: "#form_services",
	Form_Services_Service: ".ui.toggle[Data-Service]",
	Form_Services_Service_Toggle: "Input[Type='checkbox']"
};

const STORE_DEFAULTS = (() => {
	const store = {};
	for (const key of Object.keys(SERVICES)) store[key] = false;

	return store;
})();


const storage = new ChromeStorage("sync");

I18n.autoApply()
	.then(() => storage.get(STORE_DEFAULTS))
	.then(store => {
		/*
		 * <Div Class = "field ui checkbox toggle" Data-Service = "${service}">
		 *     <Label>{{ __MSG_service_${service}__ }}</Label>
		 *     <Input Type = "checkbox" />
		 * </Div>
		 */
		const formServices = document.querySelector(`${SELECTORS.Form} ${SELECTORS.Form_Services}`);
		for (const service of Object.entries(store)) {
			const fieldElem = document.createElement("div");
			fieldElem.classList.add("field", "ui", "checkbox", "toggle"),
			fieldElem.dataset.service = service[0];

			const fieldElem_label = document.createElement("label");
			fieldElem_label.textContent = I18n.get(`service_${service[0]}`);

			const fieldElem_input = document.createElement("input");
			fieldElem_input.type = "checkbox",
			fieldElem_input.checked = service[1];


			fieldElem.append(fieldElem_label, fieldElem_input);
			formServices.append(fieldElem);
		}
	})

	.then(() => {
		$(".ui.checkbox")
			.checkbox()
			.each(function () {
				this.addEventListener("change", function () {
					const { service } = this.dataset;

					storage.set(service, this.querySelector(SELECTORS.Form_Services_Service_Toggle).checked).then(store => {
						$("body").toast({
							position: "bottom right",
							message: I18n.get(`view_Settings_toast__${store[service] ? "enabled" : "disabled"}`, I18n.get(`service_${service}`)),

							class: "success",
							className: { toast: "ui icon message" },
							showIcon: `toggle ${store[service] ? "on" : "off"}`
						});
					});
				});
			});
	});