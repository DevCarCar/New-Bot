const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  guildName: { type: String, required: true },
  Leader: { type: Array },
  Helpers: { type: Array, default: [] },
  Members: { type: Array, default: [] },
  League: { type: String, default: "Bronze" },
  Trophies: { type: Number, default: 0 },
});
const model = mongoose.model("guild", guildSchema);

module.exports = model;
