require('dotenv').config();
const { SEKAI_TOKEN, SEKAI_PREFIX, SEKAI_OWNERS } = process.env;
// const Database = require('@replit/database');
// const db = new Database();
const Client = require('./structures/Client');
const Akairo = require('discord-akairo');
 const discord = require('discord.js');
// const { MessageEmbed } = require('discord.js');
require('./KeepAlive.js')
const client = new Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	prefix: SEKAI_PREFIX,
	ownerID: SEKAI_OWNERS.split(','),
	disableEveryone: true,
	disabledEvents: []
});
const winston = require('winston');
const activities = require('./assets/json/activity');
const { stripIndents } = require('common-tags');
const codeblock = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;
const runLint = message => {
	if (message.channel.type !== 'text' || message.author.bot) return null;
	if (!codeblock.test(message.content)) return null;
	if (
		!message.channel
			.permissionsFor(message.client.user)
			.has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])
	)
		return null;
	const parsed = codeblock.exec(message.content);
	const code = {
		code: parsed[2],
		lang: parsed[1] ? parsed[1].toLowerCase() : null
	};
	return client.commandHandler.modules.get('lint')/*.exec(msg, { code, amber: false }, true)*/;

};

var logger = winston.createLogger({
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(
			log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`
		)
	)
});


client.setup();
client.on('message', message => runLint(message));

client.on('messageUpdate', (oldMessage, message) => runLint(message));

client.on('ready', () => {
	client.logger.info(
		`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`
	);
	client.setInterval(() => {
		const activity = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(activity.text, { type: activity.type });
	}, 15000);
	client.logger.info(
     `[PERMISSIONS] available permissions: ${client.util.permissionNames().join(', ')}`
   );
   client.logger.info(
     `[CHANNELS] ${client.channels.cache.array()}`
   );
});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => client.logger.error(err));

client.on('warn', warn => client.logger.warn(warn));

client.listenerHandler.on('ready', listener => {
	client.logger.info(`[LISTENING] listening ${listener.name} `);
});

client.listenerHandler.on('error', (listener, err) => {
	client.logger.info(`[LISTENING] error: ${listener.name} `);
});

client.commandHandler.on('error', (err, msg, command) => {
	client.logger.error(
		`[COMMAND${command ? `:${command.name}` : ''}]\n${err.stack}`
	);
	client.logger
		.info(
			stripIndents`
		error: \`${err.message}\`exit...`
		)
		.catch(() => null);
});

/*(async () => {
  client.logger.info('start logging in');
  try {
    await */client.login(SEKAI_TOKEN);
 /* } catch(e) {
    client.logger.error(e)
  }
  client.logger.info('logged in');
})()*/