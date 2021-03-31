require('./KeepAlive.js')
//require('discord-reply')
const { Client } = require('discord.js');
const client = new Client({
	partials: ['GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'],
	disableMentions: 'everyone'
});
const axios = require('axios')

const chalk = require('chalk');
const owners = require('./owner.json');
client.owners = owners;


require('./Core/loadEvent.js')(client);




client.login(process.env.SEKAI_TOKEN);