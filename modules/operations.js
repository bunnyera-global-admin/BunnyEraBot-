/**
 * BunnyEra HQ 自动化运营系统
 * Automated Operations System
 * 
 * Handles:
 * - Server activity monitoring
 * - Automated welcome messages
 * - Role assignment automation
 * - Event scheduling and notifications
 */

import { EmbedBuilder } from "discord.js";

export class OperationsSystem {
  constructor(client) {
    this.client = client;
    this.welcomeChannel = null;
    this.activityLog = [];
  }

  /**
   * Initialize operations system
   */
  async initialize() {
    console.log("🔧 运营系统已启动 | Operations System initialized");
    
    this.client.on("guildMemberAdd", (member) => this.handleNewMember(member));
    this.client.on("messageCreate", (message) => this.trackActivity(message));
    
    // Start activity monitoring
    this.startActivityMonitoring();
  }

  /**
   * Handle new member joining
   */
  async handleNewMember(member) {
    try {
      const welcomeEmbed = new EmbedBuilder()
        .setColor(0xFF69B4)
        .setTitle("🐰 欢迎来到 BunnyEra HQ!")
        .setDescription(`欢迎 ${member.user.username} 加入我们的社区！`)
        .addFields(
          { name: "成员编号", value: `#${member.guild.memberCount}`, inline: true },
          { name: "加入时间", value: new Date().toLocaleString("zh-CN"), inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

      // Find welcome channel
      const channel = member.guild.channels.cache.find(
        ch => ch.name.includes("welcome") || ch.name.includes("欢迎")
      );

      if (channel) {
        await channel.send({ embeds: [welcomeEmbed] });
      }

      console.log(`✅ 新成员欢迎: ${member.user.tag}`);
    } catch (error) {
      console.error("❌ 欢迎消息发送失败:", error);
    }
  }

  /**
   * Track server activity
   */
  trackActivity(message) {
    if (message.author.bot) return;

    this.activityLog.push({
      userId: message.author.id,
      channelId: message.channelId,
      timestamp: Date.now()
    });

    // Keep only last 1000 activities
    if (this.activityLog.length > 1000) {
      this.activityLog.shift();
    }
  }

  /**
   * Start activity monitoring with periodic reports
   */
  startActivityMonitoring() {
    setInterval(() => {
      const activeUsers = new Set(this.activityLog.map(log => log.userId)).size;
      console.log(`📊 活跃用户数: ${activeUsers} | 最近消息数: ${this.activityLog.length}`);
    }, 3600000); // Every hour
  }

  /**
   * Get activity statistics
   */
  getActivityStats() {
    const now = Date.now();
    const lastHour = this.activityLog.filter(log => now - log.timestamp < 3600000);
    const last24h = this.activityLog.filter(log => now - log.timestamp < 86400000);

    return {
      total: this.activityLog.length,
      lastHour: lastHour.length,
      last24h: last24h.length,
      activeUsers: new Set(last24h.map(log => log.userId)).size
    };
  }
}
