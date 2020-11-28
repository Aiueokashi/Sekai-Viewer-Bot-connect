const { Command, Argument } = require('discord-akairo');
const Util = require('../util/Util');
const Discord = require('discord.js');
const { humanizer } = require('humanize-duration');

module.exports = class ItemDataCommand extends Command {
	constructor() {
		super('item', {
			aliases: ['item'],
			channel: 'guild',
			ownerOnly: false,
			args: [
				{
					id: 'itemName',
					match: 'content',
					prompt: {
						start: 'Please tell me an item name'
					}
				}
			]
		});
	}

	async exec(message, args) {

	}
};
