/* global STORAGE_KEYS */
/* global storage */
/* global bouyomi */



(async () => {
	bouyomi.clientType = await storage.get(STORAGE_KEYS.BOUYOMI_TYPE);
	bouyomi._nativeClient.config = await storage.get(STORAGE_KEYS.NATIVE_BOUYOMI_CONFIG);

	bouyomi.init();
})();