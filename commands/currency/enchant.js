const { SlashCommandBuilder } = require("discord.js");
const random = require("../../functions/random");
const itemList = require("../../items/itemList");
const enchantment = require("../../functions/enchantment");

const enchants = [
  { NORMAL: 0.3 },
  { SECOND: 0.3 },
  { THIRD: 0.3 },
  { FORTH: 0.1 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("enchant")
    .setDescription("Enchants an equipment")
    .addStringOption((option) =>
      option
        .setName("ore")
        .setDescription("Select an ore")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction, profileData) {
    const focusedValue = interaction.options.getFocused();
    const filtered = itemList.filter(
      (choice) =>
        choice.name.includes(focusedValue) && choice.type == "ENCHANTMENT_ORE"
    );

    await interaction.respond(
      filtered.map((choice) => ({ name: choice.name, value: choice.id }))
    );
  },
  async execute(interaction, profileData) {
    const oreSelect = interaction.options.getString("ore");
    const found = itemList.find((itm) => itm.id == oreSelect);
    const result = random(found.contents);
    enchantment(result);
    return interaction.editReply(`Returned an enchantment result:${result}`);
  },
};
