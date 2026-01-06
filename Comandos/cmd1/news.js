const Discord = require('discord.js')

module.exports = {
    name: "news",
    description: "｢Utilidades｣ Veja as novidades e atualizações do Bot.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        
        const embed = new Discord.EmbedBuilder()
        .setTitle("Atualizações!")
        .setColor('Blurple')
        .setDescription(`
> 👋 Olá ${interaction.user},

Você deseja saber minhas últimas notícias e novidades certo? Então continue lendo.
Fui atualizado recentemente (01/12/2024 às 17:00P.M) e todos meus comandos foram Modificados, Alterados, Melhorados e etc.
Atualmente estou apenas respondendo aos comandos em Slash(/).

> Novos comandos:

- /hug - Abrace algum usuário(a)
- /kiss - Beije algum usuário(a)
- /slap - De o tapa em alguém
- /ship - Veja o nível de crush entre membros
- /gado - Veja qual o nível de gadisse de alguém
- /akinator - Jogue akinator
- /cantada - Mande uma cantada para alguém`)
        .setTimestamp()

        interaction.reply({ embeds: [embed] })
    }
}
