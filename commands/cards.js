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

const cardPrefixIdMap = {
  
};
const queryPrefix = Object.keys(cardPrefixIdMap);

module.exports = class CardDataCommand extends Command {
	constructor() {
		super('card', {
			aliases: ['card'],
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
					id: 'cardPrefix',
					match: 'content',
					prompt: {
						start: 'Please tell me a card prefix or id'
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
			}/card_prefix.json`
		);
		const cards = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/cards.json'
		);
		const characterName = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/gameCharacters.json'
		);
		const charaColor = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/penlightColors.json'
		);
		let cardprefix;
		let langID;
		let colorID;
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
		if (!isNaN(args.cardPrefix)) {
			cardprefix = args.cardPrefix;
		} else {
			const filteredPrefix = queryPrefix.filter(elem =>
				elem.startsWith(args.cardPrefix)
			);
			if (filteredPrefix.length > 1) {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setTitle('Specific an card id or prefix')
						.setDescription(filteredPrefix.join('\n'))
						.setTimestamp()
				);
			} else if (filteredPrefix.length === 0) {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setTitle('Error')
						.setDescription('The card matching your input is not found')
						.setTimestamp()
				);
			}
			cardprefix = cardPrefixIdMap[filteredPrefix[0]];
		}
		cardprefix -= 1;
		let cardID;
		cardID = cardprefix;
		if (!cards[cardprefix]) {
			return message.channel.send(
				new Discord.MessageEmbed()
					.setTitle('Error')
					.setDescription('The card matching your input is not found')
					.setTimestamp()
			);
		}
		for (let i = 0; i < charaColor.length; i++) {
			if (charaColor[i].characterId == cardprefix) {
				colorID = i + 1;
			}
		}
		if (langID == 'ja') {
			message.channel.send(
				new Discord.MessageEmbed()
					.setColor((colorID = 0 ? charaColor[colorID].colorCode : '#33aaee'))
					.setTitle(
						`Chara Profile: ${characterName[cardID].firstName} ${
							characterName[cardID].givenName
						}`
					)
					.setURL(`https://sekai-world.github.io/sekai-viewer/#/card/${cardID}`)
					.setDescription(`${cards[cardID].prefix}`)
					.addField(`Rareity:`, cards[cardID].rareity)
					.addField(`Attribute:`, cards[cardID].attr)
					.addField(`Skill:`, cards[cardID].cardSkillName)
					.addField(`GachaPhrase:`, `${cards[cardID].gachaPhrase}`)
					.addField(`Available From:`, humanizer()(cards[cardID].releaseAt))
					.setTimestamp()
			);
		}
	}
};
