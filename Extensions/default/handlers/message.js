const chalk = require("chalk");
const { Collection, MessageEmbed } = require("discord.js");
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const { SEKAI_PREFIX } = process.env;


module.exports = async (message) => {
  if(message.guild){
    if (!message.channel.name.startsWith('bot-')) return;
  }

    const guild = message.guild;
    const client = message.client;

    const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(SEKAI_PREFIX)})`);
    if(!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const [commandPrefix,...args] = message.content.slice(matchedPrefix.length).split(/[\s]+/gm);
    if(commandPrefix == ""){
      commandPrefix = args[0];
      args.shift();
    }
    const commandName = commandPrefix;

    
    const command =
        client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    
    if(!command) return;
    
    if(command.disabled) return;
    
    if(command.ownerOnly){
        if(!message.client.owners.includes(message.author.id)) return;
    }else{
    if(command.userPermission.length > 0){
      if(!message.member.hasPermission(command.userPerms)){
        return console.log(message.member.hasPermission(command.userPerms))
      }
    }
    }

    
    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Collection());
    }
  
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;
    if(timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime){
            const timeLeft = (expirationTime - now) / 1000;
            message.reply(
                new MessageEmbed()
                .setColor("RED")
                .setTitle("COOLDOWN")
                .setDescription(`\`${command.name}\`command is cooling down : ${timeLeft.toFixed(1)}s`)
                .setTimestamp()
            );
            
                
            console.log(chalk.bgRed.bold(`COOLDOWN: ${chalk.white(`${message.author.tag} use command in short interval`)}`))
            return;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try{
        command.execute(message, args, client);
    }catch(error){
        console.log(chalk.bgRed.bold(`${command.name}|ERROR: ${chalk.white(error)}`))
        message.reply(
            new MessageEmbed()      
            .setColor("RED")
            .setTitle("ERROR:warning:")
            .setDescription(`in \`${command.name}\`command`)
            .setTimestamp()).catch(console.error);
    }
};