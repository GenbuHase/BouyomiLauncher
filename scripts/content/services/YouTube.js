/* global Bouyomi */
/* global ChromeStorage */
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



const storage = new ChromeStorage("sync");

chrome.runtime.onMessage.addListener(({ id }, sender, resolve) => {
	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") return;

			for (const chat of mutation.addedNodes) {
				if ([ YouTube.SELECTORS.Chat_TextMessage, YouTube.SELECTORS.Chat_PaidMessage ].includes(chat.tagName.toLowerCase())) {
					const author = chat.querySelector(YouTube.SELECTORS.Chat_Message_AuthorName).textContent;
					const message = YouTube.sanitizeChatMessage(chat.querySelector(YouTube.SELECTORS.Chat_Message_Message));

					storage.get(id).then(store => store[id] && Bouyomi.speak(`${author} さん　　${message}`));
				}
			}
		}
	});
	
	const looper = setInterval(() => {
		const chatList = document.querySelector(YouTube.SELECTORS.ChatList);

		if (chatList) {
			clearInterval(looper);
			observer.observe(chatList, { childList: true });

			resolve({ id });
		}
	}, 1000);

	return true;
});