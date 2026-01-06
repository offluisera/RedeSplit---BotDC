const Discord = require("discord.js")
const config = require("./config.json")
const fs = require('fs');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const client = new Discord.Client({ 
    intents: [ 
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
    ],
    partials: [
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.User,
    ],
});

module.exports = client

// Listener de Comandos de Aplicação
client.on('interactionCreate', (interaction) => {
    if(interaction.type === Discord.InteractionType.ApplicationCommand){
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.reply({ content: `Olá ${interaction.member}, Tive problemas para executar este comando!`, ephemeral: true});
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction)
    }
})

// Evento Ready
client.on('ready', () => {
    console.clear()
    console.log(`✅ - Estou online em ${client.user.username}!`)
})

// Listener de Botões de Verificação
client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "verificar") {
            // 1. DEFERIR IMEDIATAMENTE (Responde ao Discord em < 3s)
            await interaction.deferReply({ ephemeral: true }); 

            // 2. Processar a lógica (pode levar mais tempo)
            let role_id = await db.get(`cargo_verificação_${interaction.guild.id}`);
            let role = interaction.guild.roles.cache.get(role_id);

            if (!role) {
                // Se o cargo não existir, edita a resposta com um erro
                return interaction.editReply({ content: "❌ O cargo de verificação não está configurado ou não existe.", ephemeral: true });
            }

            // Adiciona o cargo
            await interaction.member.roles.add(role.id).catch(err => {
                console.error("Erro ao adicionar cargo:", err);
                return interaction.editReply({ content: "❌ Não consegui adicionar o cargo. Verifique minhas permissões.", ephemeral: true });
            });

            // 3. ENVIAR RESPOSTA FINAL
            interaction.editReply({ content: `✅ Olá **${interaction.user.username}**, você foi verificado!`, ephemeral: true })
        }
    }
})

// Listener de Formulário (Modal)
client.on("interactionCreate", async(interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "formulario") {
            if (!interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
            
            const modal = new Discord.ModalBuilder()
            .setCustomId("modal")
            .setTitle("Formulário");

            const pergunta1 = new Discord.TextInputBuilder()
            .setCustomId("pergunta1") 
            .setLabel("Insira o link do seu canal/twitch/tiktok.") 
            .setMaxLength(30) 
            .setMinLength(5) 
            .setPlaceholder("Link do canal.") 
            .setRequired(true) 
            .setStyle(Discord.TextInputStyle.Short) 

            const pergunta2 = new Discord.TextInputBuilder()
            .setCustomId("pergunta2") 
            .setLabel("Insira o link do vídeo.") 
            .setMaxLength(30) 
            .setPlaceholder("Link do vídeo.") 
            .setStyle(Discord.TextInputStyle.Short) 
            .setRequired(false)

            const pergunta3 = new Discord.TextInputBuilder()
            .setCustomId("pergunta3") 
            .setLabel("Qual a motivação para a solicitação?") 
            .setPlaceholder("Responda aqui.") 
            .setStyle(Discord.TextInputStyle.Paragraph) 
            .setRequired(false)

            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(pergunta1),
                new Discord.ActionRowBuilder().addComponents(pergunta2),
                new Discord.ActionRowBuilder().addComponents(pergunta3)
            )

            await interaction.showModal(modal)
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "modal") {
            let resposta1 = interaction.fields.getTextInputValue("pergunta1")
            let resposta2 = interaction.fields.getTextInputValue("pergunta2")
            let resposta3 = interaction.fields.getTextInputValue("pergunta3")

            if (!resposta1) resposta1 = "Não informado."
            if (!resposta2) resposta2 = "Não informado."
            if (!resposta3) resposta3 = "Não informado."

            let embed = new Discord.EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`O usuário ${interaction.user} enviou o formulário abaixo:`)
            .addFields(
                {
                    name: `Pergunta 1:`,
                    value: `*Resposta 1:* \`${resposta1}\``,
                    inline: false
                },
                {
                    name: `Pergunta 2:`,
                    value: `*Resposta 2:* \`${resposta2}\``,
                    inline: false
                },
                {
                    name: `Pergunta 3:`,
                    value: `*Resposta 3:* \`${resposta3}\``,
                    inline: false
                }
            );

            interaction.reply({ content: `Olá **${interaction.user.username}**, o seu formulário foi enviado com sucesso!`, ephemeral: true})
            await interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`)).send({ embeds: [embed] })
        }
    }
})

// Listener de Ticket (Select Menu e Botão Fechar)
client.on("interactionCreate", (interaction) => {
    // ⚠️ CORREÇÃO: isSelectMenu() substituído por isStringSelectMenu()
    if (interaction.isStringSelectMenu()) { 
        if (interaction.customId === "painel_ticket") {
            let opc = interaction.values[0]
            
            if (opc === "opc1" || opc === "opc2" || opc === "opc3") {
                let nome = `📨-${interaction.user.id}`;
                let categoria = "1312651862792601660" // Coloque o ID da categoria
                
                // Verifica se a categoria existe E se é do tipo Category (4)
                if (!interaction.guild.channels.cache.get(categoria) || interaction.guild.channels.cache.get(categoria).type !== Discord.ChannelType.GuildCategory) {
                    categoria = null; 
                }

                if (interaction.guild.channels.cache.find(c => c.name === nome)) {
                    return interaction.reply({ content: `❌ Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)}!`, ephemeral: true })
                }
                
                let descricaoEmbed;

                // Define a descrição com base na opção
                if (opc === "opc1") {
                    descricaoEmbed = `Olá ${interaction.user}, você abriu o ticket solicitando suporte.`;
                } else if (opc === "opc2") {
                    descricaoEmbed = `Olá ${interaction.user}, você abriu o ticket para realizar uma denúncia.`;
                } else if (opc === "opc3") {
                    descricaoEmbed = `Olá ${interaction.user}, você abriu o ticket solicitando suporte técnico.`;
                }

                interaction.guild.channels.create({
                    name: nome,
                    type: Discord.ChannelType.GuildText,
                    parent: categoria,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [
                                Discord.PermissionFlagsBits.ViewChannel
                            ]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.SendMessages,
                                Discord.PermissionFlagsBits.AttachFiles,
                                Discord.PermissionFlagsBits.EmbedLinks,
                                Discord.PermissionFlagsBits.AddReactions
                            ]
                        }
                    ]
                }).then( (ch) => {
                    interaction.reply({ content: `✅ Olá ${interaction.user}, seu ticket foi aberto em ${ch}!`, ephemeral: true })
                    
                    let embed = new Discord.EmbedBuilder()
                    .setColor("#fcba03")
                    .setDescription(descricaoEmbed); 
                    
                    let botao = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("fechar_ticket")
                        .setEmoji("🔒")
                        .setStyle(Discord.ButtonStyle.Danger)
                    );

                    ch.send({ embeds: [embed], components: [botao] }).then( m => { 
                        m.pin()
                    })
                })
            }
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === "fechar_ticket") {
            interaction.reply(`Olá ${interaction.user}, este ticket será excluído em 5 segundos...`)
            setTimeout ( () => {
                try { 
                    interaction.channel.delete()
                } catch (e) {
                    return;
                }
            }, 5000)
        }
    }
})

// Inicialização de Comandos Slash e Eventos
client.slashCommands = new Discord.Collection()
require('./Handler')(client)


client.login(config.token)

fs.readdir('./Events', (err, file) => {
    file.forEach(event => {
        require(`./Events/${event}`)
    })
    setTimeout(() => {
        console.log("✅ - O sistema de eventos foi iniciado!")
    }, 2000);
})