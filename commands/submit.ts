import { Interaction } from "discord.js";

module.exports = {
  name: 'submit',
  handler: (interaction: Interaction) => {
    if (interaction.isRepliable()) {
      interaction.reply('ok')
    } 
  }
}