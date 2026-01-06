const Discord = require("discord.js")

module.exports = {
    name: "roletarussa",
    description: "Comando para jogares roleta russa",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction, args) => {

        const numero = Math.floor(Math.random() * 11)

        const embed1 = new Discord.EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor("Blurple")
            .setDescription(`${interaction.user} pegou a arma e puxou o gatilho...`)
            .setTimestamp()

        if(numero >= 5) {
            const embed2 = new Discord.EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor("Blurple") //código hex vermelho
            .setDescription(`${interaction.user} acabou indo de americanas...`)
            .setTimestamp()

            interaction.reply({embeds: [embed1]}).then(() => {
                setTimeout(() => {
                    interaction.editReply({embeds: [embed2]})
                }, 3000)
            })
        }else {
            const embed3 = new Discord.EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor("Blurple") //código hex verde
            .setDescription(`${interaction.user} felizmente teve a sorte grande e sobreviveu!`)
            .setTimestamp()

            interaction.reply({embeds: [embed1]}).then(() => {
                setTimeout(() => {
                    interaction.editReply({embeds: [embed3]})
                }, 3000)
            })
        }

    }
}