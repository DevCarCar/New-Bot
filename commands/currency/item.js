const { SlashCommandBuilder } = require("discord.js");
const userModel = require("../../schemas/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Checks an item"),
  async execute(interaction, profileData) {
    const { Inventory } = profileData;
    Inventory.forEach((itm) => console.log(itm));
    interaction.editReply("hi");
  },
};
