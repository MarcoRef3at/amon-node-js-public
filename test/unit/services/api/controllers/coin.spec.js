const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Controller: Coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('getCoinByCode', () => {
    it('should get coin by code', async () => {
      const coinCode = '2x2';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(coin.price).to.be.a('number');
      expect(Object.keys(coin).length).to.eq(4);
    });

    it('should fail get coin by code', async () => {
      const coinCode = 'AMN';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });

    it('should fail get coin price', async () => {
      const coinCode = 'BTC';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'coingecko_API_error');
    });
  });

  describe('createCoin', () => {
    it('should create coin', async () => {
      const newCoin = { name: 'Alex_coin', code: 'Alex' };
      const coin = await CoinController.createCoin(newCoin);

      expect(coin.code).to.eq(newCoin.code);
      expect(coin.name).to.eq(newCoin.name);
      expect(Object.keys(coin).length).to.eq(3);
    });

    it('should validate unique code', async () => {
      const newCoin = { name: 'Bitcoin', code: 'BTC' };

      expect(CoinController.createCoin(newCoin)).to.be.rejectedWith(Error, 'non_unique_coin_code');
    });

    it('should throw DB error', async () => {
      const newCoin = { code: 'BTC' };

      try {
        await CoinController.createCoin(newCoin);
      } catch (error) {
        expect(error.message).to.eq('unknown_error');
        expect(error.description).to.not.be.null;
      }
    });
  });
});
