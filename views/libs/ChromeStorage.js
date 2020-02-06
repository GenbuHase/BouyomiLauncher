export default class ChromeStorage {
	/** @param {"sync" | "local"} storageType */
	constructor (storageType) {
		this.storageType = storageType;
	}

	get storage () { return chrome.storage[this.storageType] }

	get storageType () { return this._storageType }

	/** @param {"sync" | "local"} storageType */
	set storageType (storageType) {
		if (!["sync", "local"].includes(storageType)) throw new TypeError('storageType must be "sync" or "local"');

		this._storageType = storageType;
	}



	/**
	 * @param {string | string[] | Object<string, any>} keyOrListOrObj
	 * @return {Promise<Object<string, any>>}
	 */
	async get (keyOrListOrObj) {
		if (!["String", "Array", "Object"].includes(keyOrListOrObj.getClassName())) throw new TypeError('"keyOrListOrObj" must be String or String[] or Object');

		return new Promise(resolve => {
			this.storage.get(keyOrListOrObj, items => resolve(items));
		});
	}
	
	/**
	 * @param {string | Object<string, any>} keyOrObj
	 * @param {any} [value]
	 */
	async set (keyOrObj, value) {
		const data = (() => {
			if (!["String", "Object"].includes(keyOrObj.getClassName())) throw new TypeError('"keyOrObj" must be String or Object');

			if (typeof keyOrObj === "string") return { [keyOrObj]: value };
			return keyOrObj;
		})();

		return new Promise(resolve => {
			this.storage.set(data, () => resolve(data));
		});
	}

	/** @param {string | string[]} keyOrList */
	async remove (keyOrList) {
		if (!["String", "Array"].includes(keyOrList.getClassName())) throw new TypeError('"keyOrList" must be String or String[]');

		return new Promise(resolve => {
			this.storage.remove(keyOrList, () => resolve());
		});
	}

	async clear () {
		return new Promise(resolve => {
			this.storage.clear(() => resolve());
		});
	}
}