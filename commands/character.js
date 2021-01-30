const Util = require('../util/Util');
const { MessageEmbed } = require('discord.js');
const { Command, Argument } = require('discord-akairo');
const UNIT = {
	light_sound: 'Leo/need',
	idol: 'MORE MORE JUMP!',
	street: 'Vivid BAD SQUAD',
	theme_park: 'Wonderlands×Showtime',
	school_refusal: '25-ji, Night Code de.',
	piapro: 'VIRTUAL SINGER'
};
const EMOJI_UNIT = {
	light_sound: '<:unit_ts_1_penlight:800616246651256862>',
	idol: '<:unit_ts_2_penlight:800616246575497226>',
	street: '<:unit_ts_3_penlight:800616246496198746>',
	theme_park: '<:unit_ts_4_penlight:800616246529097748>',
	school_refusal: '<:unit_ts_5_penlight:800616246235627542>',
	piapro: '<:unit_ts_6_penlight:800616246646800394>'
};

module.exports = class CharaDataCommand extends Command {
	constructor() {
		super('chara', {
			aliases: ['chara'],
			channel: 'guild',
			ownerOnly: false,
			args: [
				{
					id: 'chara',
					match: 'content',
					prompt: {
						start: 'Please tell me a chara firstName or givenName'
					}
				}
			]
		});
	}
	async exec(message, arg) {
		const args = arg.chara.split(' ');
		const MESSAGE_AUTHOR_ID = message.author.id;
		const CHARACTER_PROFILE = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/characterProfiles.json'
		);
		const CHARACTER_NAME = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/gameCharacters.json'
		);
		const CHARACTER_COLOR = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/gameCharacterUnits.json'
		);
		const CHARACTER_NAME_EN = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-i18n/main/en/character_name.json'
		);
		const CHARACTER_PROFILE_EN = await Util.fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-i18n/main/en/character_profile.json'
		);

		var charaId = 0;
		var charaBox = [];
		// Asume given name shall not named with others

		for (const character of CHARACTER_NAME) {
			if (
				args
					.join(' ')
					.toUpperCase()
					.endsWith(character.givenName) ||
				args.join(' ').endsWith(character.givenNameRuby)
			) {
				charaId = character.id;
				charaBox = [];
				break;
			} else if (
				args.join(' ').startsWith(character.firstName) ||
				args.join(' ').startsWith(character.firstNameRuby)
			) {
				charaId = character.id;
				if (!charaBox.includes(character.id)) {
					charaBox.push(character.id);
				}
			}
		}
		const CHARACTER_NAME_EN_ARRAY = Object.entries(CHARACTER_NAME_EN);
		const CHARACTER_PROFILE_EN_ARRAY = Object.entries(CHARACTER_PROFILE_EN);
		if (charaId == 0) {
			for (let i = 0; i < CHARACTER_NAME_EN_ARRAY.length; i++) {
				if (
					args
						.join(' ')
						.toUpperCase()
						.endsWith(CHARACTER_NAME_EN_ARRAY[i][1].givenName.toUpperCase())
				) {
					charaId = i + 1;
					charaBox = [];
					break;
				} else if (
					CHARACTER_NAME_EN_ARRAY[i][1].firstName === undefined
						? charaId === 99999
						: args
								.join(' ')
								.toUpperCase()
								.startsWith(
									CHARACTER_NAME_EN_ARRAY[i][1].firstName.toUpperCase()
								)
				) {
					charaId = i + 1;
					if (!charaBox.includes(i + 1)) {
						charaBox.push(i + 1);
					}
				}
			}
		}
		if (charaId === 0) {
			return message.reply('That character does not exist');
		}
		if (charaBox.length > 1) {
			let wait_description = [];
			for (let i = 0; i < charaBox.length; i++) {
				wait_description.push(
					`***${charaBox[i]}***.${
						CHARACTER_NAME_EN_ARRAY[charaBox[i] - 1][1].firstName === undefined
							? ''
							: CHARACTER_NAME_EN_ARRAY[charaBox[i] - 1][1].firstName
					} ${CHARACTER_NAME_EN_ARRAY[charaBox[i] - 1][1].givenName}`
				);
			}
			try {
				let wait_embed = new MessageEmbed()
					.setColor('GREEN')
					.setTitle('Please tell me a Number')
					.setDescription(wait_description);
				message.channel.send(wait_embed);
				function filter(message) {
					if (message.author.id !== MESSAGE_AUTHOR_ID) {
						return false;
					}
					const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
					return pattern.test(message.content);
				}
				message.channel.activeCollector = true;
				const response = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
					errors: ['time']
				});
				const reply = response.first().content;
				charaId = reply;
			} catch (error) {
				message.channel.send(
					new MessageEmbed().setColor('RED').setTitle('Timeout')
				);
				message.channel.activeCollector = false;
				return;
			}
		}
		const CHARA_POS = charaId - 1;
		let chara_embed = new MessageEmbed()
			.setColor(CHARACTER_COLOR[CHARA_POS].colorCode)
			.setThumbnail(
				`https://github.com/Sekai-World/sekai-viewer/blob/main/src/assets/chara_icons/chr_ts_${charaId}.png?raw=true`
			)
			.setTitle(
				`${EMOJI_UNIT[CHARACTER_COLOR[CHARA_POS].unit]} | ${
					CHARACTER_NAME_EN_ARRAY[CHARA_POS][1].firstName === undefined
						? ''
						: CHARACTER_NAME_EN_ARRAY[CHARA_POS][1].firstName
				} ${CHARACTER_NAME_EN_ARRAY[CHARA_POS][1].givenName} `
			)
			.setDescription(CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].introduction)
			.addField('Unit', UNIT[CHARACTER_COLOR[CHARA_POS].unit], true)
			.addField('Theme Color #Code', CHARACTER_COLOR[CHARA_POS].colorCode, true)
			.addField('Gender', CHARACTER_NAME[CHARA_POS].gender, true)
			.addField('Height', CHARACTER_NAME[CHARA_POS].height + 'cm', true)
			.addField(
				'Birthday',
				CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].birthday,
				true
			);
		CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].school === undefined
			? null
			: chara_embed.addField(
					'School',
					`${CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].school}、${
						CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].schoolYear
					}`,
					true
			  );
		CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].hobby === undefined
			? null
			: chara_embed.addField(
					'Hobby',
					`${CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].hobby}`,
					true
			  );
		CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].specialSkill === undefined
			? null
			: chara_embed.addField(
					'Special Skill',
					`${CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].specialSkill}`,
					true
			  );
		CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].favoriteFood === undefined
			? null
			: chara_embed.addField(
					'Favorite Food',
					`${CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].favoriteFood}`,
					true
			  );
		CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].hatedFood === undefined
			? null
			: chara_embed.addField(
					'Hated Food',
					`${CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].hatedFood}`,
					true
			  );
		CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].weak === undefined
			? null
			: chara_embed.addField(
					'Weak Point',
					`${CHARACTER_PROFILE_EN_ARRAY[CHARA_POS][1].weak}`,
					true
			  );
		message.channel.send(chara_embed);
		charaId = 0;
	}
};
