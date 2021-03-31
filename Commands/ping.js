const { Command } = require('discord-akairo');
// const Command = require('../structures/Command')
const path = require('path');

module.exports = {
  name: 'ping',
  aliases: [],
  example: "",
  description: "Ping/Pong alive test",
  details: "ping",
  ownerOnly: true,
  userPermission: ["ADMINISTRATOR"],
  disabled: false,
  cooldown: 1,

  execute(message, args, client) {
    message.channel.send("Pong!")
  }
}
