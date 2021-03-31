const { MessageEmbed } = require('discord.js');
const userModel = require('../Models/user');
const authModel = require('../Models/auth');
const axios = require('axios')
const {randomBytes} = require('crypto')
const instance = axios.create({
  baseURL: process.env.BASE_API_URL
});
instance.defaults.headers.common['x-api-token'] = process.env.API_TOKEN

module.exports = {
	name: 'register',
  aliases: [],
  example: "[USER ID]",
  description: "register your project sekai account",
  details: "register your project sekai account\ne.g.`sv register 1234567890`",
  ownerOnly: true,
  userPermission: [],
  disabled: false,
  cooldown: 1,

	async execute(message, args, client) {
	  if(!args[0]){
	    return message.channel.send('please input user ID\n`sv register 1234567890`')
	  }
	  
	  const sekaiIdReg = new RegExp(/^[0-9]{16,17}/gm)
	  if(sekaiIdReg.test(args[0])){
	    
	    var USER = await userModel.findOne({
	        discordId:message.author.id,
	        guildId:message.guild.id,
	      })
      var AUTH = await authModel.findOne({
        discordId:message.author.id,
      })
	   if(!USER){
       if(AUTH){
         return message.channel.send("You already use this command.")
       }
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split('')

      function generateRandomString(length) {
        return randomBytes(length).reduce((p, i) => p + chars[(i % 32)], '')
      }
      const string = generateRandomString(5);
       message.author.send(`${string}`)
       message.author.send("①put this string your project sekai user profile\n②send here to `sv auth`")
	     message.reply("You need to verify your identity")

       const auth = new authModel({
          guildId: message.guild.id,
          discordId: message.author.id,
          sekaiId: args[0],
          limit: 1,
          string: string
       })

       await auth.save();

	   }else{
	     return message.channel.send('You already registered')
	   }
	      
	  }else{
	    message.channel.send('its not sekai user ID')
	  }
	  
	}
};