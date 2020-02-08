class Bouyomi {
	/**
	 * @param {string} message
	 */
	static speak (message) {
		// if (isExternal)

		this.Client.speak(message);
	}
}


/**
 * @typedef {Object} BouyomiConfig
 * @prop {0x0001 | 0x0010 | 0x0020 | 0x0030} [command = 0x0001] 0x0001=読み上げ / 0x0010=ポーズ / 0x0020=再開 / 0x0030=スキップ
 * @prop {number} [speed = -1]
 * @prop {number} [pitch = -1]
 * @prop {number} [volume = -1]
 * @prop {number} [type = 0]
 */
Bouyomi.Client = class Client {
	static get DELIMITER () { return "<bouyomi>" }
	static get SOCKET_URL () { return "ws://localhost:50002" }

	
	/**
	 * @param {string} message
	 * @param {BouyomiConfig} [config = {}]
	 */
	static speak (message, config = {}) {
		config = Object.assign({
			command: 0x0001,
			speed: -1,
			pitch: -1,
			volume: -1,
			type: 0
		}, config);


		const bouyomi = new WebSocket(this.SOCKET_URL);
		bouyomi.addEventListener("error", () => { throw new Error("Couldn't connect to Bouyomi-chan's socket server") });
	
		bouyomi.addEventListener("open", () => {
			bouyomi.send(this._format(message, config));
		});
	}


	/**
	 * @param {string} message
	 * @param {BouyomiConfig} config
	 */
	static _format (message, config) {
		return [
			config.command,
			config.speed,
			config.pitch,
			config.volume,
			config.type,
			message
		].join(this.DELIMITER);
	}
};

/**
 * @typedef {Object} NativeBouyomiConfig
 * @prop {number} [speed = 1] Between 0.1 and 10
 * @prop {number} [pitch = 1] Between 0 and 2
 * @prop {number} [volume = 1] Between 0 and 1
 * @prop {SpeechSynthesisVoice} [voice]
 */
Bouyomi.NativeClient = class NativeClient {
	static get VOICES () { return speechSynthesis.getVoices() }


	/**
	 * @param {string} message
	 * @param {NativeBouyomiConfig} config
	 */
	static speak (message, config = {}) {
		config = Object.assign({
			speed: 1,
			pitch: 1,
			volume: 1,
			voice: null
		}, config);


		const bouyomi = new SpeechSynthesisUtterance(message);
		bouyomi.rate = config.speed,
		bouyomi.pitch = config.pitch,
		bouyomi.volume = config.volume,
		bouyomi.voice = config.voice;

		speechSynthesis.speak(bouyomi);
	}

	/**
	 * @param {string} name
	 * @return {SpeechSynthesisVoice}
	 */
	static getVoiceByName(name) {
		return speechSynthesis.getVoices().find(voice => voice.name === name);
	}
};