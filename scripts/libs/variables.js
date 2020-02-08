/**
 * @typedef {Object} Service
 * @prop {string} id
 * @prop {RegExp} expression
 */

/** @type {Object<string, Service>} */
const SERVICES = {
	YouTubeLiveOnViewer: {
		expression: /https?:\/\/www\.youtube\.com\/live_chat(?:_replay)?(\?.*)?/
	},

	YouTubeLiveOnBroadcaster: {
		expression: /https?:\/\/studio\.youtube\.com\/channel\/([^/]+)\/livestreaming\/dashboard(\?.*)?/
	}
};