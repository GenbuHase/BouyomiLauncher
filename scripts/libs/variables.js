/**
 * @typedef {Object} Service
 * @prop {string} id
 * @prop {RegExp} expression
 */

/** @type {Object<string, Service>} */
const SERVICES = {
	"001_YouTubeLiveOnViewer": {
		expression: /https?:\/\/www\.youtube\.com\/live_chat(?:_replay)?(\?.*)?/
	},

	"002_YouTubeLiveOnBroadcaster": {
		expression: /https?:\/\/studio\.youtube\.com\/channel\/([^/]+)\/livestreaming\/dashboard(\?.*)?/
	}
};

const STORAGE_KEYS = {
	BOUYOMI_TYPE: "bouyomiType",
	BOUYOMI_CONFIG: "bouyomiConfig",
	SERVICES: "services",


	/** @param {string} service */
	getServiceKey (service) { return `${this.SERVICES}_${service}` }
};