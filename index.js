import { Client, GatewayIntentBits, Collection, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import { isInitializationComplete, getInitializationStatus } from './src/config/initializationState.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Collection to store commands
client.commands = new Collection();

// Load commands
const commandsPath = join(__dirname, 'src', 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`[COMMANDS] Loaded command: ${command.data.name}`);
  } else {
    console.warn(`[COMMANDS] Warning: ${file} is missing required "data" or "execute" property`);
  }
}

// Register slash commands with Discord
async function registerCommands() {
  const commands = [];
  for (const command of client.commands.values()) {
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

  try {
    console.log(`[COMMANDS] Registering ${commands.length} slash command(s)...`);
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('[COMMANDS] Successfully registered slash commands globally');
  } catch (error) {
    console.error('[COMMANDS] Error registering slash commands:', error);
  }
}

client.once("ready", async () => {
  console.log(`[BOT] Logged in as ${client.user.tag}`);
  console.log(`[INITIALIZATION] Status: ${getInitializationStatus()}`);
  
  if (!isInitializationComplete()) {
    console.log('[INITIALIZATION] ⚠️  AUTOMATED SYSTEMS DISABLED');
    console.log('[INITIALIZATION] Run /complete-initial-setup to enable automation');
    console.log('[INITIALIZATION] See docs/HUMAN_SETUP.md for setup instructions');
  }

  await registerCommands();
});

// Handle interactions (slash commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`[COMMANDS] No command matching ${interaction.commandName} was found`);
    return;
  }

  try {
    await command.execute(interaction);
    console.log(`[COMMANDS] ${interaction.user.tag} executed /${interaction.commandName}`);
  } catch (error) {
    console.error(`[COMMANDS] Error executing ${interaction.commandName}:`, error);
    const errorMessage = {
      content: '❌ There was an error executing this command!',
      ephemeral: true
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Example: Automated system that respects initialization state
// This is a placeholder to demonstrate how to check initialization status
function exampleAutomatedTask() {
  if (!isInitializationComplete()) {
    console.log('[AUTOMATED] Task skipped - initialization not complete');
    return;
  }
  
  // Automated task logic would go here
  console.log('[AUTOMATED] Running automated task...');
}

// Uncomment to test automated task checking
// setInterval(exampleAutomatedTask, 60000); // Every 60 seconds

client.login(process.env.BOT_TOKEN);
