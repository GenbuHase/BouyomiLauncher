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



chrome.webNavigation.onCompleted.addListener(details => {
	for (const service of Object.entries(SERVICES)) {
		if (service[1].expression.exec(details.url)) {
			const message = {
				id: service[0]
			};

			chrome.tabs.sendMessage(details.tabId, message, { frameId: details.frameId });
			break;
		}
	}
}, (() => {
	const filter = {};
	filter.url = [];

	for (const service of Object.values(SERVICES)) {
		filter.url.push({ urlMatches: service.expression.source });
	}

	return filter;
})());