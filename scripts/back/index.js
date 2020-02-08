/* global SERVICES */

chrome.webNavigation.onCompleted.addListener(details => {
	for (const service of Object.entries(SERVICES)) {
		if (service[1].expression.exec(details.url)) {
			const message = {
				serviceId: service[0]
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