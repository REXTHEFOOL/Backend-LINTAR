const gachaController = require('./gacha-controller');

module.exports = (router) => {
  router.post('/gacha', gachaController.play);

  router.get('/gacha/history', gachaController.getHistory);
  router.get('/gacha/prizes', gachaController.getPrizes);
  router.get('/gacha/winners', gachaController.getWinners);
};
