/**
 * BunnyEra HQ 自动备份系统
 * Automated Backup System
 * 
 * Handles:
 * - Server configuration backups
 * - Channel data backups
 * - Role and permission backups
 * - Automated backup scheduling
 */

import fs from "fs/promises";
import path from "path";

export class BackupSystem {
  constructor(client) {
    this.client = client;
    this.backupDir = "./backups";
    this.backupInterval = 86400000; // 24 hours
  }

  /**
   * Initialize backup system
   */
  async initialize() {
    console.log("💾 备份系统已启动 | Backup System initialized");
    
    // Ensure backup directory exists
    await this.ensureBackupDirectory();
    
    // Start automated backups
    this.startAutomatedBackups();
  }

  /**
   * Ensure backup directory exists
   */
  async ensureBackupDirectory() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      console.log(`✅ 备份目录已创建: ${this.backupDir}`);
    } catch (error) {
      console.error("❌ 创建备份目录失败:", error);
    }
  }

  /**
   * Start automated backup scheduling
   */
  startAutomatedBackups() {
    // Initial backup after 5 minutes
    setTimeout(() => {
      this.performFullBackup();
    }, 300000);

    // Regular backups every 24 hours
    setInterval(() => {
      this.performFullBackup();
    }, this.backupInterval);

    console.log("⏰ 自动备份已设置: 每24小时执行一次");
  }

  /**
   * Perform full server backup
   */
  async performFullBackup() {
    console.log("🔄 开始执行完整备份...");
    
    try {
      const guilds = this.client.guilds.cache;
      
      for (const [guildId, guild] of guilds) {
        await this.backupGuild(guild);
      }
      
      console.log("✅ 完整备份完成");
    } catch (error) {
      console.error("❌ 备份失败:", error);
    }
  }

  /**
   * Backup a specific guild
   */
  async backupGuild(guild) {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        guild: {
          id: guild.id,
          name: guild.name,
          description: guild.description,
          memberCount: guild.memberCount,
          createdAt: guild.createdAt.toISOString()
        },
        channels: await this.backupChannels(guild),
        roles: await this.backupRoles(guild),
        settings: this.backupSettings(guild)
      };

      const filename = `backup_${guild.name}_${Date.now()}.json`;
      const filepath = path.join(this.backupDir, filename);
      
      await fs.writeFile(filepath, JSON.stringify(backupData, null, 2));
      console.log(`✅ 服务器备份完成: ${guild.name} -> ${filename}`);
      
      // Clean old backups
      await this.cleanOldBackups();
    } catch (error) {
      console.error(`❌ 备份服务器失败 ${guild.name}:`, error);
    }
  }

  /**
   * Backup all channels
   */
  async backupChannels(guild) {
    const channels = [];
    
    for (const [channelId, channel] of guild.channels.cache) {
      channels.push({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        position: channel.position,
        topic: channel.topic,
        parentId: channel.parentId,
        nsfw: channel.nsfw,
        rateLimitPerUser: channel.rateLimitPerUser
      });
    }
    
    return channels;
  }

  /**
   * Backup all roles
   */
  async backupRoles(guild) {
    const roles = [];
    
    for (const [roleId, role] of guild.roles.cache) {
      roles.push({
        id: role.id,
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions.bitfield.toString(),
        managed: role.managed,
        mentionable: role.mentionable
      });
    }
    
    return roles;
  }

  /**
   * Backup server settings
   */
  backupSettings(guild) {
    return {
      afkChannelId: guild.afkChannelId,
      afkTimeout: guild.afkTimeout,
      systemChannelId: guild.systemChannelId,
      verificationLevel: guild.verificationLevel,
      explicitContentFilter: guild.explicitContentFilter,
      defaultMessageNotifications: guild.defaultMessageNotifications,
      premiumTier: guild.premiumTier
    };
  }

  /**
   * Clean old backups (keep last 7 days)
   */
  async cleanOldBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      for (const file of files) {
        if (!file.startsWith("backup_")) continue;
        
        const filepath = path.join(this.backupDir, file);
        const stats = await fs.stat(filepath);
        const fileAge = now - stats.mtimeMs;
        
        if (fileAge > maxAge) {
          await fs.unlink(filepath);
          console.log(`🗑️ 已删除旧备份: ${file}`);
        }
      }
    } catch (error) {
      console.error("❌ 清理旧备份失败:", error);
    }
  }

  /**
   * List available backups
   */
  async listBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = files
        .filter(file => file.startsWith("backup_"))
        .sort()
        .reverse();
      
      return backups;
    } catch (error) {
      console.error("❌ 列出备份失败:", error);
      return [];
    }
  }

  /**
   * Restore from backup
   */
  async restoreBackup(filename) {
    try {
      const filepath = path.join(this.backupDir, filename);
      const content = await fs.readFile(filepath, "utf-8");
      const backupData = JSON.parse(content);
      
      console.log(`📥 正在从备份恢复: ${filename}`);
      console.log("⚠️ 备份恢复功能需要手动实施以防止意外数据丢失");
      
      return backupData;
    } catch (error) {
      console.error("❌ 恢复备份失败:", error);
      return null;
    }
  }
}
