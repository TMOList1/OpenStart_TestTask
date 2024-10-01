require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const sqlite = require('sqlite3');

const db = new sqlite.Database('mydatabase.db');
const bot = new TelegramApi(token, {polling: true})

db.run(`CREATE TABLE IF NOT EXISTS users ( 
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL
	)`);


const database_tmp = [
	{id: 0, name: "Вася"},
	{id: 1, name: "Петя"},
	{id: 2, name: "Маша"}
];

console.log(database_tmp[0].id);


const start = () => {
	bot.setMyCommands([
		{command: '/start', description: 'Прветствие'}
	])
	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === '/start'){
			return bot.sendMessage(chatId, `Добрый день, ${msg.from.first_name}. Укажите Ваш ID.`)
		}

		if (parseInt(text) <= database_tmp.length){

			const user = await new Promise((resolve, reject) => {
				db.get(
					'SELECT name FROM users WHERE id = ?',
					parseInt(text),
					(err, row) => {
						if (err) return reject(err)
						const i = row?.name ?? null;
						resolve(i)
					});
				});
				return bot.sendMessage(chatId, `Приветствую ${user}`);
		}
		else {
			return bot.sendMessage(chatId, 'Я не понимаю.')
		}
	})
}

start();