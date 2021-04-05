const { MessageEmbed } = require('discord.js');
const userModel = require('../Models/user');
const authModel = require('../Models/auth');
const axios = require('axios');
const { fetchData } = require('../util/Util');
const stripIndent = require('strip-indent');
const { randomBytes } = require('crypto');
const instance = axios.create({
	baseURL: process.env.SEKAI_API_BASE_URL
});
instance.defaults.headers.common['X-API-TOKEN'] = process.env.SEKAI_API_TOKEN;

module.exports = {
	name: 'reloadprofile',
	aliases: ['rp'],
	example: '',
	description: 'reload user profile',
	details: 'You can reload sekai user profile 5 times per day.',
	ownerOnly: true,
	userPermission: [],
	disabled: false,
	cooldown: 10,

	async execute(message, args, client) {
		const EVENT_NAME = await fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/events.json'
		);
		let auth_embed = new MessageEmbed();
		var user_info = await userModel.findOne({
			discordId: message.author.id
		});

		if (!user_info) {
			return message.reply('You need to register your account\n`sv register`');
		}

		if (user_info.limit > 4) {
			return message.reply('You reached limit.');
		}

		let NowEventId;
		if (Date.now() < EVENT_NAME[EVENT_NAME.length - 1]['startAt']) {
			NowEventId = EVENT_NAME[EVENT_NAME.length - 2]['id'];
		} else {
			NowEventId = EVENT_NAME[EVENT_NAME.length - 1]['id'];
		}
    user_info.limit += 1;
    await user_info.save()

		try {
			var response = await instance.get(`/user/${user_info.sekaiId}/profile`);
			console.log('done');
		} catch (error) {
			console.error(error);
		}
    user_info.sekaiProfile = response.data;
    await user_info.save();





		auth_embed
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setTitle(
				'ProjectSekai user name : **' +
					response.data.data.user.userGamedata.name +
					'**'
			)
			.setDescription(
			`player rank : ${response.data.data.user.userGamedata.rank}\n`
			)
			.setTimestamp();

		message.reply(auth_embed);
	}
};
