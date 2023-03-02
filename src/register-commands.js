require("dotenv").config()
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'verify',
        description: 'Verify as a customer with an Order ID',
        options: [
            {
                name: 'order-id',
                description: 'The Order ID of your Simple SMS order',
                type: ApplicationCommandOptionType.String
            }
        ]
    }
];


const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();