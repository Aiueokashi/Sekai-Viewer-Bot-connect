const { MessageEmbed } = require('discord.js');
const userModel = require('../Models/user');
const authModel = require('../Models/auth');
const axios = require('axios');
const { fetchData } = require('../util/Util');
const { randomBytes } = require('crypto');
const instance = axios.create({
	baseURL: process.env.SEKAI_API_BASE_URL
});
instance.defaults.headers.common['X-API-TOKEN'] = process.env.SEKAI_API_TOKEN;

module.exports = {
	name: 'authentication',
	aliases: ['auth'],
	example: '',
	description: 'authentication',
	details: '',
	ownerOnly: true,
	userPermission: [],
	disabled: false,
	cooldown: 1,

	async execute(message, args, client) {
		const EVENT_NAME = await fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/events.json'
		);
		let auth_embed = new MessageEmbed();
		if (message.guild) {
			return;
		}
		var auth_info = await authModel.findOne({
			discordId: message.author.id
		});

		if (!auth_info) {
			return message.reply('You need to register your account\n`sv register`');
		}

		if (auth_info.limit > 4) {
			return message.reply('You reached limit for authentication.');
		}

		let NowEventId;
		if (Date.now() < EVENT_NAME[EVENT_NAME.length - 1]['startAt']) {
			NowEventId = EVENT_NAME[EVENT_NAME.length - 2]['id'];
		} else {
			NowEventId = EVENT_NAME[EVENT_NAME.length - 1]['id'];
		}

		try {
			var response = await instance.get(`/user/${auth_info.sekaiId}/profile`);
			// check here, if failed, do not continue to get event data
			//ok

			if (response.data.data.userProfile.word != auth_info.string) {
				auth_info.limit += 1;
				await auth_info.save();
				return message.reply('failed, auth word not found.');
			}
			try {
				var resevent = await instance.get(
					`/user/${auth_info.sekaiId}/event/${NowEventId}/ranking`
				);
				console.log(resevent.data);
			} catch (error) {
				console.error(error);
			}
			console.log('done');
		} catch (error) {
			console.error(error);
		}

		let USER = new userModel({
			guildId: auth_info.guildId,
			discordId: message.author.id,
			sekaiId: auth_info.sekaiId,
			limit: auth_info.limit + 1,
			sekaiProfile: response.data,
			sekaiRanking: resevent.data
		});

		await USER.save();
		await auth_info.deleteOne();

		auth_embed
			.setAuthor(message.author.tag, message.author.displayAvatarURL)
			.setTitle(
				'ProjectSekai user name : **' +
					response.data.data.user.userGamedata.name +
					'**'
			)
			.setDescription(
			`
      player rank : ${response.data.data.user.userGamedata.rank}\nevent rank : ${resevent.data.data.rankings[0].rank}th\nevent points : ${resevent.data.data.rankings[0].score}points`
			)
			.setTimestamp();

		message.reply(auth_embed);
	}
};
