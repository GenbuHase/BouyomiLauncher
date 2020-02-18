/**
 * @namespace ChromeStorage
 * 
 * @typedef {"sync" | "local"} ChromeStorage.StorageType
 * 
 * @typedef { { oldValue: any, newValue: any } } ChromeStorage.StorageChange
 * 
 * @typedef {"change"} ChromeStorage.EventType
 * 
 * @callback ChromeStorage.EventCallback
 * @param { Object<string, ChromeStorage.StorageChange> } changes
 */
class ChromeStorage {
	get storage () { return chrome.storage[this.storageType] }
	
	/** @return {ChromeStorage.StorageType} */
	get storageType () { return this._storageType }
	
	/** @param {ChromeStorage.StorageType} storageType */
	set storageType (storageType) {
		if (!["sync", "local"].includes(storageType)) throw new TypeError('storageType must be "sync" or "local"');

		this._storageType = storageType;
	}


	/** @param {ChromeStorage.StorageType} storageType */
	constructor (storageType) {
		this.storageType = storageType;
	}

	/**
	 * @param {ChromeStorage.EventType} eventType
	 * @param {ChromeStorage.EventCallback} [callback]
	 */
	on (eventType, callback) {
		switch (eventType) {
			case "change":
				this.storage.onChanged.addListener(callback);
				break;

			default:
				throw new Error(`A value of "eventType", "${eventType}" is not acceptable`);
		}
	}

	/**
	 * @param {string | string[] | Object<string, any>} keyOrListOrObj
	 * @return { Promise<string | Object<string, any>> }
	 */
	async get (keyOrListOrObj) {
		if (!["String", "Array", "Object"].includes(keyOrListOrObj.getClassName())) throw new TypeError('"keyOrListOrObj" must be String or String[] or Object');

		return new Promise(resolve => {
			this.storage.get(keyOrListOrObj, items => {
				if (typeof keyOrListOrObj === "string") resolve(items[keyOrListOrObj]);
				resolve(items);
			});
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



const storage = new ChromeStorage("sync");