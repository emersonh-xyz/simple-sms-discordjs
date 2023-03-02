const { Client, IntentsBitField, ActivityType, ActivityFlags } = require('discord.js')
require("dotenv").config()
const { MongoClient } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO_URI);

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]

})

client.on('ready', async (c) => {

    try {
        await mongo.connect();
        console.log(`✅ Connected to Database`)
        client.user.setActivity('>> /verify <<', { type: ActivityType.Watching })

    } catch (err) {
        console.log(`Error connecting to Database ${err}`)
    }

    console.log(`✅ ${c.user.tag} is online`)

})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // Find db for orders
    const database = mongo.db('orders')

    // Get collection for completed orders
    const completedOrders = database.collection('completed')

    // Get collection for active orders
    const activeOrders = database.collection('active')

    // Get collection for cancelled orders
    const cancelledOrders = database.collection('cancelled')

    // Customer role
    let customerRole = interaction.guild.roles.cache.get("1080631101111935128")

    // Member instance
    const member = interaction.member

    // Verify command
    if (interaction.commandName === 'verify') {

        // Get orderid input
        let param = interaction.options.get('order-id')

        // Check for match in collections
        let isCompletedOrder = await completedOrders.findOne({ orderId: param.value })
        let isActiveOrder = await activeOrders.findOne({ orderId: param.value })
        let isCancelledOrder = await cancelledOrders.findOne({ orderId: param.value })

        // Update roles of user
        if (isCompletedOrder || isActiveOrder || isCancelledOrder) {
            await interaction.reply({
                content: `Your account has been linked and verified!`,
                ephemeral: true
            })
            await member.roles.add(customerRole)
            return;
        } else {
            await interaction.reply({
                content: `We could not locate an order with this id, please open a ticket in #support for more assistance.`,
                ephemeral: true
            })
        }
    }


})

client.login(process.env.CLIENT_TOKEN)
