require('dotenv').config();

module.exports = {
  app: {
    port: process.env.PORT || 3005,
    env: process.env.NODE_ENV || 'development',
    namaPpk: process.env.NAMA_PPK || 'RSUP SURABAYA'
  },
  cron: {
    schedule: process.env.CRON_SCHEDULE || '0 6,18 * * *',
    timezone: process.env.TZ || 'Asia/Jakarta'
  },
  oracle: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectString: process.env.DB_CONN_STRING,
    schema: process.env.DB_SCHEMA || process.env.DB_USER
  },
  bpjs: {
    baseUrl: process.env.BPJS_BASE_URL,
    consId: process.env.BPJS_CONS_ID,
    secretKey: process.env.BPJS_SECRET_KEY,
    userKey: process.env.BPJS_USER_KEY,
    kodePpk: process.env.BPJS_KODE_PPK,
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID
  }
};