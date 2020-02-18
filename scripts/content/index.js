/* global STORAGE_KEYS */
/* global storage */
/* global bouyomi */



(async () => {
	bouyomi.clientType = await storage.get(STORAGE_KEYS.BOUYOMI_TYPE);
	bouyomi._nativeClient.config = await storage.get(STORAGE_KEYS.NATIVE_BOUYOMI_CONFIG);


	storage.on("change", store => {
		const clientTypeChanges = store[STORAGE_KEYS.BOUYOMI_TYPE];
		const configChanges = store[STORAGE_KEYS.NATIVE_BOUYOMI_CONFIG];


		if (clientTypeChanges) return bouyomi.clientType = clientTypeChanges.newValue;
		if (configChanges) return bouyomi._nativeClient.config = configChanges.newValue;
	});
})();