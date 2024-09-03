import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';

const {
  TELEGRAM_BOT_TOKEN
} = process.env

// Create a bot instance
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

export default  async function handler (req , res) {


    if(req.body) {
      const report = req.body
      console.log('report: ', report)
    }
    const {chatId, message} = req.body

    try {
      // let qs = `?start=1&limit=5000&convert=USD`
      bot.sendMessage(chatId, message)
      .then(() => console.log('Message sent successfully'))
      .catch(error => console.error('Error sending message:', error));

      // bot.on('message', async (msg) => {

      //   chatId = msg.chat.id;
      //   console.log('Chat ID:', chatId);
      //   await bot.sendMessage(chatId, `Chat ID received. You can use this for sending messages. ${chatId}`);

      // });

      res.status(200).json({data: true})
    } catch (ex) {
      console.log(ex);
      // reject(ex);
      res.status(400).json({message: `Error Fetching from api: ${ex}`})

    }

}