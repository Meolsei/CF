const { ButtonBuilder } = require("discord.js");

module.exports = class Buttons {
	static BackButton = class BackButton extends ButtonBuilder {
		constructor(customId) {
			super();
			this
				.setStyle(1)
				.setLabel("Back")
				.setCustomId(customId);
		}
	}

	static NextButton = class NextButton extends ButtonBuilder {
		constructor(customId) {
			super();
			this
				.setStyle(1)
				.setLabel("Next")
				.setCustomId(customId);
		}
	}
	
	static StopButton = class StopButton extends ButtonBuilder {
		constructor(customId) {
			super();
			this
				.setStyle(1)
				.setLabel("Stop")
				.setCustomId(customId);
		}
	}
}