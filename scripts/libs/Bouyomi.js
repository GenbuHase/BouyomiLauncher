/* global STORAGE_KEYS */
/* global storage */



const Bouyomi = (() => {
	class Bouyomi {
		static get ClientType () {
			return { Bouyomi: "BOUYOMI", Native: "NATIVE" };
		}


		/**
		 * @param {string} message
		 * @param {BouyomiConfig | NativeBouyomiConfig} config
		 */
		static async speak (message, config) {
			const client = await this._getClient();
			client.speak(message, config);
		}


		static async _getClient () {
			switch (await storage.get(STORAGE_KEYS.BOUYOMI_TYPE)) {
				case this.TYPE.Bouyomi:
					return this.Client;
				case this.TYPE.Native:
					return this.NativeClient;
			}
		}
	}


	/**
	 * @typedef {Object} ClientConfig
	 * @prop {number} [speed = -1] Between 50 and 200 (Default: -1)
	 * @prop {number} [pitch = -1] Between 50 and 200 (Default: -1)
	 * @prop {number} [volume = -1] Between 0 and 100 (Default: -1)
	 * @prop {number} [type = 0] Check Bouyomi-chan's settings (Default: 0)
	 * 
	 * @typedef {0x0001 | 0x0010 | 0x0020 | 0x0030} ClientConfig.Command 0x0001=読み上げ / 0x0010=ポーズ / 0x0020=再開 / 0x0030=スキップ
	 */
	Bouyomi.Client = class Client {
		static get DELIMITER () { return "<bouyomi>" }
		static get SOCKET_URL () { return "ws://localhost:50002" }

		static get CommandType () {
			return { Speak: 0x0001, Pause: 0x0010, Resume: 0x0020, Skip: 0x0030 };
		}


		/**
		 * @param {object} commandObj
		 * @return {string}
		 */
		static formatCommand (commandObj) {
			return [
				commandObj.commandType,
				commandObj.speed,
				commandObj.pitch,
				commandObj.volume,
				commandObj.type,
				commandObj.message
			].join(this.DELIMITER);
		}


		/** @return {ClientConfig} */
		get defaultConfig () { return { speed: -1, pitch: -1, volume: -1, type: 0 } }
		

		/** @param {ClientConfig} [config = {}] */
		constructor (config = {}) {
			this.config = Object.assign({}, this.defaultConfig, config);
		}

		/**
		 * @param {Client.CommandType[keyof Client.CommandType]} commandType
		 * @param {object} [fields = {}]
		 */
		async command (commandType, fields = {}) {
			const bouyomi = await this._createSocket();
			bouyomi.send(Client.formatCommand(Object.assign({ commandType, message: commandType }, this.config, fields)));
		}
		
		/** @param {string} message */
		async speak (message) { await this.command(Client.CommandType.Speak, { message }) }
		async pause () { await this.command(Client.CommandType.Pause) }
		async resume () { await this.command(Client.CommandType.Resume) }
		async skip () { await this.command(Client.CommandType.Skip) }


		/** @return { Promise<WebSocket> } */
		_createSocket () {
			return new Promise((resolve, reject) => {
				const bouyomi = new WebSocket(Client.SOCKET_URL);
				bouyomi.addEventListener("error", () => reject(new Error("Couldn't connect to Bouyomi-chan's socket server")));
				bouyomi.addEventListener("open", () => resolve(bouyomi));
			});
		}
	};


	/**
	 * @typedef {Object} NativeBouyomiConfig
	 * @prop {number} [speed = 1] Between 0.1 and 10 (Default: 1)
	 * @prop {number} [pitch = 1] Between 0 and 2 (Default: 1)
	 * @prop {number} [volume = 1] Between 0 and 1 (Default: 1)
	 * @prop {SpeechSynthesisVoice} [type]
	 */
	Bouyomi.NativeClient = class NativeClient {
		static get VOICES () { return speechSynthesis.getVoices() }
		static get isLoaded () { return 0 < this.VOICES.length ? true : false }


		/**
		 * @param {string} message
		 * @param {NativeBouyomiConfig} config
		 */
		static speak (message, config = {}) {
			config = Object.assign({
				speed: 1,
				pitch: 1,
				volume: 1,
				type: this.VOICES.find(voice => voice.name === "Google 日本語")
			}, config);


			const bouyomi = new SpeechSynthesisUtterance(message);
			bouyomi.rate = config.speed,
			bouyomi.pitch = config.pitch,
			bouyomi.volume = config.volume,
			bouyomi.voice = config.type;

			speechSynthesis.speak(bouyomi);
		}

		/**
		 * @param {string} name
		 * @return {SpeechSynthesisVoice}
		 */
		static getVoiceByName (name) {
			if (!this.isLoaded) return null;
			return this.VOICES.find(voice => voice.name === name);
		}

		/**
		 * @param {"load"} eventType
		 * @param {BouyomiEventCallback} callback
		 */
		static on (eventType, callback) {
			switch (eventType) {
				case "load":
					return new Promise((resolve, reject) => {
						let count = 0;
						let observer = setInterval(() => {
							if (10 < (count++)) reject(new Error("Timeout"));
			
							if (this.isLoaded) {
								clearInterval(observer);

								resolve(this);
								callback(this);
							}
						}, 500);
					});

				default:
					throw new Error(`A value of "eventType", ${eventType}, is not acceptable`);
			}
		}

		static waitUntilLoaded () {
			return new Promise((resolve, reject) => {
				let count = 0;
				let observer = setInterval(() => {
					if (10 < (count++)) reject(new Error("Timeout"));

					if (this.isLoaded) {
						clearInterval(observer);
						resolve();
					}
				}, 500);
			});
		}
	};


	return Bouyomi;
})();