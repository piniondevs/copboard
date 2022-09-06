import { Interaction, MessageEmbed } from "discord.js";
import { getRequests } from "../utils/request";

module.exports = {
  name: "list",
  handler: async (interaction: Interaction) => {
    if (!interaction.isRepliable()) return;
    const data = await getRequests();

    const fields = data.map((item, index) => {
      return {
        name: `${index + 1}: ${item.lore}`,
        value: !item.actualRatings.length
          ? "No Ratings Yet"
          : item.actualRatings
              .map((item) => `<@${item.id}> : ${item.rating}/5`)
              .join(""),
      };
    });

    const embed = new MessageEmbed({
      color: "RANDOM",
      title: "Copplications",
      description: "The title is possibly the best joke ive ever made.",
      fields: fields,
    });
    interaction.reply({ embeds: [embed] });
  },
};
