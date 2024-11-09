const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const userModel = require("../../schemas/userSchema");
const itemadd = require("../../functions/itemadd");
const random = require("../../functions/random");
function selectCase(interaction) {
  const selectedCase = Math.floor(Math.random() * 2) + 1;
  if (selectedCase == 1) {
    const embed2 = new EmbedBuilder()
      .setTitle("Mysterious Sounds")
      .setDescription(
        "You heard some strange noises in the mine. Investiage or ignore?"
      );
    const rowf = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("INVESTIGATE")
        .setLabel("Investigate")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("FORWARD")
        .setLabel("Forward")
        .setStyle(ButtonStyle.Secondary)
    );
    interaction.editReply({ embeds: [embed2], components: [rowf] });
  } else if (selectedCase == 2) {
    const embed2 = new EmbedBuilder()
      .setTitle("Hidden Treasure")
      .setDescription(
        "You saw a hidden treasure deep in the mine. Do you extract it?"
      );
    const rowf = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("EXTRACT")
        .setLabel("Extract")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("FORWARD")
        .setLabel("Forward")
        .setStyle(ButtonStyle.Secondary)
    );
    interaction.editReply({ embeds: [embed2], components: [rowf] });
  }
}

async function findCase(i, interaction) {
  if (i.customId == "INVESTIGATE") {
    await i.deferUpdate();
    const embedd = new EmbedBuilder()
      .setTitle("Mysterious Sounds")
      .setDescription("You find out its sounds of water and gains 1 energy");
    const rowf = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("INVESTIGATE")
        .setLabel("Investigate")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("FORWARD")
        .setLabel("Forward")
        .setStyle(ButtonStyle.Secondary)
    );
    interaction.editReply({ embeds: [embedd], components: [rowf] });
  } else if (i.customId == "EXTRACT") {
    await i.deferUpdate();
    const embedd = new EmbedBuilder()
      .setTitle("Hidden Treasure")
      .setDescription(
        "You attempts to take the treasure, and fails miserably."
      );
    const rowf = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("EXTRACT")
        .setLabel("Extract")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("FORWARD")
        .setLabel("Forward")
        .setStyle(ButtonStyle.Secondary)
    );
    interaction.editReply({ embeds: [embedd], components: [rowf] });
  }
}

/*chance table as follows

equal percentage to encounter each event.

@LOST_PET, 1% pet, 99% die

@MYSTERIOUS_SOUNDS 100% water, increases energy

@HIDDEN_TREASURE 20% HANDFUL, 30% DECENT, 50% DAMAGE

@CRYSTAL_FRAGMENT 10% OBTAIN ITEM, 90% NOTHING

*/

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mine")
    .setDescription("Starts a mining session"),
  async execute(interaction, profileData) {
    const embed = new EmbedBuilder()
      .setTitle("Mining")
      .setDescription(
        `Starts mining. Select equipments below to start\nCurrent Equipment: NONE`
      );
    const pickaxe =
      profileData.Inventory.find((i) => i.id == "0002")?.amount ?? 0;
    const dynamite =
      profileData.Inventory.find((i) => i.id == "0003")?.amount ?? 0;
    const latern =
      profileData.Inventory.find((i) => i.id == "0004")?.amount ?? 0;
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("STRING_SELECT")
        .setPlaceholder("Select an equipment")
        .setMaxValues(1)
        .setOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Pickaxe")
            .setValue("PICKAXE")
            .setDescription(`You own: ${pickaxe}`),
          new StringSelectMenuOptionBuilder()
            .setLabel("Dynamite")
            .setValue("DYNAMITE")
            .setDescription(`You own: ${dynamite}`),
          new StringSelectMenuOptionBuilder()
            .setLabel("Latern")
            .setValue("LATERN")
            .setDescription(`You own: ${latern}`)
        )
    );
    const row2 = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("ENTER")
        .setStyle(ButtonStyle.Success)
        .setLabel("Enter")
    );
    const msg = await interaction.editReply({
      embeds: [embed],
      components: [row, row2],
    });
    const collector = msg.createMessageComponentCollector({
      time: 900000,
    });
    let a = 0;
    collector.on("collect", async (i) => {
      if (i.customId == "STRING_SELECT") {
        await i.deferUpdate();
        const equipment = i.values[0];
        embed.setDescription(
          `Starts mining. Select equipments below to start\nCurrent Equipment: ${equipment}`
        );
        interaction.editReply({ embeds: [embed] });
      } else if (i.customId == "ENTER" || i.customId == "FORWARD") {
        await i.deferUpdate();
        if (a >= 5) {
          const embeda = new EmbedBuilder()
            .setTitle("Mining session ended!")
            .setDescription("End!!");
          return interaction.editReply({ embeds: [embeda], components: [] });
        } else {
          selectCase(interaction);
          a++;
        }
      }
      findCase(i, interaction);
    });
  },
};
