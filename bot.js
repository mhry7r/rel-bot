require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const gifs = require('./gifs.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function randomGif(category) {
  const pool = gifs[category].urls;
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (!gifs[commandName]) return;

  const gif = randomGif(commandName);
  if (!gif) return interaction.reply({ content: '😅 No GIFs found!', ephemeral: true });

  const target = interaction.options.getUser('user');
  const tagger = interaction.user.username;

  let message;
  if (target) {
    const template = gifs[commandName].message;
    message = template
      .replace('{tagger}', `**${tagger}**`)
      .replace('{tagged}', `**${target.username}**`);
  } else {
    message = `**${tagger}** used /${commandName}!`;
  }

  await interaction.reply({ content: `${message}\n${gif}` });
});

client.login(process.env.DISCORD_TOKEN);
