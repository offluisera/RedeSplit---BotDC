const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "verificação", // Coloque o nome do comando
  description: "Ative o sistema de verificação.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "cargo_verificado",
        description: "Mencione um cargo para o membro receber após se verificar.",
        type: Discord.ApplicationCommandOptionType.Role,
        required: true,
    },
    {
        name: "canal",
        description: "Mencione um canal de texto.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: false,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
        interaction.reply(`Olá ${interaction.user}, você não possui permissão para utilizar este comando.`)
    } else {
        let canal = interaction.options.getChannel("canal");
        if (!canal) canal = interaction.channel;

        let cargo = interaction.options.getRole("cargo_verificado");
        await db.set(`cargo_verificação_${interaction.guild.id}`, cargo.id);

        let embed_ephemeral = new Discord.EmbedBuilder()
        .setColor("Grey")
        .setDescription(`Olá ${interaction.user}, o sistema foi ativado no canal ${canal} com sucesso.`);

        let embed_verificacao = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setDescription(` 👋 Olá Seja bem-vindo(a) ao discord do servidor Rede Split! 
            Esperamos que econtre o que esteja buscando.
            Pedimos humildemente, se verifique clicando no botão a baixo!`);

        let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("verificar")
            .setEmoji("✅")
            .setLabel("Verifique-se")
            .setStyle(Discord.ButtonStyle.Primary)
        );

        interaction.reply({ embeds: [embed_ephemeral], ephemeral: true }).then( () => {
            canal.send({ embeds: [embed_verificacao], components: [botao] })
        })
    }


    
  }
}