const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const userModel = require("../../schemas/userSchema");

const shopList = [
  { name: "Apple", price: 180, currency: "Gold" },
  { name: "Orange", price: 180, currency: "Gold" },
  { name: "Gemmer title", price: 10, currency: "Gems", limit: true },
  { name: "Cooldown Potion", price: 20, currency: "Potion" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Purchase goods from the shop"),

  async execute(interaction, profileData) {
    const { Gold, Gems } = profileData;

    const embed = new EmbedBuilder()
      .setTitle("Welcome to the Shop!")
      .setDescription(
        "Select the shop you want to visit from the buttons below."
      );

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setPlaceholder("Select a shop")
        .setCustomId("SELECT_SHOP")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Coin Shop")
            .setValue("COINSHOP"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Gem Shop")
            .setValue("GEMSHOP")
        )
    );

    const msg = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({
      time: 900000,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();

      if (i.customId === "SELECT_SHOP") {
        const selectedShop = i.values[0];
        const itemEmbed = new EmbedBuilder();
        const itemRow = new ActionRowBuilder();

        if (selectedShop == "COINSHOP") {
          itemEmbed
            .setTitle("Welcome to the Coin Shop!")
            .setDescription(`Gold: ${Gold}`);
          shopList
            .filter((itm) => itm.currency == "Gold")
            .forEach((item) => {
              itemEmbed.addFields({
                name: item.name,
                value: `${item.price} ${item.currency}`,
              });
              itemRow.addComponents(
                new ButtonBuilder()
                  .setCustomId(item.name)
                  .setLabel(item.name)
                  .setStyle(ButtonStyle.Secondary)
              );
            });
        } else if (selectedShop == "GEMSHOP") {
          itemEmbed
            .setTitle("Welcome to the Gem Shop!")
            .setDescription(`Gems: ${Gems}`);
          shopList
            .filter((itm) => itm.currency == "Gems")
            .forEach((item) => {
              itemEmbed.addFields({
                name: item.name,
                value: `${item.price} ${item.currency}`,
              });
              itemRow.addComponents(
                new ButtonBuilder()
                  .setCustomId(item.name)
                  .setLabel(item.name)
                  .setStyle(ButtonStyle.Secondary)
              );
            });
        }

        await i.editReply({ embeds: [itemEmbed], components: [row, itemRow] });
      } else {
        const matchedItem = shopList.find((item) => item.name === i.customId);

        if (matchedItem) {
          const quantityRow = new ActionRowBuilder();

          let maxAffordable;
          switch (matchedItem.currency) {
            case "Gold":
              maxAffordable = Math.floor(Gold / matchedItem.price);
              break;
            case "Gems":
              maxAffordable = Math.floor(Gems / matchedItem.price);
              break;
            case "Potion":
              maxAffordable = Math.floor(Gems / matchedItem.price);
            default:
              break;
          }
          const remainingAmount = Math.floor(maxAffordable / 2);

          if (maxAffordable >= 1) {
            quantityRow.addComponents(
              new ButtonBuilder()
                .setCustomId("1")
                .setLabel("Buy 1")
                .setStyle(ButtonStyle.Secondary)
            );
          }
          if (maxAffordable >= 5) {
            quantityRow.addComponents(
              new ButtonBuilder()
                .setCustomId("5")
                .setLabel("Buy 5")
                .setStyle(ButtonStyle.Secondary)
            );
          }
          if (maxAffordable > 2 && maxAffordable != 5) {
            quantityRow.addComponents(
              new ButtonBuilder()
                .setCustomId(`${maxAffordable}`)
                .setLabel(`Buy ${maxAffordable}`)
                .setStyle(ButtonStyle.Secondary)
            );
          }
          if (maxAffordable > 4 && maxAffordable != 5) {
            quantityRow.addComponents(
              new ButtonBuilder()
                .setCustomId(`${remainingAmount}`)
                .setLabel(`Buy ${remainingAmount}`)
                .setStyle(ButtonStyle.Secondary)
            );
          }

          const purchaseEmbed = new EmbedBuilder()
            .setTitle("Select Amount")
            .setDescription("Select the amount you wish to purchase");

          const a = await i.followUp({
            embeds: [purchaseEmbed],
            components: [quantityRow],
            ephemeral: true,
            fetchReply: true,
          });
          const amtcollector = a.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 15000,
          });
          amtcollector.on("collect", async (amountInteraction) => {
            const quantity = amountInteraction.customId;
            const cost = matchedItem.price * quantity;

            if (matchedItem.currency == "Gold") {
              await profileModel.findOneAndUpdate(
                { userId: interaction.user.id },
                { $inc: { Gold: -cost } }
              );
            } else if (
              matchedItem.currency == "Gems" ||
              matchedItem.currency == "Potion"
            ) {
              await profileModel.findOneAndUpdate(
                { userId: interaction.user.id },
                { $inc: { Gems: -cost } }
              );
            }

            await amountInteraction.reply({
              content: `You have purchased ${quantity} ${matchedItem.name}(s)!`,
              ephemeral: true,
            });
            amtcollector.stop();
          });
        }
      }
    });
  },
};
