const chalk = require('chalk');
const moment = require('moment-timezone');
const fs = require('fs');
const mongoose = require('mongoose')
const userModel = require('../../../Models/user.js');
const axios = require("axios")

module.exports = async client => {
	console.log(
		chalk.bgBlue.bold(
			`CLIENT EVENT | READY ${chalk.green(
				moment(client.readyAt)
					.format('DD/MM/YYYY h:mm:ss A')
			)}`
		)
	);
	require('../loaders/loadCommands')(client);
	
	await mongoose.connect(
		process.env.MONGO_DB_URL.replace('<username>',process.env.MONGO_DB_USERNAME).replace('<password>',process.env.MONGO_DB_PASS).replace('myFirstDatabase',process.env.MONGO_DB_DBNAME),
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		}
	);
	console.log(
		chalk.bgBlue.bold(
			`MongoDB | READY ${chalk.green(
				moment(Date.now())
					.format('DD/MM/YYYY h:mm:ss A')
			)}`
		));
	/*	const u = await userModel.findOne({
		  discordId: client.owners[1]
		})
		
		const data = await JSON.stringify(u.sekaiRanking).replace(/ID/gm,'"{sekaiID}"')
		
		fs.writeFile('dataRanking.json',data,(e)=>{
		  if (e) throw e
		  console.log('a')
		})*/

  
};
