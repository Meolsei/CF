const { Collection } = require("discord.js")

module.exports = class Base {
	/**
	 * @type {import("../client")}
	 */
	client = null;

	constructor(client) {
		this.constructor.applyTo(this, client);
	}

	applyCustomProperty(key, property) {
		if (typeof key === "object") {
			for (const [_key, _property] of Object.entries(key)) {
				Object.defineProperty(this, _key, { get: () => _property });
			}
			return;
		}

		return Object.defineProperty(this, key, { get: () => property });
	}

	static applyTo(base, client) {
		Object.defineProperty(base, "client", { get: () => client });
	}

	static applyCustomProperty(base, key, property) {
		Object.defineProperty(base, key, { get: () => property });
	}

	static Base /* .............. */ = Base;

	static BaseCollection = class BaseCollection extends Collection {
		constructor(client, ...args) {
			super(...args);
			Base.applyTo(this, client);
		}
	}
}