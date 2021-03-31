const { Schema, model } = require('mongoose');

const auth = {
  guildId:String,
  discordId: String,
  sekaiId:String,
  limit: { type:Number, default:1, min:0 },
  string: String,
}

module.exports = model('auth', auth);