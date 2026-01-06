const Discord = require("discord.js");
const db = require("../../database.js");

module.exports = {
    name: "desvinculardc",
    description: "[ADMIN] Desvincula uma conta Minecraft do Discord",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "jogador",
            description: "Nick do jogador Minecraft",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return interaction.reply({ 
                content: "❌ Você não tem permissão para usar este comando.", 
                ephemeral: true 
            });
        }

        await interaction.deferReply({ ephemeral: true });

        const playerName = interaction.options.getString("jogador");

        try {
            const [result] = await db.query(
                `DELETE FROM rs_discord_links WHERE username = ?`,
                [playerName]
            );

            if (result.affectedRows === 0) {
                return interaction.editReply({
                    content: `❌ O jogador **${playerName}** não possui vinculação.`
                });
            }

            interaction.editReply({
                content: `✅ Vinculação de **${playerName}** removida com sucesso!`
            });

            console.log(`🔓 [Admin] ${interaction.user.tag} desvinculou ${playerName}`);

        } catch (error) {
            console.error("Erro ao desvincular:", error);
            interaction.editReply({
                content: "❌ Ocorreu um erro ao processar."
            });
        }
    }
};