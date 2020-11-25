const { Command } = require('discord-akairo');
const winston = require('winston');
const { MessageEmbed } = require('discord.js');
var logger = winston.createLogger({
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(
			log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`
		)
	)
});

module.exports = class LoadALLCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload', 'loadall', 'reloadcommands'],
			ownerOnly: true,
			category: 'owner',
      description: 'reload existing commands',
      userPermission: ["ADMINISTRATOR"]
		});
	}

	exec(message, args) {
		logger.info(
			`[RELOADED] reloaded all command files by ${message.author.tag} |ID:${
				message.author.id
			}`
		);
		this.handler.reloadAll();
		return message.channel.send(
			new MessageEmbed()
				.setColor('BLUE')
				.setTitle('RELOAD')
				.setDescription(
					`[RELOADED COMMAND HANDLER] by ${message.author.tag} |ID:${
						message.author.id
					}`
				)
				.setTimestamp()
		);
	}
}


