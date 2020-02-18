/* global SERVICES, STORAGE_KEYS */
/* global storage */
/* global Bouyomi, bouyomi */

import I18n from "../libs/I18n.js";



const SELECTORS = {
	Form: "#form.ui.form",
	Form_BouyomiType: "#form_bouyomiType",
	Form_BouyomiConfig: "#form_bouyomiConfig",
	Form_BouyomiConfig_Indicator: "#form_bouyomiConfig_indicator",
	Form_NativeBouyomiConfig: "#form_nativeBouyomiConfig",
	Form_NativeBouyomiConfig_Input: "*[Data-Config-Key]",
	Form_NativeBouyomiConfig_Input__SimpleParam: ".ui.input *[Data-Config-Key]",
	Form_NativeBouyomiConfig_Speed: "#form_nativeBouyomiConfig_speed",
	Form_NativeBouyomiConfig_Pitch: "#form_nativeBouyomiConfig_pitch",
	Form_NativeBouyomiConfig_Volume: "#form_nativeBouyomiConfig_volume",
	Form_NativeBouyomiConfig_Type: "#form_nativeBouyomiConfig_type",
	Form_Services: "#form_services",
	Form_Services_Service: ".ui.toggle[Data-Service-Key]",
	Form_Services_Service_Toggle: "Input[Type='checkbox']"
};

const animateByBouyomiType = bouyomiType => {
	document.querySelector(SELECTORS.Form_BouyomiConfig).classList[bouyomiType === Bouyomi.ClientType.Bouyomi ? "add" : "remove"]("info");
	$(SELECTORS.Form_NativeBouyomiConfig).transition(bouyomiType === Bouyomi.ClientType.Bouyomi ? "hide" : "show");
};


I18n.autoApply()
	.then(async () => { // About BouyomiType
		const { BOUYOMI_TYPE } = STORAGE_KEYS;
		const stored =
			await storage.get(BOUYOMI_TYPE) ||
			(await storage.set(BOUYOMI_TYPE, Bouyomi.ClientType.Bouyomi))[BOUYOMI_TYPE];

		$(SELECTORS.Form_BouyomiType)
			.each(function () {
				this.dataset.storageKey = BOUYOMI_TYPE;
				
				this.addEventListener("change", () => {
					const bouyomiType = this.value;
					storage.set(this.dataset.storageKey, bouyomiType);

					animateByBouyomiType(bouyomiType);
				});
			})
			.dropdown("set selected", stored);

		animateByBouyomiType(stored);
	})
	.then(async () => { // About NativeBouyomiConfig
		const { NATIVE_BOUYOMI_CONFIG } = STORAGE_KEYS;
		const stored =
			await storage.get(NATIVE_BOUYOMI_CONFIG) ||
			(await storage.set(NATIVE_BOUYOMI_CONFIG, bouyomi._nativeClient.defaultConfig))[NATIVE_BOUYOMI_CONFIG];

		$(SELECTORS.Form_NativeBouyomiConfig)
			.find(SELECTORS.Form_NativeBouyomiConfig_Input)
			.each(function () {
				this.addEventListener("change", async () => {
					const config = Object.assign({}, bouyomi._nativeClient.defaultConfig, await storage.get(NATIVE_BOUYOMI_CONFIG));

					const isValid = this.reportValidity();
					$(this).parent(".ui.field")[!isValid ? "addClass" : "removeClass"]("error");

					if (!isValid) return;
					storage.set(NATIVE_BOUYOMI_CONFIG,
						Object.assign(config, {
							[this.dataset.configKey]: this.value
						})
					);
				});
			});

		$(SELECTORS.Form_NativeBouyomiConfig)
			.find(SELECTORS.Form_NativeBouyomiConfig_Input__SimpleParam)
			.each(function () {
				const { configKey } = this.dataset;
				this.value = stored[configKey] || bouyomi._nativeClient.defaultConfig[configKey];
			});
		

		await bouyomi._nativeClient.on("load");

		const dropdown = document.querySelector(SELECTORS.Form_NativeBouyomiConfig_Type);
		for (const voice of Bouyomi.NativeClient.Voices) {
			dropdown.appendChild(
				new Option(voice.name, voice.name)
			);
		}

		$(SELECTORS.Form_NativeBouyomiConfig_Type)
			.each(function () {
				const { configKey } = this.dataset;
				const voiceName = stored[configKey];

				if (!Bouyomi.NativeClient.getVoiceByName(voiceName)) {
					const newVoiceName = stored[configKey] = Bouyomi.NativeClient.Voices[0].name;

					this.value = newVoiceName,
					storage.set(NATIVE_BOUYOMI_CONFIG, stored);

					return;
				}

				this.value = voiceName;
			});
	})
	.then(async () => { // About Services
		const formServices = document.querySelector(SELECTORS.Form_Services);
		for (const service of Object.keys(SERVICES)) {
			const key = STORAGE_KEYS.getServiceKey(service);
			const value = await storage.get(key) || false;


			const fieldElem = (() => {
				const elem = document.createElement("div");
				elem.classList.add("field", "ui", "checkbox", "toggle"),
				elem.dataset.storageKey = STORAGE_KEYS.SERVICES,
				elem.dataset.serviceKey = service;

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

	.then(() => { // About Initializing Components
		$(".ui.dropdown").dropdown({ preserveHTML: false });
		$(".ui.checkbox").checkbox();
		$(".ui.accordion").accordion();

		$(SELECTORS.Form).removeClass("loading");
	});