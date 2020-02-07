class Bouyomi {
	static get DELIMITER () { return "<bouyomi>" }
	static get SOCKET_URL () { return "ws://localhost:50002" }

	
	/**
	 * @param {string} message
	 * 
	 * @param {object} [config = {}]
	 * @param {number} [config.speed = -1]
	 * @param {number} [config.pitch = -1]
	 * @param {number} [config.volume = -1]
	 * @param {number} [config.type = 0]
	 */
	static sendMessage (message, config = {}) {
		const bouyomi = new WebSocket(this.SOCKET_URL);
		bouyomi.addEventListener("error", () => { throw new Error("Couldn't connect to Bouyomi-chan's socket server") });
	
		bouyomi.addEventListener("open", () => {
			bouyomi.send([
				config.speed !== undefined ? config.speed : -1,
				config.pitch !== undefined ? config.pitch : -1,
				config.volume !== undefined ? config.volume : -1,
				config.type !== undefined ? config.type : 0,
				message
			].join(this.DELIMITER));
		});
	}
}