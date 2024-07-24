const Base = require("./base");

module.exports = class Manager extends Base {
	static name = "Unknown";
	static enabled = false;
	/**
	 * @type {import("../client")}
	 */
	client = null;

	constructor(client) {
		super(client);
	}
	
	static CollectionManager = class CollectionManager extends Base.BaseCollection {
		static name = "Unknown";
		static enabled = false;
		constructor(client) {
			super(client);
		}
	}
}