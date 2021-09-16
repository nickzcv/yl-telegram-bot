const axios = require('axios');
const config = require('./../config/config.json');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.TOKEN, {
  filepath: false,
  onlyFirstMatch: true
});
bot.setWebHook(`${config.URL}/${config.TOKEN}`);

exports.startBot = (request, response) => {
  try {
    // Start bot
    bot.processUpdate(request.body);
    //
    bot.onText(/\/start/, message => {
      const { chat: { id }} = message;
      bot.sendMessage(id, 'Welcome', {
        reply_markup: {
          keyboard: [[
            /*{
              text: 'My contacts',
              request_contact: true,
            },*/
            {
              text: 'Sprint roulette',
            },
            {
              text: '/kuna sLTzg',
            },
            {
              text: 'Custom location',
            }]
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        }
      });
    });

    // Listen incoming Message of any kind
    // !NOT Recommended listen 'message' directly
    bot.on('message', (message) => {
      const { chat: { id }} = message;
      const hi = 'hi';
      if (message.text.toString().toLowerCase().indexOf(hi) === 0) {
        bot.sendMessage(id, "Hello, human!");
      }
      const bye = 'stupid';
      if (message.text.toString().toLowerCase().includes(bye)) {
        bot.sendMessage(id, "I'm very clever!");
      }
      const robot = 'bot';
      if (message.text.indexOf(robot) === 0) {
        bot.sendMessage(id, "Yes I'm bot!");
      }
    });

    // Show geo location
    bot.onText(/location/, message => {
      const { chat: { id }} = message;
      bot.sendMessage(id, 'Meet here!');
      bot.sendLocation(id,46.454396, 30.757504);
    });

    // Waiting for the "sprint" or "manager" or "roulette" word to start roulette
    bot.onText(/\b(sprint|manager|roulette)\b/i, message => {
      const { chat: { id }} = message;
      bot.sendMessage(id, startRoulette(id));
    });

    // Check Kuna code
    bot.onText(/\/kuna (.+)/, async (message, match) => {
      let text = 'Ошибка, проверь код';
      const { chat: { id }} = message;
      const kunaCode = match[1];
      const responseFromKuna = await checkKuna(kunaCode);
      if (responseFromKuna) {
        text = `Kuna code: ${responseFromKuna.code} \nstatus: ${responseFromKuna.status}.
        \n${responseFromKuna.amount} ${responseFromKuna.currency}`
      }
      bot.sendMessage(id, text);
    });

    // Error occurred handling a webhook request
    bot.on('webhook_error', error => {
      console.log(error.code);  // => 'EPARSE'
    });

    response.sendStatus(200);
  } catch (error) {
    console.log(error)
    response.sendStatus(500);
  }
};

const checkKuna = async code => {
  try {
    if (code) {
      const result = await axios.get(`https://api.kuna.io/v3/kuna_codes/${code}/check`);
      return result.data;
    }
  } catch (error) {
    console.log(error)
  }
};

const startRoulette = chatId => {
  try {
    const imageUrl = 'https://images-na.ssl-images-amazon.com/images/I/61b-7%2BcowML.png';
    const devs = [
        'Alex K',
        'Alex L',
        'Anastasiya',
        'Anna',
        'Artem',
        'Denis',
        'Eugene',
        'Liza',
        'Maksim',
        'Nick',
        'Roma'
    ];
    const random = Math.floor(Math.random() * devs.length);
    bot.sendPhoto(chatId, imageUrl);
    return devs[random];
  } catch (error) {
    console.log(error)
  }
};