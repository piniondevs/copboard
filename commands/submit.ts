import { Interaction, MessageEmbed } from "discord.js";
import { addRequest } from "../utils/request";

module.exports = {
  name: "submit",
  handler: async (interaction: Interaction) => {
    if (!interaction.isRepliable) return;
    if (!interaction.isCommand()) return;

    const lore = interaction.options.getString("lore");
    const proposedRating = interaction.options.getNumber("rating");

    if (lore === null || proposedRating === null) return;

    await addRequest({
      lore,
      proposedRating,
      actualRatings: [],
    });

    const embed = new MessageEmbed({
      color: "RANDOM",
      title: "Cop Requested",
      description:
        "This cop has to be reviewed and rated by the other two ranked coppers to be added to your total scores.",
      fields: [
        { name: "Lore", value: lore },
        { name: "Proposed Rating", value: proposedRating.toString() },
      ],
    });

    interaction.reply({ embeds: [embed] });
  },
};
