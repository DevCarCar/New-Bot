const { SlashCommandBuilder } = require("discord.js");
const userModel = require("../../schemas/userSchema");

module.exports = {
  data: new SlashCommandBuilder().setName("test").setDescription("Test"),
  async execute(interaction) {
    await userModel.findOneAndUpdate(
      { userId: interaction.user.id },
      {
        $pull: {
          Inventory: { id: "0004" },
        },
      }
    );
    await userModel.findOneAndUpdate(
      {
        userId: interaction.user.id,
      },
      {
        $push: {
          Inventory: { id: "0004", amount: 5 },
        },
      }
    );
    const result = await userModel.findOne({ userId: interaction.user.id });
    console.log(result.Inventory);
    return interaction.editReply("hi");
  },
};
