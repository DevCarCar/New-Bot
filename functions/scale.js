const profileModel = require("../schemas/profileSchema");
module.exports = {
  name: "scale",
  async execute(interaction) {
    async function scale(type, param1) {
      let arr = [
        "Extra Bad",
        "Bad",
        "Normal",
        "Decent",
        "Good",
        "Excellent",
        "Perfect",
      ];
      const found = arr.findIndex((i) => i === param1) + 1;
      await profileModel.findOneAndUpdate(
        { userId: interaction.user.id },
        { $set: { type: found } }
      );
    }
  },
};
