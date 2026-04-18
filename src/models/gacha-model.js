module.exports = (mongoose) => {
  // Cegah overwrite model (ini yang memperbaiki error)
  const Prize =
    mongoose.models.Prize ||
    mongoose.model(
      'Prize',
      new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        maxWinners: { type: Number, required: true },
        currentWinners: { type: Number, default: 0 },
      })
    );

  const GachaLog =
    mongoose.models.GachaLog ||
    mongoose.model(
      'GachaLog',
      new mongoose.Schema({
        userId: { type: String, required: true },
        name: { type: String, required: true },
        prizeWon: { type: String, default: null },
        timestamp: { type: Date, default: Date.now },
      })
    );

  return { Prize, GachaLog };
};
