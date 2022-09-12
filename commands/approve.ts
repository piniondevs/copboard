import { Interaction } from "discord.js";

module.exports = {
  name: "approve",
  handler: (interaction: Interaction) => {
    if (!interaction.isRepliable()) return;
    if (!interaction.isCommand()) return;

    const index = interaction.options.getNumber("index");
    const rating = interaction.options.getNumber("rating");

    interaction.reply({ content: `${index} ${rating}` });
  },
};
