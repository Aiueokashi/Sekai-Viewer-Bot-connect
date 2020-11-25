const { Command } = require('discord-akairo');
// const Command = require('../structures/Command')
const path = require('path');

module.exports = class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      // category:"test",
      channel: 'guild',
      description: "Ping/Pong alive test",
      ownerOnly: true,
      // typing: true,
      userPermission: ["ADMINISTRATOR"]
    });
  }

  exec(message) {
    if (!message.channel.name.startsWith('bot-')) return;
    message.channel.send("Pong!")
  }
}
