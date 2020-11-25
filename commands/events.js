const { Command, Argument } = require('discord-akairo');
const Util = require('../util/Util')
const Discord = require('discord.js');
const { humanizer } = require('humanize-duration');

const eventNameIdMap = {
  "雨上がりの一番星": 1,
  "stella-after-the-rain": 1,
  "囚われのマリオネット": 2,
  "imprisoned-marionette": 2,
  "全力！ワンダーハロウィン！": 3,
  // "全力!ワンダーハロウィン!": 3,
  "full-power-wonder-halloween": 3,
  "走れ！体育祭！～実行委員は大忙し～": 4,
  "run-sports-festival-the-executive-committee-is-very-busy": 4,
  "ここからRE:START！": 5,
  // "ここからRE:START!": 5,
  "lets-re-start-from-here": 5
}
const queryNames = Object.keys(eventNameIdMap)

module.exports = class MusicDataCommand extends Command {
  constructor() {
    super('event', {
      aliases: ['event'],
      channel: 'guild',
      ownerOnly: false,
      args: [{
        id: 'eventName',
        type: Argument.union('integer', 'string'),
        prompt: {
          start: 'Please tell me an event id or title'
        }
      }]
    });
  }

  async exec(message, args) {
    if (!message.channel.name.startsWith('bot-')) return;
    const prefix = process.env.SEKAI_PREFIX;

    const events = await Util.fetchData(
      'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/events.json'
    )
    const eventDeckBonuses = await Util.fetchData(
      'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/eventDeckBonuses.json'
    )
    let eventId;
    if (!isNaN(args.eventName)) {
      eventId = args.eventName
    } else {
      const filteredNames = queryNames.filter(elem => elem.startsWith(args.eventName))
      if (filteredNames.length > 1) {
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('Specific an event id or title')
            .setDescription(filteredNames.join('\n'))
            .setTimestamp()
        );
      } else if (filteredNames.length === 0) {
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('Error')
            .setDescription('The event matching your input is not found')
            .setTimestamp()
        );
      }
      eventId = eventNameIdMap[filteredNames[0]];
    }
    eventId -= 1;
    if (!events[eventId]) {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle('Error')
          .setDescription('The event matching your input is not found')
          .setTimestamp()
      );
    }
    const deckBonus = eventDeckBonuses.filter(elem => (elem.eventId === eventId + 1) && elem.bonusRate === 50)
    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(`Event Title: ${events[eventId].name}`)
        .setURL(`https://sekai-world.github.io/sekai-viewer/#/event/${eventId}`)
        .setImage(`https://sekai-res.dnaroma.eu/file/sekai-assets/home/banner/${events[eventId].assetbundleName}_rip/${events[eventId].assetbundleName}.webp`)
        .setDescription(
          `Type: **${events[eventId].eventType}** \nAttribute: **${
          deckBonus[0].cardAttr
          }** ` + (Date.now() <  events[eventId].aggregateAt ? `\nRemaining: **${humanizer()(Date.now() - events[eventId].aggregateAt)}**` : '')
        )
    );
  }
};
