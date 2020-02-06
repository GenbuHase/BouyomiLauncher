const BOUYOMI_DELIMITER = "<bouyomi>";
const BOUYOMI_SOCKET_URL = "ws://localhost:50002";

/**
 * @param {string} message
 * 
 * @param {object} [config = {}]
 * @param {number} [config.speed = -1]
 * @param {number} [config.pitch = -1]
 * @param {number} [config.volume = -1]
 * @param {number} [config.type = 0]
 */
const sendMessageToSocket = (message, config = {}) => {
	const bouyomi = new WebSocket(BOUYOMI_SOCKET_URL);
	bouyomi.addEventListener("error", () => { throw new Error("Couldn't connect to Bouyomi-chan's socket server") });

	bouyomi.addEventListener("open", () => {
		bouyomi.send([
			config.speed !== undefined ? config.speed : -1,
			config.pitch !== undefined ? config.pitch : -1,
			config.volume !== undefined ? config.volume : -1,
			config.type !== undefined ? config.type : 0,
			message
		].join(BOUYOMI_DELIMITER));
	});
};



const SELECTORS = {
	ChatList: ".yt-live-chat-item-list-renderer#items",

	Chat_ViewerMessage: "yt-live-chat-viewer-engagement-message-renderer",

	Chat_TextMessage: "yt-live-chat-text-message-renderer",
	Chat_TextMessage_AuthorName: "yt-live-chat-author-chip > #author-name.yt-live-chat-author-chip",
	Chat_TextMessage_Message: "#message"
};

/** @param {HTMLElement} messageElement */
const sanitizeChatMessage = messageElement => {
	return Array.from(messageElement.childNodes).map(fragment => {
		if (fragment.nodeName === "IMG" && fragment.classList.contains("emoji")) return fragment.alt;
		if (fragment.nodeType === Node.TEXT_NODE) return fragment.data;
	}).join("");
};


(() => {
	console.info("[Bouyomi Launcher] Launched");
	
	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") return;

			for (const chat of mutation.addedNodes) {
				if (chat.tagName.toLowerCase() === SELECTORS.Chat_TextMessage) {
					const author = chat.querySelector(SELECTORS.Chat_TextMessage_AuthorName).textContent;
					const message = sanitizeChatMessage(chat.querySelector(SELECTORS.Chat_TextMessage_Message));

					sendMessageToSocket(`${author} さん　　${message}`);
				}
			}
		}
	});
	
	const looper = setInterval(() => {
		const chatList = document.querySelector(SELECTORS.ChatList);

		if (chatList) {
			clearInterval(looper);
			observer.observe(chatList, { childList: true });
		}
	}, 1000);
})();