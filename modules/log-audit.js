/**
 * BunnyEra HQ 自动日志审计系统
 * Automated Log Audit System
 * 
 * Handles:
 * - Event logging
 * - Audit trail maintenance
 * - Security monitoring
 * - Action history tracking
 */

import { EmbedBuilder } from "discord.js";
import fs from "fs/promises";
import path from "path";

export class LogAuditSystem {
  constructor(client) {
    this.client = client;
    this.logDir = "./logs";
    this.auditLog = [];
    this.securityEvents = [];
  }

  /**
   * Initialize log audit system
   */
  async initialize() {
    console.log("📋 日志审计系统已启动 | Log Audit System initialized");
    
    // Ensure log directory exists
    await this.ensureLogDirectory();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start periodic log rotation
    this.startLogRotation();
  }

  /**
   * Ensure log directory exists
   */
  async ensureLogDirectory() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
      console.log(`✅ 日志目录已创建: ${this.logDir}`);
    } catch (error) {
      console.error("❌ 创建日志目录失败:", error);
    }
  }

  /**
   * Setup event listeners for audit logging
   */
  setupEventListeners() {
    // Member events
    this.client.on("guildMemberAdd", (member) => {
      this.logEvent("MEMBER_JOIN", {
        userId: member.id,
        username: member.user.tag,
        timestamp: new Date().toISOString()
      });
    });

    this.client.on("guildMemberRemove", (member) => {
      this.logEvent("MEMBER_LEAVE", {
        userId: member.id,
        username: member.user.tag,
        timestamp: new Date().toISOString()
      });
    });

    // Message events
    this.client.on("messageDelete", (message) => {
      if (!message.partial && !message.author.bot) {
        this.logEvent("MESSAGE_DELETE", {
          userId: message.author.id,
          username: message.author.tag,
          channelId: message.channelId,
          content: message.content.substring(0, 100),
          timestamp: new Date().toISOString()
        });
      }
    });

    this.client.on("messageUpdate", (oldMessage, newMessage) => {
      if (!oldMessage.partial && !oldMessage.author.bot) {
        this.logEvent("MESSAGE_EDIT", {
          userId: oldMessage.author.id,
          username: oldMessage.author.tag,
          channelId: oldMessage.channelId,
          oldContent: oldMessage.content.substring(0, 100),
          newContent: newMessage.content.substring(0, 100),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Role events
    this.client.on("guildMemberUpdate", (oldMember, newMember) => {
      const oldRoles = oldMember.roles.cache.map(r => r.name);
      const newRoles = newMember.roles.cache.map(r => r.name);
      
      if (oldRoles.length !== newRoles.length) {
        this.logEvent("ROLE_UPDATE", {
          userId: newMember.id,
          username: newMember.user.tag,
          oldRoles,
          newRoles,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Channel events
    this.client.on("channelCreate", (channel) => {
      this.logEvent("CHANNEL_CREATE", {
        channelId: channel.id,
        channelName: channel.name,
        channelType: channel.type,
        timestamp: new Date().toISOString()
      });
    });

    this.client.on("channelDelete", (channel) => {
      this.logEvent("CHANNEL_DELETE", {
        channelId: channel.id,
        channelName: channel.name,
        channelType: channel.type,
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Log an event
   */
  async logEvent(eventType, data) {
    const logEntry = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    };

    this.auditLog.push(logEntry);
    console.log(`📝 审计日志: ${eventType}`, data);

    // Check if this is a security event
    if (this.isSecurityEvent(eventType)) {
      this.securityEvents.push(logEntry);
      console.log(`🔒 安全事件记录: ${eventType}`);
    }

    // Write to file periodically
    if (this.auditLog.length >= 100) {
      await this.flushLogs();
    }
  }

  /**
   * Check if event is security-related
   */
  isSecurityEvent(eventType) {
    const securityEventTypes = [
      "MEMBER_BAN",
      "MEMBER_KICK",
      "ROLE_UPDATE",
      "CHANNEL_DELETE",
      "MESSAGE_DELETE"
    ];
    return securityEventTypes.includes(eventType);
  }

  /**
   * Flush logs to file
   */
  async flushLogs() {
    if (this.auditLog.length === 0) return;

    try {
      const filename = `audit_${new Date().toISOString().split("T")[0]}.json`;
      const filepath = path.join(this.logDir, filename);
      
      // Read existing logs if file exists
      let existingLogs = [];
      try {
        const content = await fs.readFile(filepath, "utf-8");
        existingLogs = JSON.parse(content);
      } catch (error) {
        // File doesn't exist yet, that's okay
      }

      // Append new logs
      const allLogs = [...existingLogs, ...this.auditLog];
      await fs.writeFile(filepath, JSON.stringify(allLogs, null, 2));
      
      console.log(`✅ 日志已写入: ${filename} (${this.auditLog.length} 条)`);
      this.auditLog = [];
    } catch (error) {
      console.error("❌ 日志写入失败:", error);
    }
  }

  /**
   * Start periodic log rotation
   */
  startLogRotation() {
    // Flush logs every 5 minutes
    setInterval(async () => {
      await this.flushLogs();
    }, 300000);
  }

  /**
   * Get audit statistics
   */
  getAuditStats() {
    return {
      totalEvents: this.auditLog.length,
      securityEvents: this.securityEvents.length,
      lastEvent: this.auditLog[this.auditLog.length - 1]
    };
  }

  /**
   * Search logs by event type
   */
  searchLogs(eventType, limit = 50) {
    return this.auditLog
      .filter(log => log.type === eventType)
      .slice(-limit);
  }
}
