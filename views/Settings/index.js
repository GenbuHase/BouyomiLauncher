/* global SERVICES, STORAGE_KEYS */
/* global storage */
/* global Bouyomi */
import I18n from "../libs/I18n.js";



const SELECTORS = {
	Form: "#form.ui.form",
	Form_BouyomiType: "#form_bouyomiType",
	Form_BouyomiConfig: "#form_bouyomiConfig",
	Form_BouyomiConfig_Speed: "#form_bouyomiConfig_speed",
	Form_BouyomiConfig_Pitch: "#form_bouyomiConfig_pitch",
	Form_BouyomiConfig_Volume: "#form_bouyomiConfig_volume",
	Form_BouyomiConfig_Type: "#form_bouyomiConfig_type",
	Form_Services: "#form_services",
	Form_Services_Service: ".ui.toggle[Data-Service]",
	Form_Services_Service_Toggle: "Input[Type='checkbox']"
};


I18n.autoApply()
	.then(async () => {
		const { BOUYOMI_TYPE } = STORAGE_KEYS;
		const value = await storage.get(BOUYOMI_TYPE) || "BOUYOMI";

		$(SELECTORS.Form_BouyomiType)
			.each(function () {
				this.dataset.storageKey = BOUYOMI_TYPE;
				
				this.addEventListener("change", () => {
					const clientType = this.value;
					storage.set(this.dataset.storageKey, clientType);

					$(`${SELECTORS.Form_BouyomiConfig} *[data-config-label-id]`)
						.each(function () {
							const { configLabelId } = this.dataset;
							this.querySelector(".sub.header").textContent = I18n.get(`view_Settings_form_bouyomiConfig_${configLabelId}__description__${clientType.toLowerCase()}`);
						});
				});
			})
			.dropdown("set selected", value);

		$(SELECTORS.Form_BouyomiType)
			.each(function () {
				this.dispatchEvent(new Event("change"));
			});
	})
	.then(async () => {
		/*
		 * <Div Class = "field ui checkbox toggle" Data-Storage-Key = "${STORAGE_KEYS.SERVICES}" Data-Service = "${service}">
		 *     <Label>{{ __MSG_services_${service}__ }}</Label>
		 *     <Input Type = "checkbox" />
		 * </Div>
		 */
		const formServices = document.querySelector(`${SELECTORS.Form} ${SELECTORS.Form_Services}`);
		for (const service of Object.keys(SERVICES)) {
			const key = STORAGE_KEYS.getServiceKey(service);
			const value = await storage.get(key) || false;


			const fieldElem = (() => {
				const elem = document.createElement("div");
				elem.classList.add("field", "ui", "checkbox", "toggle"),
				elem.dataset.storageKey = STORAGE_KEYS.SERVICES,
				elem.dataset.service = service;

				elem.addEventListener("change", function () {
					storage.set(key, fieldElem_input.checked).then(store =>
						console.info(I18n.get(`view_Settings_form_services_toast__${store[key] ? "enabled" : "disabled"}`, I18n.get(key)))
					);
				});

				return elem;
			})();

			const fieldElem_label = document.createElement("label");
			fieldElem_label.textContent = I18n.get(key);

			const fieldElem_input = document.createElement("input");
			fieldElem_input.type = "checkbox",
			fieldElem_input.checked = value;


			fieldElem.append(fieldElem_label, fieldElem_input);
			formServices.append(fieldElem);
		}
	})

	.then(() => {
		$(".ui.dropdown").dropdown({ preserveHTML: false });
		$(".ui.checkbox").checkbox();
		$(".ui.accordion").accordion();
	});