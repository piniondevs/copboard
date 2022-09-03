import { Interaction } from "discord.js";

module.exports = {
  name: 'help',
  handler: (interaction: Interaction) => {
    if (interaction.isRepliable()) {
      interaction.reply('ill make this later')
    } 
  }
}