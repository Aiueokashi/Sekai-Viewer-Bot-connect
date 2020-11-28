const { Command, Argument } = require('discord-akairo');
const Util = require('../util/Util');
const Discord = require('discord.js');
const { humanizer } = require('humanize-duration');
const langNameIdMap = {
	english: 'en',
	german: 'de',
	japanese: 'ja',
	spanish: 'es',
	french: 'fr',
	indonesian: 'id',
	italian: 'it',
	korean: 'ko',
	polish: 'pl',
	brazilian_portuguese: 'pt-BR',
	russian: 'ru',
	simplified_chinese: 'zh-CN',
	traditional_chinese: 'zh-TW'
};
const queryLang = Object.keys(langNameIdMap);

const charaNameIdMap = {
	ichika: 1,
	saki: 2,
	honami: 3,
	shiho: 4,
	minori: 5,
	haruka: 6,
	airi: 7,
	shizuku: 8,
	kohane: 9,
	an: 10,
	akito: 11,
	toya: 12,
	touya: 12,
	tsukasa: 13,
	emu: 14,
	nene: 15,
	rui: 16,
	kanade: 17,
	mafuyu: 18,
	ena: 19,
	mizuki: 20,
	miku: 21,
	rin: 22,
	len: 23,
	luka: 24,
	meiko: 25,
	kaito: 26
};
const queryNames = Object.keys(charaNameIdMap);

module.exports = class CharaDataCommand extends Command {
	constructor() {
		super('chara', {
			aliases: ['chara'],
			channel: 'guild',
			ownerOnly: false,
			args: [
				{
					id: 'lang',
					match: 'content',
					prompt: {
						start:
							'Please tell me a language : (en,de,ja,es,fr,id,it,ko,pl,pt-BR,ru,zh-CN,zh-TW)'
					}
				},
				{
					id: 'charaName',
					match: 'content',
					prompt: {
						start: 'Please tell me a character id or name'
					}
				}
			]
		});
	}

	async exec(message, args) {
		if (!message.channel.name.startsWith('bot-')) return;
		const prefix = process.env.SEKAI_PREFIX;
		const language = await Util.fetchData(
			`https://raw.githubusercontent.com/Sekai-World/sekai-viewer/main/public/locales/${
				args.lang
			}/character_profile.json`
		);
		const chara = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/characterProfiles.json'
		);
		const characterName = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/gameCharacters.json'
		);
		const charaColor = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/penlightColors.json'
		);
		let charaID;
		let colorID = 0;
		let langID;
		const filteredLang = queryLang.filter(elem => elem.startsWith(args.lang));
		if (filteredLang.length > 1) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setTitle('Specific a language')
					.setDescription(filteredLang.join('\n'))
					.setTimestamp()
			);
		} else if (filteredLang.length === 0) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setTitle('Error')
					.setDescription('The language matching your input is not found')
					.setTimestamp()
			);
		} else {
			langID = langNameIdMap[filteredLang[0]];
		}
		if (!isNaN(args.charaName)) {
			charaID = args.charaName;
		} else {
			const filteredNames = queryNames.filter(elem =>
				elem.startsWith(args.charaName)
			);
			if (filteredNames.length > 1) {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setTitle('Specific a chara name')
						.setDescription(filteredNames.join('\n'))
						.setTimestamp()
				);
			} else if (filteredNames.length === 0) {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setTitle('Error')
						.setDescription('The chara matching your input is not found')
						.setTimestamp()
				);
			}
			charaID = charaNameIdMap[filteredNames[0]];
		}
		charaID -= 1;
		if (!chara[charaID]) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setTitle('Error')
					.setDescription('The chara matching your input is not found')
					.setTimestamp()
			);
		}
		for (let i = 0; i < charaColor.length; i++) {
			if (charaColor[i].characterId == charaID) {
				colorID = i + 1;
			}
		}
		console.log(colorID);
		if (langID == 'ja') {
			if (charaID < 20) {
				message.channel.send(
					new Discord.MessageEmbed()
						.setColor((colorID = 0 ? charaColor[colorID].colorCode : '#33aaee'))
						.setTitle(
							`Chara Profile: ${characterName[charaID].firstName} ${
								characterName[charaID].givenName
							}`
						)
						.setURL(
							`https://sekai-world.github.io/sekai-viewer/#/chara/${charaID +
								1}`
						)
						.setDescription(`${chara[charaID].introduction}`)
						.addField(`Seiyuu:`, chara[charaID].characterVoice)
						.addField(`Birthday:`, chara[charaID].birthday)
						.addField(`Height:`, chara[charaID].height)
						.addField(
							`School:`,
							`${chara[charaID].school}|${chara[charaID].schoolYear}`
						)
						.addField(`Hobby:`, chara[charaID].hobby)
						.addField(`Specialty:`, chara[charaID].specialSkill)
						.addField(`Favorite food:`, chara[charaID].favoriteFood)
						.addField(`Disliked food:`, chara[charaID].hatedFood)
						.addField(`Weakness:`, chara[charaID].weak)
						.setTimestamp()
				);
			} else {
				message.channel.send(
					new Discord.MessageEmbed()
						.setColor(charaColor[colorID].colorCode)
						.setTitle(
							`Chara Profile: ${characterName[charaID].firstName} ${
								characterName[charaID].givenName
							}`
						)
						.setURL(
							`https://sekai-world.github.io/sekai-viewer/#/chara/${charaID +
								1}`
						)
						.setDescription(`${chara[charaID].introduction}`)
						.addField(`Birthday:`, chara[charaID].birthday)
						.addField(`Height:`, chara[charaID].height)
						.setTimestamp()
				);
			}
		} else {
			if (charaID < 20) {
				message.channel.send(
					new Discord.MessageEmbed()
						.setColor((colorID = 0 ? charaColor[colorID].colorCode : '#33aaee'))
						.setTitle(
							`Chara Profile: ${characterName[charaID].firstName} ${
								characterName[charaID].givenName
							}`
						)
						.setURL(
							`https://sekai-world.github.io/sekai-viewer/#/chara/${charaID +
								1}`
						)
						.setDescription(`${language[`${charaID+ 1}`]['introduction']}`)
						.addField(`Seiyuu:`, language[`${charaID+ 1}`]['characterVoice'])
						.addField(`Birthday:`,language[`${charaID+ 1}`]['birthday'])
						.addField(`Height:`, language[`${charaID+ 1}`]['height'])
						.addField(
							`School:`,
							`${language[`${charaID+ 1}`]['school']} | ${language[`${charaID+ 1}`]['schoolYear']}`
						)
						.addField(`Hobby:`, language[`${charaID+ 1}`]['hobby'])
						.addField(`Specialty:`,language[`${charaID+ 1}`]['specialSkill'])
						.addField(`Favorite food:`,language[`${charaID+ 1}`]['favoriteFood'])
						.addField(`Disliked food:`, language[`${charaID+ 1}`]['hatedFood'])
						.addField(`Weakness:`, language[`${charaID+ 1}`]['weak'])
						.setTimestamp()
				);
			} else {
				message.channel.send(
					new Discord.MessageEmbed()
						.setColor(charaColor[colorID].colorCode)
						.setTitle(
							`Chara Profile: ${characterName[charaID].firstName} ${
								characterName[charaID].givenName
							}`
						)
						.setURL(
							`https://sekai-world.github.io/sekai-viewer/#/chara/${charaID +
								1}`
						)
						.setDescription(`${language[`${charaID+ 1}`]['introduction']}`)
						.addField(`Birthday:`,language[`${charaID+ 1}`]['birthday'])
						.addField(`Height:`,language[`${charaID+ 1}`]['height'])
						.setTimestamp()
				);
			}
		}
	}
};
