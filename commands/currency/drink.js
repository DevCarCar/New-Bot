const { SlashCommandBuilder } = require("discord.js");
const userModel = require("../../schemas/userSchema");
const itemList = require("../../items/itemList");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drink")
    .setDescription("Drink a potion or a drink")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The name of the potion/drink")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const filtered = itemList.filter(
      (choice) => choice.name.includes(focusedValue) && choice.type == "POTION"
    );

    await interaction.respond(
      filtered.map((choice) => ({ name: choice.name, value: choice.id }))
    );
  },
  async execute(interaction) {
    const itemSelected = interaction.options.getString("item");
    const found = itemList.find((itm) => itm.id == itemSelected);
    found.use();
    return interaction.editReply(`Used ${found.name}`);
  },
};
