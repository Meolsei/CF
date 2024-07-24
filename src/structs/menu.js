const { ActionRowBuilder, CommandInteraction } = require("discord.js"),
	{ default: axios } = require("axios"),
	{ Base } = require("./base"),
	{ BackButton, StopButton, NextButton } = require("./buttons"),
	alwaysNull = () => null;

module.exports = class Menu extends Base {
	constructor(token, interaction, data, options) {
		super(interaction.client);
		this.applyCustomProperty({ interaction });

		// Options
		this.options = {
			loop: false,
			hideStopButton: false,
			removeButtonsOnStop: false, // I dont need to explain this idiot. (It adds the buttons)
			makeContent: alwaysNull, // Function to make the message content.
			makeEmbed: alwaysNull, // Function to make the embed.
			...options, // This	applies the provided options, the above are the defaults.
		};

		this.token = token;
		this.data = data;

		this.idleTimeout = setInterval(() => {
			if (Date.now() > (this.lastInteraction + 60e3)) {
				this.stop();
			}
		}, 1e3);

		this.update();
	}

	page = 0;
	lastInteraction = Date.now();
	deleted = false;
	stopped = false;

	attachmentMessages = [];

	// EMOTIONAL SUPPORT!! DO NOT REMOVE!!! IMPORTANT!!!!!!
	exited = false;
	emotional_support = true;

	get makeContent() { return this.options.makeContent ?? alwaysNull; }
	get makeEmbed() { return this.options.makeEmbed ?? alwaysNull; }


	makeButtons() {
		if (this.options.removeButtonsOnStop && this.stopped) {
			return [];
		}

		return [new ActionRowBuilder().addComponents(...([
			new BackButton(`MENU_${this.token}_BACK`).setDisabled(this.stopped || (!this.options.loop && this.page === 0)),
			this.options.hideStopButton
				? null
				: new StopButton(`MENU_${this.token}_STOP`).setDisabled(this.stopped),
			new NextButton(`MENU_${this.token}_NEXT`).setDisabled(this.stopped || (!this.options.loop && this.page === (this.data.length - 1))),
		].filter(btn => btn !== null)))];
	}

	async update(interaction, timeout = false) {
		const post = this.data[this.page];


		// this is a fucking horrible fix 

		for (const message of this.attachmentMessages) {
			if (/(mp4|webm|flv|mov)$/i.test(post?.file?.ext || "")) {
				message.edit(post.file.url);
			} else {
				this.attachmentMessages.shift();
				message.delete();
			}
		}
		let attachments = [], deferred = false;

		if (/(mp4|webm|flv|mov)$/i.test(post?.file?.ext || "") && this.attachmentMessages.length === 0) {
			this.attachmentMessages.push(await this.interaction.channel.send(post.file.url));
		}

		const payload = {
			content: this.makeContent(post),
			embeds: [this.makeEmbed(post)],
			components: this.makeButtons(),
			attachments,
		};

		if (timeout) {
			return await (await this.interaction.fetchReply()).edit(payload);
		}

		if (deferred) {
			return await this.interaction.editReply(payload);
		}

		if (!interaction) {
			return await this.interaction.reply(payload);
		}

		return await interaction.update(payload);
	}


	async next(interaction) {
		if ((!this.options.loop && (this.data.length - 1) === this.page) || this.stopped || this.exited || interaction.user.id !== this.interaction.user.id) {
			return;
		}

		this.lastInteraction = Date.now();

		this.page = this.page >= this.data.length
			? this.page = 0
			: this.page + 1;

		return await this.update(interaction);
	}

	async back(interaction) {
		if ((!this.options.loop && this.page === 0) || this.stopped || this.exited || interaction.user.id !== this.interaction.user.id) {
			return;
		}
		this.page = this.page < 0
			? this.page = this.data.length - 1
			: this.page - 1;

		this.lastInteraction = Date.now();
		return await this.update(interaction);
	}

	async stop(interaction) {
		clearInterval(this.idleTimeout);
		this.stopped = true;
		return await this.update(interaction, true);
	}
}