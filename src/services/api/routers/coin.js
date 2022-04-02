const Joi = require('joi');
const Router = require('@koa/router');
const CoinController = require('../controllers/coin');
const { validateParams } = require('../../../helpers/validation');

const CoinRouter = {
  schemaGetByCoinCode: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
  }),

  async getCoinByCode(ctx) {
    const params = {
      coinCode: ctx.params.coinCode,
    };

    const formattedParams = await validateParams(CoinRouter.schemaGetByCoinCode, params);

    ctx.body = await CoinController.getCoinByCode(formattedParams.coinCode);
  },

  schemaCreateCoin: Joi.object({
    code: Joi.string().min(3).uppercase().max(5),
    name: Joi.string(),
  }),

  async createCoin(ctx) {
    const params = {
      code: ctx.request.body.coinCode,
      name: ctx.request.body.coinName,
    };
    const formattedParams = await validateParams(CoinRouter.schemaCreateCoin, params);
    ctx.body = await CoinController.createCoin(formattedParams);
  },

  router() {
    const router = Router();

    /**
     * @api {get} / Get coinCode
     * @apiName coinCode
     * @apiGroup Status
     * @apiDescription Get coinCode
     *
     * @apiSampleRequest /
     *
     */
    router.get('/:coinCode', CoinRouter.getCoinByCode);

    /**
     * @api {put} /createCoin
     * @apiName createCoin
     * @apiGroup Create
     * @apiDescription Create New Coin
     *
     * @apiSampleRequest /createCoin
     *       @requestBody {"coinName":"Bitcoin","coinCode":"BTC"}
     */
    router.put('/createCoin', CoinRouter.createCoin);

    return router;
  },
};

module.exports = CoinRouter;
