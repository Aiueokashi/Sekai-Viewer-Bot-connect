const {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler
} = require('discord-akairo');
const { stripIndents } = require('common-tags');
const winston = require('winston');
const path = require('path');
const CodeType = require('../types/code');
const Database = require('@replit/database');
const evaldb = new Database();


const defprefix = process.env.SEKAI_PREFIX;
class Client extends AkairoClient {
	constructor() {
		super(
			{
				ownerID: process.env.SEKAI_OWNERS.split(',') // ['349825791401394178','475304856018616340']
			},
			{
				disableMentions: 'everyone'
			}
		);
		this.commandHandler = new CommandHandler(this, {
			directory: './commands/',
			prefix: "sv",
			allowMention: true,
			handleEdits: true,
			commandUtil: true,
			commandUtilLifetime: 60000,
			fetchMembers: true,
			defaultCooldown: 1000,
			defaultPrompt: {
				modifyStart: (text, message) => stripIndents`
					${message.author}, ${text}
					Respond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.
				`,
				modifyRetry: (text, message) => stripIndents`
					${message.author}, ${text}
					Respond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.
				`,
				timeout: message => `${message.author}, cancelled command.`,
				ended: message =>
					`${
						message.author
					}, 2 tries and you still don't understand, cancelled command.`,
				cancel: message => `${message.author}, cancelled command.`,
				retries: 2,
				stopWord: 'finish'
			}
		});
		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(
					log =>
						`[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`
				)
			)
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './inhibitors/'
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: './listeners/'
		});
	}
	setup() {
		this.commandHandler.loadAll();
		this.commandHandler.resolver.addType('code', CodeType);
		this.inhibitorHandler.loadAll();
		this.listenerHandler.setEmitters({
			process: process,
		});
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.loadAll();
	}
}
module.exports = Client;