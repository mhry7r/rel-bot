require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const gifs = require('./gifs.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

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

  // Use server nickname if available, otherwise fall back to display name
  const taggerMember = interaction.member;
  const tagger = taggerMember?.nickname || interaction.user.displayName || interaction.user.username;

  let message;
  if (target) {
    // Get the target's server nickname too
    const targetMember = await interaction.guild.members.fetch(target.id).catch(() => null);
    const targetName = targetMember?.nickname || target.displayName || target.username;

    message = gifs[commandName].message
      .replace('{tagger}', `**${tagger}**`)
      .replace('{tagged}', `**${targetName}**`);
  } else {
    // No target — still use the template but replace {tagged} with "everyone"
    message = gifs[commandName].message
      .replace('{tagger}', `**${tagger}**`)
      .replace('{tagged}', '**everyone**');
  }

  await interaction.reply({ content: `${message}\n${gif}` });
});

client.login(process.env.DISCORD_TOKEN);
