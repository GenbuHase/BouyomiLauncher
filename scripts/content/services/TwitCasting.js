/* global STORAGE_KEYS */
/* global storage */
/* global bouyomi */



class TwitCasting {
	static get SELECTORS () {
		return {
			CommentList: ".tw-comment-list-view__scroller > div",

			Comment: ".tw-comment-item",
			Comment_AuthorName: ".tw-comment-item-name",
			Comment_Message: ".tw-comment-item-comment"
		};
	}
}



chrome.runtime.onMessage.addListener(({ serviceId }, sender, resolve) => {
	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") return;

			for (const comment of mutation.addedNodes) {
				if (comment.classList.contains(TwitCasting.SELECTORS.Comment.slice(1))) {
					const author = comment.querySelector(TwitCasting.SELECTORS.Comment_AuthorName).textContent;
					const message = comment.querySelector(TwitCasting.SELECTORS.Comment_Message).textContent;

					storage.get(STORAGE_KEYS.getServiceKey(serviceId)).then(value => {
						if (value) bouyomi.speak(`${author} さん。　${message}`);
					});
				}
			}
		}
	});
	
	const looper = setInterval(() => {
		const commentList = document.querySelector(TwitCasting.SELECTORS.CommentList);

		if (commentList) {
			clearInterval(looper);
			observer.observe(commentList, { childList: true });

			resolve({ serviceId });
		}
	}, 1000);

	return true;
});