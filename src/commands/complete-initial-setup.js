/**
 * /complete-initial-setup Command
 * 
 * This command can only be run by the server owner and enables all automated systems
 * by marking the human initialization as complete.
 */

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { markInitializationComplete, isInitializationComplete } from '../config/initializationState.js';

export const data = new SlashCommandBuilder()
  .setName('complete-initial-setup')
  .setDescription('Complete the initial manual setup and enable automated systems (Server Owner only)')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  // Check if the user is the server owner
  if (interaction.user.id !== interaction.guild.ownerId) {
    await interaction.reply({
      content: '❌ **Permission Denied**\n\nThis command can only be run by the server owner.',
      ephemeral: true
    });
    return;
  }

  // Check if already initialized
  if (isInitializationComplete()) {
    await interaction.reply({
      content: '✅ **Already Initialized**\n\nAutomated systems are already enabled.',
      ephemeral: true
    });
    return;
  }

  // Mark initialization as complete
  markInitializationComplete();

  // Log the activation
  console.log(`[INITIALIZATION] Human setup completed by ${interaction.user.tag} (${interaction.user.id}) in server ${interaction.guild.name} (${interaction.guild.id})`);

  // Respond to the user
  await interaction.reply({
    content: '✅ **Initial Setup Complete!**\n\n' +
             '🤖 All automated systems are now **ENABLED**.\n\n' +
             'The BunnyEra HQ Discord Bot will now begin automated operations.',
    ephemeral: false
  });
}
