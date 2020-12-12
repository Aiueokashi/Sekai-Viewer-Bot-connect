const { Command } = require('discord-akairo');
const cron = require('node-cron')
const { humanizer } = require('humanize-duration');
const Util = require('../util/Util');
const Discord = require('discord.js');

module.exports = class EvalCommand extends Command {
	constructor() {
		super('info', {
			aliases: ['info','getinfo'],
			args:[
        {
          id: 'items',
          match: 'content',
          prompt: {
            start: 'Please tell me an info id'
          }
        }
      ],
			ownerOnly: false
		});
	}

	async exec(message,args) {
	  let infoID = args.items;
	  	let plat = {
	  Android:'Android',
	  iOS:'iOS',
	  all:'iOS,Android'
	}
	let type= {
	  bug:'bug info',
	  information:'information',
	  update:'update info',
	  campaign:'campaign',
	  gacha:'gacha info',
	  event:'event info',
	  music:'music info'
	  
	}
	   const info = await Util.fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/userInformations.json")
	   if(args.items == 'last'){
	      const embed = new Discord.MessageEmbed()
        .setTitle(`InfoTitle: ${info.slice(-1)[0].title}`)
        .setURL(`https://production-web.sekai.colorfulpalette.org/${info.slice(-1)[0].path}`)
       .addField("Information Type:",`${type[info.slice(-1)[0].informationTag]}`)
       .addField("Information Platform:",`${plat[info.slice(-1)[0].platform]}`)
      message.channel.send(
        embed.setTimestamp(info.slice(-1)[0].startAt).setFooter('Info Time:')
      );
	   }else{
	     const embed = new Discord.MessageEmbed()
        .setTitle(`InfoTitle: ${info[infoID].title}`)
        .setURL(`https://production-web.sekai.colorfulpalette.org/${info[infoID].path}`)
       .addField("Information Type:",`${type[info[infoID].informationTag]}`,true)
       .addField("information Platform:",`${plat[info[infoID].platform]}`)
      message.channel.send(
        embed.setTimestamp(info[infoID].startAt).setFooter('Info Time:')
      );
	   }
	}
};
