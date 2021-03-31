const chalk = require('chalk');
const moment = require('moment-timezone');
const fs = require('fs');
const mongoose = require('mongoose')

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


  
};
