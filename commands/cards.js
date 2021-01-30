const {
	Command,
	Argument
} = require('discord-akairo');
const Util = require('../util/Util');
const Discord = require('discord.js');
const {
	humanizer
} = require('humanize-duration');
const RARITY_POWER = {
	1: ['19', '39', '59'],
	2: ['29', '59', '89'],
	3: ['49', '99', '149'],
	4: ['59', '119', '179']
};
const RATE = {
	1: '<:5_material:800619611330576395>',
	2: '<:5_material:800619611330576395> ×5',
	3: '<:5_material:800619611330576395> ×50',
	4: '<:4_material2:800619591989985311> (<:5_material:800619611330576395>×2000 = <:4_material2:800619591989985311>)'
};
const ATTR = {
	cool: '<:icon_attribute_cool:800616145957945354>',
	cute: '<:icon_attribute_cute:800616146046550027>',
	happy: '<:icon_attribute_happy:800616145916395530>',
	mysterious: '<:icon_attribute_mysterious:800616145954275349>',
	pure: '<:icon_attribute_pure:800616145916919839>'
};

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
const LARGE_EMOJI_UNIT = {
	light_sound: '<:Leo_need:800616285683712040>',
	idol: '<:MORE_MORE_JUMP:800616285729062912>',
	street: '<:Vivid_BAD_SQUAD:800616288644890644>',
	theme_park: '<:WANDERLANDS_SHOWTIME:800616286752997376>',
	school_refusal: '<:NIGHT_CODE:800616285980983297>'
};
const RARELITY = {
	1: '<:rarity_star_normal:800616036910104606>',
	2: '<:rarity_star_normal:800616036910104606><:rarity_star_normal:800616036910104606>',
	3: '<:rarity_star_normal:800616036910104606><:rarity_star_normal:800616036910104606><:rarity_star_normal:800616036910104606>',
	4: '<:rarity_star_normal:800616036910104606><:rarity_star_normal:800616036910104606><:rarity_star_normal:800616036910104606><:rarity_star_normal:800616036910104606>'
};
const TRAINING_RARELITY = {
	1: '<:rarity_star_normal:800616036910104606>',
	2: '<:rarity_star_normal:800616036910104606><:rarity_star_normal:800616036910104606>',
	3: '<:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200>',
	4: '<:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200>'
};

module.exports = class CardDataCommand extends Command {
	constructor() {
		super('card', {
			aliases: ['card'],
			channel: 'guild',
			ownerOnly: false,
			args: [{
				id: 'cardPrefix',
				match: 'content',
				prompt: {
					start: 'Please tell me a card prefix'
				}
			}]
		});
	}

	async exec(message, arg) {
		const args = arg.cardPrefix.split(' ');
		const MESSAGE_AUTHOR_ID = message.author.id;
		const CARD_PREFIX = await fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/cards.json'
		);
		const CHARACTER_NAME = await fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/gameCharacters.json'
		);
		const CARD_SKILL = await fetchData(
			'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/skills.json'
		);
		var cardId = 0;
		var CARD_POS = -1;
		var cardBox = [];
		var charaId = 0;
		var charaBox1 = [];
		var charaBox2 = [];

		for (let i = 0; i < CARD_PREFIX.length; i++) {
			if (
				CARD_PREFIX[i].prefix
				.toLowerCase()
				.endsWith(args.join(' ').toLowerCase())
			) {
				cardId = CARD_PREFIX[i].id;
				CARD_POS = i;
				if (!cardBox.includes(i)) {
					cardBox.push(i);
				}
			} else if (
				CARD_PREFIX[i].prefix
				.toLowerCase()
				.startsWith(args.join(' ').toLowerCase())
			) {
				cardId = CARD_PREFIX[i].id;
				CARD_POS = i;
				if (!cardBox.includes(i)) {
					cardBox.push(i);
				}
			}
		}

		if (cardId == 0) {
			for (chara of CHARACTER_NAME) {
				if (
					args
					.join(' ')
					.toUpperCase()
					.endsWith(chara.givenName) ||
					args.join(' ').endsWith(chara.givenNameRuby)
				) {
					charaId = chara.id;
					charaBox1 = [];
					break;
				} else if (
					args.join(' ').startsWith(chara.firstName) ||
					args.join(' ').startsWith(chara.firstNameRuby)
				) {
					charaId = chara.id;
					if (!charaBox1.includes(chara.id)) {
						charaBox1.push(chara.id);
					}
				}
			}
			if (charaId !== 0) {
				if (charaBox1.length > 1) {
					let wait_description = [];
					for (let i = 0; i < charaBox1.length; i++) {
						wait_description.push(
							`***${charaBox1[i]}***.${
								CHARACTER_NAME[charaBox1[i] - 1].firstName === undefined
									? ''
									: CHARACTER_NAME[charaBox1[i] - 1].firstName
							} ${CHARACTER_NAME[charaBox[i] - 1].givenName}`
						);
					}
					try {
						let wait_embed = new MessageEmbed()
							.setColor('GREEN')
							.setTitle('表示したいキャラの番号を入力してください。')
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
							new MessageEmbed().setColor('RED').setTitle('タイムアウト')
						);
						message.channel.activeCollector = false;
						return;
					}
				}
				for (let i = 0; i < CARD_PREFIX.length; i++) {
					if (CARD_PREFIX[i].characterId === charaId) {
						charaBox2.push(i);
					}
				}
				if (charaBox2.length > 1) {
					cardBox = charaBox2;
				}
			} else {
				return message.channel.send('That character does not exist');
			}
		}

		if (cardBox.length > 1) {
			let wait_description = [];

			for (let i = 0; i < cardBox.length; i++) {
				for (let j = 0; j < CHARACTER_NAME.length; j++) {
					if (CARD_PREFIX[cardBox[i]].characterId === CHARACTER_NAME[j].id) {
						wait_description.push(
							`***${cardBox[i]}***.${CARD_PREFIX[cardBox[i]].prefix} (${
								CHARACTER_NAME[j].firstName === undefined
									? ''
									: CHARACTER_NAME[j].firstName
							} ${CHARACTER_NAME[j].givenName}) | ${
								TRAINING_RARELITY[CARD_PREFIX[cardBox[i]].rarity]
							}`
						);
					}
				}
			}
			try {
				let wait_embed = new MessageEmbed()
					.setColor('GREEN')
					.setTitle('表示したいカードの番号を入力してください。')
					.setDescription(wait_description);
				message.channel.send(wait_embed);

				function filter(message) {
					if (message.author.id !== MESSAGE_AUTHOR_ID) {
						return false;
					}
					const pattern = /^[0-9]{1,3}(\s*,\s*[0-9]{1,3})*$/g;
					return pattern.test(message.content);
				}
				message.channel.activeCollector = true;
				const response = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
					errors: ['time']
				});
				const reply = response.first().content;
				CARD_POS = reply;
			} catch (error) {
				message.channel.send(
					new MessageEmbed().setColor('RED').setTitle('タイムアウト')
				);
				message.channel.activeCollector = false;
				return;
			}
		}
		const SKILL_DURATION = CARD_PREFIX[CARD_POS].skillId + 3;
		const PERFECT_SKILL_ID = CARD_PREFIX[CARD_POS].skillId + 6;
		const RECOVER_SKILL_ID = CARD_PREFIX[CARD_POS].skillId + 6;
		const RECOVER_SKILL_ID_2 = CARD_PREFIX[CARD_POS].skillId + 3;
		const SKILL =
			CARD_PREFIX[CARD_POS].skillId > 4 && CARD_PREFIX[CARD_POS].skillId < 11 ?
			CARD_PREFIX[CARD_POS].skillId < 8 ?
			CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].description
			.replace(
				'{{' + CARD_PREFIX[CARD_POS].skillId + ';d}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[0]
				.skillEffectDetails[3].activateEffectDuration
			)
			.replace(
				'{{' + CARD_PREFIX[CARD_POS].skillId + ';v}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[0]
				.skillEffectDetails[3].activateEffectValue
			)
			.replace(
				'{{' + SKILL_DURATION + ';d}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[1]
				.skillEffectDetails[3].activateEffectDuration
			) :
			CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].description
			.replace(
				'{{' + RECOVER_SKILL_ID_2 + ';d}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[0]
				.skillEffectDetails[3].activateEffectDuration
			)
			.replace(
				'{{' + RECOVER_SKILL_ID + ';v}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[1]
				.skillEffectDetails[3].activateEffectValue
			)
			.replace(
				'{{' + RECOVER_SKILL_ID_2 + ';v}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[0]
				.skillEffectDetails[3].activateEffectValue
			) :
			CARD_PREFIX[CARD_POS].skillId === 11 ?
			CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].description
			.replace(
				'{{' + PERFECT_SKILL_ID + ';d}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[0]
				.skillEffectDetails[3].activateEffectDuration
			)
			.replace(
				'{{' + PERFECT_SKILL_ID + ';v}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[0]
				.skillEffectDetails[3].activateEffectValue
			) :
			CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].description
			.replace(
				'{{' + CARD_PREFIX[CARD_POS].skillId + ';d}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[0]
				.skillEffectDetails[3].activateEffectDuration
			)
			.replace(
				'{{' + CARD_PREFIX[CARD_POS].skillId + ';v}}',
				CARD_SKILL[CARD_PREFIX[CARD_POS].skillId - 1].skillEffects[0]
				.skillEffectDetails[3].activateEffectValue
			);

		const pow1 =
			CARD_PREFIX[CARD_POS].rarity > 2 ?
			CARD_PREFIX[CARD_POS].rarity === 4 ?
			CARD_PREFIX[CARD_POS].cardParameters[
				RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][0]
			].power + 400 :
			CARD_PREFIX[CARD_POS].cardParameters[
				RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][0]
			].power + 300 :
			CARD_PREFIX[CARD_POS].cardParameters[
				RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][0]
			].power;
		const pow2 =
			CARD_PREFIX[CARD_POS].rarity > 2 ?
			CARD_PREFIX[CARD_POS].rarity === 4 ?
			CARD_PREFIX[CARD_POS].cardParameters[
				RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][1]
			].power + 400 :
			CARD_PREFIX[CARD_POS].cardParameters[
				RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][1]
			].power + 300 :
			CARD_PREFIX[CARD_POS].cardParameters[
				RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][1]
			].power;
		const pow3 =
			CARD_PREFIX[CARD_POS].rarity > 2 ?
			CARD_PREFIX[CARD_POS].rarity === 4 ?
			CARD_PREFIX[CARD_POS].cardParameters[
				RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][2]
			].power + 400 :
			CARD_PREFIX[CARD_POS].cardParameters[
				RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][2]
			].power + 300 :
			CARD_PREFIX[CARD_POS].cardParameters[
				RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][2]
			].power;
		const TOTAL_POWER = pow1 + pow2 + pow3;

		let card_embed = new MessageEmbed()
			.setThumbnail(
				`https://sekai-res.dnaroma.eu/file/sekai-assets/thumbnail/chara_rip/${
					CARD_PREFIX[CARD_POS].assetbundleName
				}_normal.webp`
			)
			.setTitle(
				`[${ATTR[CARD_PREFIX[CARD_POS].attr]}] ${CARD_PREFIX[CARD_POS].prefix}`
			)
			.addField('Rarity', `${RARELITY[CARD_PREFIX[CARD_POS].rarity]}`, true)
			.addField(
				'Gacha Phrase',
				`「${CARD_PREFIX[CARD_POS].gachaPhrase}」`,
				true
			)
			.addField('Crystal Rate', `${RATE[CARD_PREFIX[CARD_POS].rarity]}`, true)
			.addField(
				'<:icon_performance:800616182323478549> Performance',
				`${
					CARD_PREFIX[CARD_POS].rarity > 2
						? CARD_PREFIX[CARD_POS].rarity === 4
							? CARD_PREFIX[CARD_POS].cardParameters[
									RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][0]
							  ].power + 400
							: CARD_PREFIX[CARD_POS].cardParameters[
									RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][0]
							  ].power + 300
						: CARD_PREFIX[CARD_POS].cardParameters[
								RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][0]
						  ].power
				}`,
				true
			)
			.addField(
				'<:icon_technique:800616182746710016> Technique',
				`${
					CARD_PREFIX[CARD_POS].rarity > 2
						? CARD_PREFIX[CARD_POS].rarity === 4
							? CARD_PREFIX[CARD_POS].cardParameters[
									RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][1]
							  ].power + 400
							: CARD_PREFIX[CARD_POS].cardParameters[
									RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][1]
							  ].power + 300
						: CARD_PREFIX[CARD_POS].cardParameters[
								RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][1]
						  ].power
				}`,
				true
			)
			.addField(
				'<:icon_stamina:800616182322823169> Stamina',
				`${
					CARD_PREFIX[CARD_POS].rarity > 2
						? CARD_PREFIX[CARD_POS].rarity === 4
							? CARD_PREFIX[CARD_POS].cardParameters[
									RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][2]
							  ].power + 400
							: CARD_PREFIX[CARD_POS].cardParameters[
									RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][2]
							  ].power + 300
						: CARD_PREFIX[CARD_POS].cardParameters[
								RARITY_POWER[CARD_PREFIX[CARD_POS].rarity][2]
						  ].power
				}`,
				true
			)
			.addField(
				'<:icon_totalStrength:800616182604365824> Total Power',
				`${TOTAL_POWER}`
			)
			.setImage(
				`https://sekai-res.dnaroma.eu/file/sekai-assets/character/member_small/${
					CARD_PREFIX[CARD_POS].assetbundleName
				}_rip/card_normal.webp`
			)
			.setFooter('lv:max | skill lv:max');
		card_embed
			.addField('Skill Name', `${CARD_PREFIX[CARD_POS].cardSkillName}`, false)
			.addField('Skill', `${SKILL}`);
		CARD_PREFIX[CARD_POS].supportUnit === 'none' ?
			null :
			card_embed.addField(
				'Support Unit',
				UNIT[CARD_PREFIX[CARD_POS].supportUnit]
			);

		message.channel.send(card_embed);

		if (CARD_PREFIX[CARD_POS].rarity > 2) {
			let training_embed = new MessageEmbed()
				.setTitle(
					`After Training  |  ${
						CARD_PREFIX[CARD_POS].rarity === 3
							? '<:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200>'
							: '<:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200>'
					}`
				)
				.setImage(
					`https://sekai-res.dnaroma.eu/file/sekai-assets/character/member_small/${
						CARD_PREFIX[CARD_POS].assetbundleName
					}_rip/card_after_training.webp`
				);
			message.channel.send(training_embed);
		}
	}
};