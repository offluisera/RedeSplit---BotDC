const Discord = require("discord.js")

module.exports = {
  name: "ticket", // Coloque o nome do comando
  description: "Abra o painel de tickets.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
        interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true })
    } else {
        let embed = new Discord.EmbedBuilder()
        .setColor("#fcba03")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setDescription(`🤖 | Olá caro jogador(a)!
            
            Lhe surgiu alguma dúvida ou precisa de um suporte? Não se preocupe!
            Solicite ajuda a nossa equipe agora mesmo, basta clicar no botão a baixo.

            Abra ticket com responsabilidade, caso contrário receberá advertências!

            `);

        let painel = new Discord.ActionRowBuilder().addComponents(
            new Discord.SelectMenuBuilder()
            .setCustomId("painel_ticket")
            .setPlaceholder("Clique aqui!")
            .addOptions(
                {
                    label: "🔧 | Suporte Geral",
                    description: "Utilize esta opção para assuntos e dúvidas em geral!",
                    value: "opc1"
                },
                {
                    label: "❗️ | Denúncias",
                    description: "Utilize esta opção para denunciar players que quebraram as regras!",
                    value: "opc2"
                },
                {
                    label: "⚙️ | Suporte Técnico",
                    description: "Utilize esta opção caso encontre algum problema ou erro no servidor!",
                    value: "opc3"
                }
            )
        );

        interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true })
        interaction.channel.send({ embeds: [embed], components: [painel] })
    }


  }
}