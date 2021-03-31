const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

module.exports = client => {
	fs.readdirSync('./Commands')
		.map(filename =>
			filename
				.split('.')
				.slice(0, -1)
				.join('.')
		)
		.forEach(filenameWithoutExtension => {
			const command = require(`./../../../Commands/${filenameWithoutExtension}`);
			client.commands.set(command.name, command);
		});
    const COMMANDS = client.commands.array();
    let AVAILABLE = []
    let UNAVAILABLE = []
		COMMANDS.forEach(c=> c.disabled ? UNAVAILABLE.push(c.name) : AVAILABLE.push(c.name))
			console.log(
				client.logger.yellow(
					`[COMMAND | AVAILABLE]:${client.logger.green(
						AVAILABLE.length === 0 ? 'N/A' : AVAILABLE
					)}`
				)
			);
			console.log(
				client.logger.red(
					`[COMMAND | UNAVAILABLE]:${client.logger.green(
						UNAVAILABLE.length === 0 ? 'N/A' : UNAVAILABLE
					)}`
				)
			);
		
};
