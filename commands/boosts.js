const { Command } = require('discord-akairo');
const Util = require('../util/Util');
const Discord = require('discord.js');

module.exports = class BoostDataCommand extends Command {
	constructor() {
		super('boosts', {
			aliases: ['boosts'],
			channel: 'guild',
			ownerOnly: false
		});
	}

	exec(message) {
		if (!message.channel.name.startsWith('bot-')) return;
		Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/boosts.json'
		).then(res => {
			const embed = new Discord.MessageEmbed().setTitle(`Boosts`);
			res.forEach(boost =>
				embed.addField(
					`\`${boost.costBoost}\` Boost`,
					`exp: **×${boost.expRate}** | reward: **×${
						boost.rewardRate
					}** | livePoint: **×${boost.livePointRate}** | eventPoint:  **×${
						boost.eventPointRate
					}** | eventOnly?: ${boost.isEventOnly ? '**Yes**' : '**No**'}`
				)
			);
			embed.setTimestamp();
			message.channel.send(embed);
		});
	}
};
