const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    return coin.filterKeys();
  },

  async createCoin(coin) {
    try {
      // Create new coin
      let newCoin = await Models.Coin.create(coin);

      // Respond with the new coin filtered data
      return newCoin.filterKeys();
    } catch (error) {
      // if error name is SequelizeUniqueConstraintError, throw error
      if (error.name == 'SequelizeUniqueConstraintError') {
        errors.throwExposable('non_unique_coin_code');
      } else {
        errors.throwExposable('unknown_error', null, error.errors[0] && error.errors[0].message);
      }
    }
  },
};

module.exports = CoinController;
