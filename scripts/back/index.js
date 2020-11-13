/* global SERVICES */



chrome.webNavigation.onCompleted.addListener(details => {
	for (const service of Object.entries(SERVICES)) {
		if ((() => {
			if (!service[1].expression) {
				for (const expr of service[1].expressions) {
					if (expr.exec(details.url)) return true;
				}

				return;
			}
			
			if (service[1].expression.exec(details.url)) return true;
		})()) {
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
		if (!service.expression) {
			for (const expr of service.expressions) {
				filter.url.push({ urlMatches: expr.source });
			}

			continue;
		}
		
		filter.url.push({ urlMatches: service.expression.source });
	}

	return filter;
})());