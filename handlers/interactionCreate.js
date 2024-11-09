const {
  Events,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const userModel = require("../schemas/userSchema");
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await interaction.deferReply({ fetchReply: true });
      let userData;
      try {
        userData = await userModel.findOne({
          userId: interaction.user.id,
        });
        if (!userData) {
          userData = await userModel.create({
            userId: interaction.user.id,
          });
        }
      } catch (error) {
        console.error(error);
      }

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.log(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      } else {
        try {
          await command.execute(interaction, profileData, cooldownData);
        } catch (error) {
          console.log(`Error executing ${interaction.commandName}`);
          console.log(error);
        }
      }
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      } else {
        try {
          await command.autocomplete(interaction);
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
};
