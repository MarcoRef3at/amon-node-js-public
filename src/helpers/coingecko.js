const axios = require('axios');
module.exports = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/coins/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});
