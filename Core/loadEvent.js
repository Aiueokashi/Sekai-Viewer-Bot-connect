const { Collection } = require('discord.js');
const chalk = require('chalk');

const getExtensionsHandler = require('./getEventFile');

const ExtensionHandlersRun = (handlers, ...events) =>
	handlers.forEach(h => h(...events));

module.exports = client => {
	const { ready, ...ExtensionHandlerMap } = getExtensionsHandler();

	client.commands = new Collection();
	client.logger = chalk;

	process.on('unhandledRejection', console.warn);
	client.once('ready', () => ExtensionHandlersRun(ready, client));

	Object.keys(ExtensionHandlerMap).forEach(h =>
		client.on(h, (...events) =>
			ExtensionHandlersRun(ExtensionHandlerMap[h], ...events, client)
		)
	);
};
