const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  Gold: { type: Number, default: 500 },
  Bank: { type: Number, default: 0 },
  Gems: { type: Number, default: 0 },
  MaxHp: { type: Number, default: 25 },
  Health: { type: Number, default: 25 },
  Attack: { type: Number, default: 5 },
  Defense: { type: Number, default: 5 },
  Inventory: { type: Array, default: [] },
  Cooldowns: { type: Array, default: [{ dailyLastUsed: 0 }] },
});
const model = mongoose.model("User", userSchema);

module.exports = model;
