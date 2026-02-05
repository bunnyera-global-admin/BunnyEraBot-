import { Client, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";
import { OperationsSystem } from "./modules/operations.js";
import { AIAssistant } from "./modules/ai-assistant.js";
import { LogAuditSystem } from "./modules/log-audit.js";
import { BackupSystem } from "./modules/backup.js";
import { ChannelHealthCheck } from "./modules/health-check.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Initialize BunnyEra HQ Systems
let operationsSystem;
let aiAssistant;
let logAuditSystem;
let backupSystem;
let healthCheckSystem;

client.once("ready", async () => {
  console.log(`\n🐰 ========================================`);
  console.log(`   BunnyEra HQ Bot 已上线`);
  console.log(`   登录身份: ${client.user.tag}`);
  console.log(`========================================\n`);

  // Initialize all modules
  console.log("🚀 正在初始化 BunnyEra HQ 系统模块...\n");

  try {
    // 1. Automated Operations System
    operationsSystem = new OperationsSystem(client);
    await operationsSystem.initialize();

    // 2. AI Management Assistant
    aiAssistant = new AIAssistant(client);
    await aiAssistant.initialize();

    // 3. Log Audit System
    logAuditSystem = new LogAuditSystem(client);
    await logAuditSystem.initialize();

    // 4. Backup System
    backupSystem = new BackupSystem(client);
    await backupSystem.initialize();

    // 5. Channel Health Check System
    healthCheckSystem = new ChannelHealthCheck(client);
    await healthCheckSystem.initialize();

    console.log("\n✅ 所有系统模块已成功启动!");
    console.log("🐰 BunnyEra HQ 运营中心已就绪\n");
  } catch (error) {
    console.error("\n❌ 模块初始化失败:", error);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 正在关闭 BunnyEra HQ Bot...");
  
  // Flush any pending logs
  if (logAuditSystem) {
    await logAuditSystem.flushLogs();
  }
  
  console.log("👋 再见!");
  process.exit(0);
});

client.login(process.env.BOT_TOKEN);
