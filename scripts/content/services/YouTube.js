/* global STORAGE_KEYS */
/* global storage */
/* global bouyomi */



class YouTube {
	static get SELECTORS () {
		return {
			ChatList: ".yt-live-chat-item-list-renderer#items",
		
			Chat_ViewerMessage: "yt-live-chat-viewer-engagement-message-renderer",
			Chat_TextMessage: "yt-live-chat-text-message-renderer",
			Chat_PaidMessage: "yt-live-chat-paid-message-renderer",
		
			Chat_Message_AuthorName: "#author-name",
			Chat_Message_Message: "#message",
		};
	}


	/** @param {HTMLElement} messageElement */
	static sanitizeChatMessage (messageElement) {
		return Array.from(messageElement.childNodes).map(fragment => {
			if (fragment.nodeName === "IMG" && fragment.classList.contains("emoji")) return fragment.alt;
			if (fragment.nodeType === Node.TEXT_NODE) return fragment.data;
		}).join("");
	}
}



chrome.runtime.onMessage.addListener(({ serviceId }, sender, resolve) => {
	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") return;

			for (const chat of mutation.addedNodes) {
				if ([ YouTube.SELECTORS.Chat_TextMessage, YouTube.SELECTORS.Chat_PaidMessage ].includes(chat.tagName.toLowerCase())) {
					const author = chat.querySelector(YouTube.SELECTORS.Chat_Message_AuthorName).textContent;
					const message = YouTube.sanitizeChatMessage(chat.querySelector(YouTube.SELECTORS.Chat_Message_Message));

					storage.get(STORAGE_KEYS.getServiceKey(serviceId)).then(value => {
						if (value) bouyomi.speak(`${author} さん。　${message}`);
					});
				}
			}
		}
	});
	
	const looper = setInterval(() => {
		const chatList = document.querySelector(YouTube.SELECTORS.ChatList);

		if (chatList) {
			clearInterval(looper);
			observer.observe(chatList, { childList: true });

			resolve({ serviceId });
		}
	}, 1000);

	return true;
});