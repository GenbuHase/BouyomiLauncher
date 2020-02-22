(() => {
	/** @return {String} A type of the instance */
	Object.prototype.getClassName = function () {
		return Object.prototype.toString.call(this).slice(8, -1);
	};

	Object.defineProperties(Object.prototype, {
		getClassName: { configurable: true, writable: true, enumerable: false }
	});
})();

(() => {
	/**
	 * @param {string} str
	 * @param {RegExp} matcher
	 * 
	 * @return {RegExpMatchArray[]}
	 */
	String.prototype.matchGlobally = function (matcher) {
		const result = [];

		let mem;
		while ((mem = matcher.exec(this))) {
			if (mem.index === matcher.lastIndex) matcher.lastIndex++;

			result.push(mem);
		}

		return result;
	};

	Object.defineProperties(String.prototype, {
		matchGlobally: { configurable: true, writable: true, enumerable: false }
	});
})();

(() => {
	// eslint-disable-next-line no-global-assign
	chrome = chrome || {};

	(() => {
		if (!chrome.i18n) {
			chrome.i18n = {};
			chrome.i18n.language = new URLSearchParams(location.search).get("lang") || navigator.language;

			fetch("/_locales/en/messages.json")
				.then(resp => resp.json()).then(messages => chrome.i18n.defaultMessages = messages)

				.then(() => fetch(`/_locales/${chrome.i18n.language}/messages.json`))
					.then(resp => resp.json()).then(messages => chrome.i18n.messages = Object.assign({}, chrome.i18n.defaultMessages, messages))
					.catch(() => chrome.i18n.messages = chrome.i18n.defaultMessages);
		}

		if (!chrome.i18n.getMessage) {
			/**
			 * @param {string} varName
			 * @return {string}
			 */
			chrome.i18n.getMessage = varName => (chrome.i18n.messages[varName] && chrome.i18n.messages[varName].message) || null;
		}
	})();

	(() => {
		if (!chrome.storage) {
			/**
			 * @callback StorageGetCallback
			 * @param {Object<string, any>} items
			 */

			/**
			 * @param {string | string[] | Object<string, any>} keyOrListOrObj
			 * @param {StorageGetCallback} callback
			 */
			const get = function (keyOrListOrObj, callback) {
				let result = (() => {
					let result = {};

					if (typeof keyOrListOrObj === "string") return { [keyOrListOrObj]: (JSON.parse(sessionStorage.getItem(keyOrListOrObj)) || {}).value };
					if (Array.isArray(keyOrListOrObj)) {
						for (const key of keyOrListOrObj) {
							result[key] = (JSON.parse(sessionStorage.getItem(key)) || {}).value;
						}

						return result;
					}

					if (keyOrListOrObj.getClassName() === "Object") {
						for (const key of Object.keys(keyOrListOrObj)) {
							result[key] = (sessionStorage.getItem(key) && JSON.parse(sessionStorage.getItem(key)).value) || keyOrListOrObj[key];
						}

						return result;
					}
				})();

				callback(result);
			};


			/** @callback StorageSetCallback */
			/**
			 * @param {Object<string, any>} keyValuePairObj
			 * @param {StorageSetCallback} callback
			 */
			const set = function (keyValuePairObj, callback) {
				let changes = {};
				for (const entry of Object.entries(keyValuePairObj)) {
					changes[entry[0]] = {};
					changes[entry[0]].oldValue = sessionStorage.getItem(entry[0]) ? JSON.parse(sessionStorage.getItem(entry[0])).value : null,
					changes[entry[0]].newValue = entry[1];

					sessionStorage.setItem(entry[0], JSON.stringify({ value: entry[1] }));
				}

				if (onChanged._handler) onChanged._handler(changes);
				callback();
			};


			/** @callback StorageRemoveCallback */
			/**
			 * @param {string | string[]} keyOrList
			 * @param {StorageRemoveCallback} callback
			 */
			const remove = function (keyOrList, callback) {
				if (typeof keyOrList === "string") sessionStorage.removeItem(keyOrList);
				if (Array.isArray(keyOrList)) {
					for (const key of keyOrList) sessionStorage.removeItem(key);
				}

				callback();
			};


			/** @callback StorageClearCallback */
			/** @param {StorageClearCallback} callback */
			const clear = function (callback) {
				sessionStorage.clear();
				callback();
			};


			/**
			 * @callback StorageOnChangedCallback
			 * @param { Object<string, { oldValue: any, newValue: any }> } changes
			 */
			const onChanged = {
				/** @param {StorageOnChangedCallback} callback */
				addListener (callback) {
					this._handler = callback;
				}
			};



			chrome.storage = {};
			chrome.storage.sync = chrome.storage.local = { get, set, remove, clear, onChanged };
		}
	})();
})();