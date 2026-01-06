const crypto = require('crypto');
const config = require('../config');

const generateHeaders = () => {
  // const timestamp = Math.floor(Date.now() / 1000).toString();
  const timestamp = Math.floor(Date.now() / 1000);
  const data = `${config.bpjs.consId}&${timestamp}`;

  const signature = crypto
    .createHmac('sha256', config.bpjs.secretKey)
    .update(data)
    .digest('base64');

  return {
    'X-cons-id': config.bpjs.consId,
    'X-timestamp': timestamp,
    'X-signature': signature,
    'user_key': config.bpjs.userKey,
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };
};

module.exports = { generateHeaders };