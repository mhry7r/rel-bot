require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const gifs = require('./gifs.json');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

const commands = Object.keys(gifs).map(name =>
  new SlashCommandBuilder()
    .setName(name)
    .setDescription(gifs[name].description)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Who do you want to target?')
        .setRequired(false)
    )
    .toJSON()
);

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`🔄 Registering ${commands.length} commands...`);
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('✅ Commands registered!');
    console.log('Commands:', commands.map(c => `/${c.name}`).join(', '));
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
})();
