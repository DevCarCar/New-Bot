const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userModel = require("../../schemas/userSchema");
const itemList = require("../../items/itemList");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Checks your inv"),
  async execute(interaction, userData) {
    const { Inventory } = userData;
    const embed = new EmbedBuilder();
    embed.setTitle("Inventory");
    Inventory.forEach((itm) => {
      const itemFound = itemList.find((i) => i.id == itm.id);
      embed.addFields({ name: `${itemFound.name}`, value: `${itm.amount}` });
      i++;
    });
    interaction.editReply({ embeds: [embed] });
  },
};
