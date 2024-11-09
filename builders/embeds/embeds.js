const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

function coinshop(Gold, coinshopList, which) {
  const coinshopembed = new EmbedBuilder()
    .setTitle("Welcome to the Coin Shop!")
    .setDescription(`Gold: ${Gold}`)
    .setThumbnail("https://your.thumbnail.url/here.png");

  coinshopList.forEach((item) => {
    coinshopembed.addFields({
      name: item.name,
      value: `${item.price} Gold`,
    });
    const itemRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(item.name)
        .setLabel(item.name)
        .setStyle(ButtonStyle.Secondary)
    );
    switch (which) {
      case "embed":
        return coinshopembed;

      case "row":
        return itemRow;
    }
  });
}
module.exports = coinshop;
