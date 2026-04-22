require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
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
  const taggerMember = interaction.member;
  const tagger = taggerMember?.nickname || interaction.user.displayName || interaction.user.username;

  let message;
  if (target) {
    const targetMember = await interaction.guild.members.fetch(target.id).catch(() => null);
    const targetName = targetMember?.nickname || target.displayName || target.username;

    message = gifs[commandName].message
      .replace('{tagger}', `**${tagger}**`)
      .replace('{tagged}', `**${targetName}** (<@${target.id}>)`);
  } else {
    message = gifs[commandName].message
      .replace('{tagger}', `**${tagger}**`)
      .replace('{tagged}', '**everyone**');
  }

  // Message text displays naturally, embed just holds the GIF — no raw URL visible
  const gifEmbed = new EmbedBuilder().setImage(gif);

  await interaction.reply({ content: message, embeds: [gifEmbed] });
});

client.login(process.env.DISCORD_TOKEN);
