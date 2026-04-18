const mongoose = require('mongoose');
const gachaService = require('./gacha-service');

const modelFactory = require('../../../models/gacha-model');

const { GachaLog } = modelFactory(mongoose);

const gachaController = {
  async play(req, res) {
    try {
      const { userId, name } = req.body;

      if (!userId || !name) {
        return res.status(400).json({ error: 'userId dan name wajib diisi' });
      }

      const result = await gachaService.playGacha(userId, name);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getHistory(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: 'userId diperlukan' });
      }

      const history = await GachaLog.find({ userId }).sort({ timestamp: -1 });
      res.json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getPrizes(req, res) {
    try {
      const prizesList = [
        { name: 'Emas 10 gram', quota: 1 },
        { name: 'Smartphone X', quota: 5 },
        { name: 'Smartwatch Y', quota: 10 },
        { name: 'Voucher Rp100.000', quota: 100 },
        { name: 'Pulsa Rp50.000', quota: 500 },
      ];

      const used = await GachaLog.aggregate([
        { $match: { prizeWon: { $ne: null } } },
        { $group: { _id: '$prizeWon', count: { $sum: 1 } } },
      ]);

      const result = prizesList.map((p) => {
        const usedPrize = used.find((u) => u._id === p.name);
        const remaining = p.quota - (usedPrize ? usedPrize.count : 0);
        return { ...p, remaining: Math.max(0, remaining) };
      });

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getWinners(req, res) {
    try {
      const winners = await GachaLog.find({ prizeWon: { $ne: null } }).sort({
        timestamp: -1,
      });

      const maskedWinners = winners.map((w) => {
        const maskedName = maskName(w.name);
        return { ...w.toObject(), name: maskedName };
      });

      res.json({ success: true, data: maskedWinners });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

function maskName(name) {
  if (!name) return name;
  return name
    .split(' ')
    .map((word) => {
      if (word.length <= 2) return word;
      return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
    })
    .join(' ');
}

module.exports = gachaController;
