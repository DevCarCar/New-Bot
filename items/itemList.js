const userModel = require("../schemas/userSchema");
const itemList = [
  {
    id: "0002",
    name: "Bronze Ore",
    rarity: "COMMON",
    type: "ORE",
  },
  {
    id: "0003",
    name: "Bronze Bar",
    rarity: "COMMON",
    type: "BAR",
  },
  {
    id: "0004",
    name: "Bronze Enchantment Ore",
    rarity: "COMMON",
    type: "ENCHANTMENT_ORE",
    contents: [
      {
        COMMON: 0.5,
      },
      { UNCOMMON: 0.3 },
      { RARE: 0.15 },
      { EPIC: 0.04 },
      { LEGENDARY: 0.01 },
    ],
  },
  {
    id: "0005",
    name: "Cooldown Potion",
    rarity: "EPIC",
    type: "POTION",
    use: function use(interaction) {
      console.log("cooldown potion was used");
      userModel.findOneAndUpdate(
        { id: interaction.user.id },
        {
          $pull: {
            Cooldowns: [],
          },
        }
      );
    },
  },
];

module.exports = itemList;
