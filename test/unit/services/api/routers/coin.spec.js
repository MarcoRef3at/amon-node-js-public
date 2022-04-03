const path = require('path');
const sinon = require('sinon');
const Router = require('@koa/router');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const CoinRouter = require(path.join(srcDir, '/services/api/routers/coin'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Router: coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.get = sandbox.stub(Router.prototype, 'get');
    this.put = sandbox.stub(Router.prototype, 'put');
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('Get Coin', () => {
    it('Should get router', async () => {
      const router = await CoinRouter.router();
      expect(router instanceof Router).to.be.true;

      expect(router.get.calledWith('/:coinCode', CoinRouter.getCoinByCode)).to.be.true;
    });

    it('Should get coin', async () => {
      let ctx = { params: { coinCode: '2x2' }, cacheControl: sandbox.stub() };

      await CoinRouter.getCoinByCode(ctx);

      expect(ctx.body.code).to.be.a('String');
      expect(ctx.body.name).to.be.a('String');
      expect(ctx.body.price).to.be.a('number');
      expect(Object.keys(ctx.body).length).to.eq(4);
    });
  });

  describe('Create Coin', () => {
    it('Should get router (PUT)', async () => {
      const router = await CoinRouter.router();
      expect(router instanceof Router).to.be.true;

      expect(router.put.calledWith('/createCoin', CoinRouter.createCoin)).to.be.true;
    });

    it('Should create coin', async () => {
      let ctx = { request: { body: { coinCode: 'Mini', coinName: 'Mini-Bitcoin' } }, cacheControl: sandbox.stub() };

      await CoinRouter.createCoin(ctx);
      expect(ctx.body.code).to.be.a('String');
      expect(ctx.body.name).to.be.a('String');
      expect(Object.keys(ctx.body).length).to.eq(3);
    });
  });
});
