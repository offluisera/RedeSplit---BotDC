const Discord = require('discord.js')

module.exports = {
    name: "cantada",
    description: "Mande uma cantada para alguém.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            description: "Mencione um usuário.",
            type: Discord.ApplicationCommandOptionType.User,
            require: true
        }
    ],

    run: async (client, interaction) => {

        let cantadas = [
            'Você é encanador? E esse cano PVC aí!',
            'Sua mãe é tão linda, parece o exoplaneta.',
            'Pensava que felicidade começava com F, mas começa com sua mãe!!',
            'Eu ia dizer uma coisa fofa, mas você me deixou sem palavras.',
            'Seus pais são matemáticos? Porque você é um produto notável.',
            'Meu amor por você é como a fórmula de Pi: irracional e infinito.',
            'Minha vida sem você é como um vetor nulo: não tem intensidade, direção, nem sentido.',
            'Do que adianta estudar Física, se você não respeita a lei da nossa atração?',
            'Você e eu = Teoria da Unificação.',
            'Pensava que felicidade começava com F, mas começa com você.',
            'Pronto, já estou aqui. Quais são seus outros 2 desejos?',
            'Meu nome é Arlindo, mas pode me chamar só de lindo, porque o ar eu perdi quando te vi.',
            'Você não é o dinheiro perdido no bolso do casaco, mas fiquei muito feliz de te encontrar!',
            'Você é tão lindo(a) que, quando nasceu, a sua mãe não te deu apenas à luz, mas a companhia de energia inteira.',
            'Você não é massagem cardíaca, mas toca e reanima o meu coração.',
            'Me passa o seu Instagram? Meu pai disse que eu devo seguir o meu sonho.'
        ]
        let usuario = interaction.options.getUser('usuario')
        let random = cantadas[Math.floor(Math.random() * cantadas.length)]

        const embed = new Discord.EmbedBuilder()
        .setTitle('Cantada')
        .setDescription(` O usuário ${interaction.user} enviou uma cantada para ${usuario}.
        
        😍 ${random}`)

        interaction.reply({embeds: [embed]})

    }
}