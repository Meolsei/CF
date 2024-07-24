const { v4 } = require("uuid");
const { CollectionManager } = require("../structs/manager");
const Menu = require("../structs/menu");

module.exports = class MenuManager extends CollectionManager {
	static name = "menus";
	static enabled = true;

	constructor(client) {
		super(client);

		// delete old menus every 5 minutes. might change to 6e4 (1 minute) instead.
		this.garbageCollector = setInterval(() => {
			for (const menu of this.values()) {
				if (menu.exited || menu.stopped) {
					this.delete(menu.token);
				}
			}
		}, 3e5);
	}
	
	create(interaction, data, options) {
		const menu = new Menu(v4(), interaction, data, options);
		this.set(menu.token, menu);
		return menu;
	}
}