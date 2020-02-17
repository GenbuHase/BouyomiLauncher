/* global SERVICES, STORAGE_KEYS */
/* global storage */
/* global Bouyomi */

import I18n from "../libs/I18n.js";



const SELECTORS = {
	Form: "#form.ui.form",
	Form_BouyomiType: "#form_bouyomiType",
	Form_BouyomiConfig: "#form_bouyomiConfig",
	Form_BouyomiConfig_Indicator: "#form_bouyomiConfig_indicator",
	Form_NativeBouyomiConfig: "#form_nativeBouyomiConfig",
	Form_NativeBouyomiConfig_Speed: "#form_nativeBouyomiConfig_speed",
	Form_NativeBouyomiConfig_Pitch: "#form_nativeBouyomiConfig_pitch",
	Form_NativeBouyomiConfig_Volume: "#form_nativeBouyomiConfig_volume",
	Form_NativeBouyomiConfig_Type: "#form_nativeBouyomiConfig_type",
	Form_Services: "#form_services",
	Form_Services_Service: ".ui.toggle[Data-Service]",
	Form_Services_Service_Toggle: "Input[Type='checkbox']"
};

const animateByBouyomiType = bouyomiType => {
	$(SELECTORS.Form_BouyomiConfig_Indicator).transition(bouyomiType === Bouyomi.ClientType.Bouyomi ? "show" : "hide", { displayType: "flex" });
	$(SELECTORS.Form_NativeBouyomiConfig).transition(bouyomiType === Bouyomi.ClientType.Bouyomi ? "hide" : "show");
};


I18n.autoApply()
	.then(async () => {
		const { BOUYOMI_TYPE } = STORAGE_KEYS;
		const value = await storage.get(BOUYOMI_TYPE) || "BOUYOMI";

		$(SELECTORS.Form_BouyomiType)
			.each(function () {
				this.dataset.storageKey = BOUYOMI_TYPE;
				
				this.addEventListener("change", () => {
					const bouyomiType = this.value;
					storage.set(this.dataset.storageKey, bouyomiType);

					animateByBouyomiType(bouyomiType);
				});
			})
			.dropdown("set selected", value);

		animateByBouyomiType(value);
	})
	.then(async () => {
		await Bouyomi.NativeClient.waitUntilLoaded();

		const VOICES = speechSynthesis.getVoices();

		for (const voice of VOICES) {
			document.querySelector(SELECTORS.Form_NativeBouyomiConfig_Type).appendChild(
				new Option(voice.name, voice.name)
			);
		}
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

				elem.addEventListener("change", () => {
					storage.set(key, fieldElem_input.checked);
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