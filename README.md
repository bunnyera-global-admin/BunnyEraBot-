# BunnyEraBot — Discord Bot Development

## 🐰 BunnyEra HQ 全功能管理平台

BunnyEra HQ Bot 是一个全功能的 Discord 服务器管理平台，集成了五个强大的自动化系统模块。

### ✨ 核心系统模块

1. **🔧 自动化运营系统** - 新成员欢迎、活动监控、用户统计
2. **🤖 AI 管理助手** - 智能命令处理、内容审核、智能建议
3. **📋 日志审计系统** - 事件日志、安全监控、审计追踪
4. **💾 自动备份系统** - 配置备份、定时备份、灾难恢复
5. **🏥 频道健康检查** - 活动监控、权限验证、健康报告

### 📚 详细文档

查看 [系统扩展文档](./docs/SYSTEM_EXPANSION.md) 了解所有功能的详细信息。

---

## Bot Invite URL
The bot is already created in Discord.  
Use this OAuth2 URL to install the bot into the server:

https://discord.com/oauth2/authorize?client_id=1468891460677140575&permissions=11280&integration_type=0&scope=bot

## Quick Start | 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，添加你的 BOT_TOKEN
```

### 3. 启动 Bot
```bash
npm start
```

## 可用命令 | Available Commands

- `!help` - 显示帮助信息
- `!status` - 查看服务器状态
- `!stats` - 查看统计信息
- `!suggest` - 获取智能建议

## 系统要求 | Requirements

- Node.js 16.9.0 或更高版本
- Discord Bot Token
- 必要的 Bot 权限:
  - View Channels (查看频道)
  - Send Messages (发送消息)
  - Embed Links (嵌入链接)
  - Read Message History (读取消息历史)
  - Manage Roles (管理角色) - 可选
  - Manage Channels (管理频道) - 可选

## 项目结构 | Project Structure

```
BunnyEraBot-/
├── index.js                    # 主入口文件
├── modules/                    # 系统模块目录
│   ├── operations.js          # 运营系统
│   ├── ai-assistant.js        # AI助手
│   ├── log-audit.js           # 日志审计
│   ├── backup.js              # 备份系统
│   └── health-check.js        # 健康检查
├── logs/                       # 日志文件目录
├── backups/                    # 备份文件目录
├── docs/                       # 文档目录
│   ├── TASKS.md
│   └── SYSTEM_EXPANSION.md
├── package.json
├── .env.example
└── README.md
```

## Task for AI Developer
You (AI agent) are responsible for:

1. Building the Discord bot inside this repository.
2. Using the invite URL above to ensure the bot is installed in the target server.
3. Implementing all required bot features inside this repo.
4. Managing the bot codebase, structure, and deployment pipeline.
5. Writing all necessary files (index.js, package.json, config, docs, etc.).
6. Using the bot token (provided separately by the human operator) to run the bot.

## Features | 功能特性

### 🔧 运营系统
- ✅ 自动欢迎新成员
- ✅ 实时活动监控
- ✅ 活跃用户统计
- ✅ 定期活动报告

### 🤖 AI 助手
- ✅ 智能命令响应
- ✅ 服务器状态查询
- ✅ 内容审核辅助
- ✅ 智能建议生成

### 📋 日志审计
- ✅ 全面事件记录
- ✅ 安全事件监控
- ✅ 自动日志轮换
- ✅ 审计追踪查询

### 💾 备份系统
- ✅ 自动定时备份 (每24小时)
- ✅ 服务器配置备份
- ✅ 频道和角色备份
- ✅ 7天备份保留

### 🏥 健康检查
- ✅ 频道活跃度监控
- ✅ 权限配置验证
- ✅ 健康分数评估
- ✅ 自动警报系统

## Notes
- The human operator will provide the bot token manually.
- Do NOT commit the token into the repository.
- All configuration must support environment variables.
- All logs are stored in `./logs/` directory
- All backups are stored in `./backups/` directory

## Support | 支持

如有问题或建议，请通过 GitHub Issues 联系我们。

---

**BunnyEra HQ - 让 Discord 服务器管理更智能、更高效！** 🐰✨
