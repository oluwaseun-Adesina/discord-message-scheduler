const { Client, IntentsBitField, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!schedule')) {
    // Parse the command arguments (message, time, channel)
    const args = message.content.split('-');
    const scheduledMessage = args[1]?.trim();
    const scheduledTime = args[2]?.trim(); // Format: HH:MM
    const channelId = args[3]?.trim();

    // Find the target channel
    const channel = client.channels.cache.get(channelId);

    // Check if all arguments are provided
    if (!scheduledMessage || !scheduledTime || !channel) {
      return message.reply('Invalid command. Please provide all the necessary arguments.');
    }

    // Calculate the time until the scheduled message
    const currentTime = new Date();
    const scheduledDateTime = new Date();
    const [hours, minutes] = scheduledTime.split(':');
    scheduledDateTime.setHours(hours);
    scheduledDateTime.setMinutes(minutes);
    const delayMilliseconds = scheduledDateTime - currentTime;

    // Schedule the message
    setTimeout(() => {
      channel.send(scheduledMessage);
    }, delayMilliseconds);
  }
});

client.login(process.env.token);
