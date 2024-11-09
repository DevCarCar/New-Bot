const userModel = require("../schemas/userSchema");
async function itemadd(interaction, item, amount) {
  await userModel.findOneAndUpdate(
    { userId: interaction.user.id },
    {
      $pull: {
        Inventory: { id: item },
      },
    }
  );
  await profileModel.findOneAndUpdate(
    {
      userId: interaction.user.id,
    },
    {
      $push: {
        Inventory: { id: item, amount: amount },
      },
    }
  );
}

module.exports = itemadd;
