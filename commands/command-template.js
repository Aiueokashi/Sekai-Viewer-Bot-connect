const { Command } = require('discord-akairo');
// const Command = require('../structures/Command')
const path = require('path');

module.exports = class TemplateCommand extends Command {
  constructor() {
    super('template', {
      aliases: ['template','temp'],
      // category:"test",
      channel: 'guild',
      description: "template of commands xD",
      ownerOnly: true,
      typing: true,
      userPermission: ["ADMINISTRATOR"]
    });
  }

  exec(message) {
    if (!message.channel.name.startsWith('bot-')) return;
    message.channel.send("template!")
  }
}
