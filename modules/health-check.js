/**
 * BunnyEra HQ 自动频道健康检查系统
 * Automated Channel Health Check System
 * 
 * Handles:
 * - Channel activity monitoring
 * - Inactive channel detection
 * - Channel permission validation
 * - Health status reporting
 */

import { EmbedBuilder } from "discord.js";

export class ChannelHealthCheck {
  constructor(client) {
    this.client = client;
    this.channelActivity = new Map();
    this.healthCheckInterval = 3600000; // 1 hour
    this.inactivityThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days
  }

  /**
   * Initialize health check system
   */
  async initialize() {
    console.log("🏥 频道健康检查系统已启动 | Channel Health Check System initialized");
    
    // Setup activity tracking
    this.setupActivityTracking();
    
    // Start periodic health checks
    this.startHealthChecks();
  }

  /**
   * Setup activity tracking for all channels
   */
  setupActivityTracking() {
    this.client.on("messageCreate", (message) => {
      if (!message.guild) return;
      
      this.channelActivity.set(message.channelId, {
        lastActivity: Date.now(),
        messageCount: (this.channelActivity.get(message.channelId)?.messageCount || 0) + 1,
        channelName: message.channel.name
      });
    });
  }

  /**
   * Start periodic health checks
   */
  startHealthChecks() {
    // Initial check after 10 minutes
    setTimeout(() => {
      this.performHealthCheck();
    }, 600000);

    // Regular checks every hour
    setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckInterval);

    console.log("⏰ 健康检查计划已设置: 每小时执行一次");
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck() {
    console.log("🔍 开始频道健康检查...");
    
    try {
      const guilds = this.client.guilds.cache;
      
      for (const [guildId, guild] of guilds) {
        const healthReport = await this.checkGuildHealth(guild);
        await this.reportHealth(guild, healthReport);
      }
      
      console.log("✅ 健康检查完成");
    } catch (error) {
      console.error("❌ 健康检查失败:", error);
    }
  }

  /**
   * Check health of a specific guild
   */
  async checkGuildHealth(guild) {
    const report = {
      totalChannels: 0,
      activeChannels: 0,
      inactiveChannels: [],
      permissionIssues: [],
      healthScore: 100
    };

    const now = Date.now();

    for (const [channelId, channel] of guild.channels.cache) {
      // Skip non-text channels
      if (channel.type !== 0 && channel.type !== 5) continue;
      
      report.totalChannels++;

      // Check activity
      const activity = this.channelActivity.get(channelId);
      if (!activity || (now - activity.lastActivity) > this.inactivityThreshold) {
        report.inactiveChannels.push({
          id: channelId,
          name: channel.name,
          lastActivity: activity?.lastActivity || null
        });
      } else {
        report.activeChannels++;
      }

      // Check permissions
      const permissionCheck = await this.checkChannelPermissions(channel);
      if (!permissionCheck.healthy) {
        report.permissionIssues.push({
          channelId,
          channelName: channel.name,
          issues: permissionCheck.issues
        });
      }
    }

    // Calculate health score
    const inactiveRatio = report.inactiveChannels.length / Math.max(report.totalChannels, 1);
    const permissionRatio = report.permissionIssues.length / Math.max(report.totalChannels, 1);
    report.healthScore = Math.max(0, 100 - (inactiveRatio * 50) - (permissionRatio * 50));

    return report;
  }

  /**
   * Check channel permissions
   */
  async checkChannelPermissions(channel) {
    const result = {
      healthy: true,
      issues: []
    };

    try {
      // Check if bot has basic permissions
      const botMember = await channel.guild.members.fetchMe();
      const permissions = channel.permissionsFor(botMember);

      if (!permissions.has("ViewChannel")) {
        result.healthy = false;
        result.issues.push("Bot无法查看频道");
      }

      if (!permissions.has("SendMessages") && channel.type === 0) {
        result.healthy = false;
        result.issues.push("Bot无法发送消息");
      }

      if (!permissions.has("ReadMessageHistory")) {
        result.healthy = false;
        result.issues.push("Bot无法读取消息历史");
      }
    } catch (error) {
      result.healthy = false;
      result.issues.push(`权限检查错误: ${error.message}`);
    }

    return result;
  }

  /**
   * Report health status
   */
  async reportHealth(guild, healthReport) {
    console.log(`\n📊 服务器健康报告: ${guild.name}`);
    console.log(`   总频道数: ${healthReport.totalChannels}`);
    console.log(`   活跃频道: ${healthReport.activeChannels}`);
    console.log(`   不活跃频道: ${healthReport.inactiveChannels.length}`);
    console.log(`   权限问题: ${healthReport.permissionIssues.length}`);
    console.log(`   健康分数: ${healthReport.healthScore.toFixed(2)}/100`);

    if (healthReport.inactiveChannels.length > 0) {
      console.log(`   ⚠️ 不活跃频道列表:`);
      healthReport.inactiveChannels.slice(0, 5).forEach(ch => {
        const daysSince = ch.lastActivity 
          ? Math.floor((Date.now() - ch.lastActivity) / (24 * 60 * 60 * 1000))
          : "未知";
        console.log(`      - ${ch.name} (${daysSince}天无活动)`);
      });
    }

    if (healthReport.permissionIssues.length > 0) {
      console.log(`   ⚠️ 权限问题:`);
      healthReport.permissionIssues.slice(0, 3).forEach(issue => {
        console.log(`      - ${issue.channelName}: ${issue.issues.join(", ")}`);
      });
    }

    // Send report to admin channel if health score is low
    if (healthReport.healthScore < 70) {
      await this.sendHealthAlert(guild, healthReport);
    }
  }

  /**
   * Send health alert to admin channel
   */
  async sendHealthAlert(guild, healthReport) {
    try {
      // Find admin or log channel
      const adminChannel = guild.channels.cache.find(
        ch => ch.name.includes("admin") || ch.name.includes("log") || ch.name.includes("管理")
      );

      if (!adminChannel) return;

      const alertEmbed = new EmbedBuilder()
        .setColor(healthReport.healthScore < 50 ? 0xFF0000 : 0xFFA500)
        .setTitle("⚠️ 频道健康警报")
        .setDescription("检测到服务器健康状况下降")
        .addFields(
          { name: "健康分数", value: `${healthReport.healthScore.toFixed(2)}/100`, inline: true },
          { name: "总频道数", value: `${healthReport.totalChannels}`, inline: true },
          { name: "不活跃频道", value: `${healthReport.inactiveChannels.length}`, inline: true },
          { name: "权限问题", value: `${healthReport.permissionIssues.length}`, inline: true }
        )
        .setTimestamp();

      if (healthReport.inactiveChannels.length > 0) {
        const inactiveList = healthReport.inactiveChannels
          .slice(0, 5)
          .map(ch => `• ${ch.name}`)
          .join("\n");
        alertEmbed.addFields({ name: "部分不活跃频道", value: inactiveList });
      }

      await adminChannel.send({ embeds: [alertEmbed] });
      console.log("✅ 健康警报已发送");
    } catch (error) {
      console.error("❌ 发送健康警报失败:", error);
    }
  }

  /**
   * Get health statistics
   */
  getHealthStats() {
    return {
      trackedChannels: this.channelActivity.size,
      mostActiveChannel: this.getMostActiveChannel(),
      leastActiveChannel: this.getLeastActiveChannel()
    };
  }

  /**
   * Get most active channel
   */
  getMostActiveChannel() {
    let mostActive = null;
    let maxMessages = 0;

    for (const [channelId, activity] of this.channelActivity) {
      if (activity.messageCount > maxMessages) {
        maxMessages = activity.messageCount;
        mostActive = { ...activity, channelId };
      }
    }

    return mostActive;
  }

  /**
   * Get least active channel
   */
  getLeastActiveChannel() {
    let leastActive = null;
    let oldestActivity = Date.now();

    for (const [channelId, activity] of this.channelActivity) {
      if (activity.lastActivity < oldestActivity) {
        oldestActivity = activity.lastActivity;
        leastActive = { ...activity, channelId };
      }
    }

    return leastActive;
  }
}
