const { Command } = require('discord-akairo');
const { inspect } = require('util');
const { stripIndents } = require('common-tags');
const path = require('path');
const discord = require('discord.js');
const DClient = new discord.Client();
const winston = require('winston')
var logger = winston.createLogger({
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(
			log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`
		)
	)
});

module.exports = class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			category: 'owner',
			description: 'evaluate command',
			ownerOnly: true,
			typing: false,
			cooldown: 2000,
			allowMention: false
		});
	}
	async exec(message) {
		const prefix = process.env.SEKAI_PREFIX;
		const args = message.content.slice(prefix.length + 5).split(' ');
		let evaled;
		var sourceStr = message.content;
		var code = sourceStr.slice(prefix.length + 4);
		try {

			message.react('✅');
			logger.info(`[EVAL] Used by ${message.author.tag} ID:${message.author.id}`)
			evaled = await eval(args.join(' '));
		} catch (error) {
			logger.error(`[EVAL ERR] Used by ${message.author.tag} ID:${message.author.id}`);
			var errormsg = message.channel.send({
				embed: {
					color: 0x00ae86,
					title: 'ERROR',
					description: 'code:```javascript\n' + code + '```ERROR:```ml\n' + error + '```'
				}
			});
			message.react('❎');
		}
	}
};
