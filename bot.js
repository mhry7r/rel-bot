require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const gifs = require('./gifs.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Pick a random gif from a pool
function randomGif(category) {
  const pool = gifs[category];
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (gifs[commandName]) {
    const gif = randomGif(commandName);
    if (gif) {
      await interaction.reply(gif);
    } else {
      await interaction.reply({ content: '😅 No GIFs found for this command!', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
