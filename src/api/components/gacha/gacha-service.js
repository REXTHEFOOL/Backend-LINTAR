const { Prize, GachaLog } = require('../../../models/gacha-model')(
  require('mongoose')
);

const gachaService = {
  async playGacha(userId, name) {
    // === SEED PRIZE SEKALI SAJA ===
    const prizeCount = await Prize.countDocuments();
    if (prizeCount === 0) {
      await Prize.insertMany([
        { name: 'Emas 10 gram', maxWinners: 1 },
        { name: 'Smartphone X', maxWinners: 5 },
        { name: 'Smartwatch Y', maxWinners: 10 },
        { name: 'Voucher Rp100.000', maxWinners: 100 },
        { name: 'Pulsa Rp50.000', maxWinners: 500 },
      ]);
      console.log('✅ Prize quotas seeded!');
    }

    // === CEK LIMIT HARIAN (5x) ===
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    const dailyCount = await GachaLog.countDocuments({
      userId,
      timestamp: { $gte: todayStart, $lte: todayEnd },
    });

    if (dailyCount >= 5) {
      throw new Error('Anda telah mencapai batas maksimal 5 gacha hari ini.');
    }

    const availablePrizes = await Prize.find({
      $expr: { $lt: ['$currentWinners', '$maxWinners'] },
    });

    if (availablePrizes.length === 0) {
      const log = new GachaLog({ userId, name, prizeWon: null });
      await log.save();
      return {
        prize: null,
        message: 'Maaf, Anda tidak memenangkan hadiah apapun.',
      };
    }

    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    const wonPrize = availablePrizes[randomIndex];

    wonPrize.currentWinners += 1;
    await wonPrize.save();

    const log = new GachaLog({ userId, name, prizeWon: wonPrize.name });
    await log.save();

    return {
      prize: wonPrize.name,
      message: `Selamat! Anda memenangkan ${wonPrize.name}`,
    };
  },
};

module.exports = gachaService;
