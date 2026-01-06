const axios = require('axios');
const config = require('../config');
const logger = require('./logger');

const sendTelegram = async (message) => {
  const { telegramToken, telegramChatId } = config.monitor;
  if (!telegramToken || !telegramChatId) return;

  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  const text = `🏥 *${config.app.namaPpk}* \n\n${message}`;

  try {
    await axios.post(url, { chat_id: telegramChatId, text: text, parse_mode: 'Markdown' });
  } catch (err) {
    logger.error(`Telegram Error: ${err.message}`);
  }
};

module.exports = { sendTelegram };