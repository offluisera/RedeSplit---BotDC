const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "bot",
    description: "「Geral」Verifique algumas informações referente a mim!",
    type: ApplicationCommandType.ChatInput,
    options: [
    {
      name: "info",
      description: "「Geral」Verifique algumas informações referente a mim!",
      type: ApplicationCommandOptionType.Subcommand,
    },
   ],

    run: async (client, interaction) => {

        await interaction.deferReply({ fetchReply: true });

        const embed = new EmbedBuilder()
        .setTitle(`Minhas informações:`)
        .setDescription(`> Desenvolvedor: **.luisera**\n\nComandos disponíveis: **15**\nLivraria: **[Discord.js (v14.6.0)](https://discord.js.org/#/)**\nLinguagem: **[JavaScript](https://www.javascript.com)** - **[NodeJS](https://nodejs.org/en/)**\nBanco de Dados: **MySQL** & **MongoDB**`)
        .setColor("Blurple")
        .setThumbnail(client.user.displayAvatarURL())

        interaction.editReply({ embeds: [embed], content: `${interaction.user}` })
    }
}