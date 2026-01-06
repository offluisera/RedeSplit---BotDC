const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "formulário", // Coloque o nome do comando
  description: "Abra o painel do formulário para os membros.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal_formulário",
        description: "Canal para enviar o formulário para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "canal_logs",
        description: "Canal para enviar as logs dos formulários recebidos.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
        const canal_formulario = interaction.options.getChannel("canal_formulário")
        const canal_logs = interaction.options.getChannel("canal_logs")

        if (canal_formulario.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_formulario} não é um canal de texto.`, ephemeral: true })
        } else if (canal_logs.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_logs} não é um canal de texto.`, ephemeral: true })
        } else {
            await db.set(`canal_formulario_${interaction.guild.id}`, canal_formulario.id)
            await db.set(`canal_logs_${interaction.guild.id}`, canal_logs.id)

            let embed = new Discord.EmbedBuilder()
            .setDescription("Random")
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal do Formulário: ${canal_formulario}.\n> Canal de Logs: ${canal_logs}.`)

            interaction.reply({ embeds: [embed], ephemeral: true }).then( () => {
                let embed_formulario = new Discord.EmbedBuilder()
                .setColor("#fcba03")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Solicitação de tag criador/criadora de conteúdo`)
                .setDescription(`👾 | Ficamos contente que você possui interesse em fazer parte da nossa equipe de criadores de conteúdo!
                    Confira a baixo algumas informações sobre a TAG.
                    
                    A tag de criador/criadora de conteúdo possui os mesmo benefícios dos VIPS.
                    
                    Para tornar a sua solicitação válida, deve cumprir os requisitos a baixo:
                    
                    **YouTube**
                    → Minímo de 1000 mil inscritos;
                    → Vídeo de até 8 minutos gravado em qualquer servidor da rede até no dia da solicitação;
                    → Qualidade de edição, áudio e vídeo em boas condições;
                    → Necessário a postagem de até um vídeo por semana feito no servidor.

                    **Twitch**
                    → Minímo de 300 seguidores;
                    → Necessário ter uma live realizada em qualquer servidor da rede de até 20 minutos até no dia da solicitação;
                    → Qualidade de áudio e vídeo em boas condições;
                    → Necessário a realização de até uma live por semana de até 30 minutos.
                    
                    **TikTok**
                    → Minímo de 700 seguidores;
                    → Necessário ter no minímo 3 vídeos gravados em qualquer servidor da rede;
                    → Qualidade de áudio e vídeo em boas condições;
                    → Necessária a postagem de 3 tiktoks por semana, gravados em qualquer servidor da rede.
                    
                    Caso sua solcitação seja aceita e você não cumpra os requisitos para mante-lá a mesma será revogada.
                    
                    Boa sorte!` );

                let botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("formulario")
                    .setEmoji("☝")
                    .setLabel("Solicite!")
                    .setStyle(Discord.ButtonStyle.Primary)
                );

                canal_formulario.send({ embeds: [embed_formulario], components: [botao] })
            })
        } 
    }
  }
}