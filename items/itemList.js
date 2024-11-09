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
            Cooldowns: {dailyLastUsed: {$exists: true}},
          },
        }
      );
    },
  },
];

module.exports = itemList;
