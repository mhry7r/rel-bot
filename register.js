require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const gifs = require('./gifs.json');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

// Auto-build slash commands from gifs.json keys
const commands = Object.keys(gifs).map(name =>
  new SlashCommandBuilder()
    .setName(name)
    .setDescription(`Send a random ${name} GIF`)
    .toJSON()
);

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`🔄 Registering ${commands.length} commands...`);
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('✅ Commands registered! They may take up to 1 hour to appear globally.');
    console.log('Commands:', commands.map(c => `/${c.name}`).join(', '));
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
})();
