const Discord = require("discord.js");
const db = require("../../database.js");

module.exports = {
    name: "vinculardc",
    description: "Vincule sua conta Minecraft ao Discord",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "codigo",
            description: "Código gerado no Minecraft (ex: ABC-1234)",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        
        // ✅ RESPONDE IMEDIATAMENTE (Evita timeout)
        await interaction.deferReply({ ephemeral: true });

        // Verifica se está em DM
        if (interaction.channel.type !== Discord.ChannelType.DM) {
            return interaction.editReply({ 
                content: "❌ Use este comando na minha **DM** para proteger sua privacidade!\n\n" +
                         "📩 Clique no meu nome e envie uma mensagem privada.", 
            });
        }

        const codigo = interaction.options.getString("codigo").toUpperCase().trim();
        const discordId = interaction.user.id;
        const discordTag = interaction.user.tag;

        try {
            // Busca código no banco
            const [rows] = await db.query(
                `SELECT uuid, username FROM rs_discord_links 
                WHERE verification_code = ? 
                AND status = 'PENDING' 
                AND code_expires_at > NOW()`,
                [codigo]
            );

            if (rows.length === 0) {
                return interaction.editReply({
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Código Inválido ou Expirado")
                        .setDescription(
                            "O código fornecido está **incorreto** ou **expirou**.\n\n" +
                            "📌 **Como corrigir:**\n" +
                            "```\n" +
                            "1. Entre no servidor Minecraft\n" +
                            "2. Use o comando: /vinculardc\n" +
                            "3. Copie o código gerado\n" +
                            "4. Cole aqui novamente\n" +
                            "```\n" +
                            "⏰ **Atenção:** Os códigos expiram em 10 minutos!"
                        )
                        .setFooter({ text: "Rede Split • Sistema de Autenticação" })
                    ]
                });
            }

            const { uuid, username } = rows[0];

            // Verifica se já está vinculado
            const [linked] = await db.query(
                `SELECT discord_id, discord_tag FROM rs_discord_links 
                WHERE uuid = ? AND status = 'LINKED'`,
                [uuid]
            );

            if (linked.length > 0) {
                return interaction.editReply({
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor("Orange")
                        .setTitle("⚠️ Conta Já Vinculada")
                        .setDescription(
                            `A conta **${username}** já está vinculada.\n\n` +
                            `📌 **Vinculada a:** \`${linked[0].discord_tag}\`\n\n` +
                            "Se você perdeu acesso, contate um administrador no servidor."
                        )
                        .setFooter({ text: "Rede Split • Sistema de Autenticação" })
                    ]
                });
            }

            // Vincula a conta
            await db.query(
                `UPDATE rs_discord_links 
                SET discord_id = ?, 
                    discord_tag = ?, 
                    status = 'LINKED', 
                    linked_at = NOW(),
                    verification_code = NULL,
                    code_expires_at = NULL
                WHERE verification_code = ?`,
                [discordId, discordTag, codigo]
            );

            // ✅ Sucesso - Resposta Visual Melhorada
            const embedSuccess = new Discord.EmbedBuilder()
                .setColor("Green")
                .setTitle("✅ Conta Vinculada com Sucesso!")
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription("Sua conta Discord foi vinculada à **Rede Split**! 🎉")
                .addFields(
                    {
                        name: "🎮 Minecraft",
                        value: `\`${username}\``,
                        inline: true
                    },
                    {
                        name: "🔗 Discord",
                        value: `${interaction.user}`,
                        inline: true
                    }
                )
                .addFields({
                    name: "🔐 O que você ganhou?",
                    value: 
                        "✅ Recuperação de senha via Discord\n" +
                        "✅ Notificações importantes do servidor\n" +
                        "✅ Benefícios exclusivos futuros"
                })
                .setFooter({ text: "Rede Split • jogar.redesplit.com.br" })
                .setTimestamp();

            await interaction.editReply({ embeds: [embedSuccess] });

            // Log no console do bot
            console.log(`✅ [Discord Link] ${username} → ${discordTag} (${discordId})`);

        } catch (error) {
            console.error("❌ [Erro ao vincular conta]:", error);
            
            return interaction.editReply({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setTitle("❌ Erro no Sistema")
                    .setDescription(
                        "Ocorreu um erro ao processar sua solicitação.\n\n" +
                        "**Tente novamente em alguns segundos.**\n\n" +
                        "Se o problema persistir, contate um administrador."
                    )
                    .setFooter({ text: "Código do erro: DB_CONNECTION_FAILED" })
                ]
            });
        }
    }
};