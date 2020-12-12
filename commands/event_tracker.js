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

module.exports = class EventTrackCommand extends Command {
  constructor() {
    super('event-tracker', {
      aliases: ['event-track','rank'],
      channel: 'guild',
      ownerOnly: false,
      args: [{
        id: 'eventName',
        type: Argument.union('integer', 'string'),
        prompt: {
          start: 'Please tell me an event id or title'
        }
      },{
        id: 'rank',
        type: Argument.union('integer'),
        prompt: {
          start: 'Please tell me a rank you want show'
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
    let rank ;
    rank = args.rank;
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
    if(rank<=10){
    const eventTracker = await Util.fetchData(`https://bitbucket.org/sekai-world/sekai-event-track/raw/f335a3f5c401b4e3b0aad27bec3573f00c3682cf/event${eventId+1}.json`)
    const deckBonus = eventDeckBonuses.filter(elem => (elem.eventId === eventId + 1) && elem.bonusRate === 50)
    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(`Event Title: ${events[eventId].name}  |  Rank:#${rank}`)
        .setURL(`https://sekai-world.github.io/sekai-viewer/#/event/${eventId}`)
        .setImage(`https://sekai-res.dnaroma.eu/file/sekai-assets/home/banner/${events[eventId].assetbundleName}_rip/${events[eventId].assetbundleName}.webp`)
        .addField(`Score:`,`${eventTracker["first10"][rank-1].score}`,true)
        .addField(`Player Name:`,`${eventTracker["first10"][rank-1].name}`,true)
        .addField(`Player Quick Word`,`${eventTracker["first10"][rank-1]["userProfile"].word}`)
    );
    }
  }
};
