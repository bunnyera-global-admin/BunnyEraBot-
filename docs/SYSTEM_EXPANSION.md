# BunnyEra HQ 系统扩展文档
# BunnyEra HQ System Expansion Documentation

## 概述 | Overview

BunnyEra HQ Bot 现已扩展为一个全功能的Discord服务器管理平台，集成了五个强大的自动化系统模块。

BunnyEra HQ Bot has been expanded into a full-featured Discord server management platform, integrating five powerful automated system modules.

---

## 系统模块 | System Modules

### 1. 🔧 自动化运营系统 (Automated Operations System)

**文件路径**: `modules/operations.js`

**功能特性**:
- ✅ 新成员自动欢迎消息
- ✅ 服务器活动监控
- ✅ 活跃用户统计
- ✅ 实时活动日志

**主要功能**:
```javascript
- handleNewMember(member)     // 处理新成员加入
- trackActivity(message)       // 追踪频道活动
- getActivityStats()           // 获取活动统计
```

**使用场景**:
- 自动欢迎新加入的成员
- 监控服务器活跃度
- 生成活动报告

---

### 2. 🤖 AI 管理助手模块 (AI Management Assistant)

**文件路径**: `modules/ai-assistant.js`

**功能特性**:
- ✅ 智能命令处理
- ✅ 自动回复系统
- ✅ 内容审核辅助
- ✅ 智能建议生成

**可用命令**:
- `!help` - 显示帮助信息
- `!status` - 查看服务器状态
- `!stats` - 查看统计信息
- `!suggest` - 获取智能建议

**主要功能**:
```javascript
- handleMessage(message)       // 处理消息
- moderateContent(message)     // 内容审核
- addCommand(name, desc, fn)   // 添加自定义命令
```

**使用场景**:
- 快速响应用户查询
- 自动检测可疑内容
- 提供服务器管理建议

---

### 3. 📋 自动日志审计系统 (Automated Log Audit System)

**文件路径**: `modules/log-audit.js`

**功能特性**:
- ✅ 全面的事件日志记录
- ✅ 安全事件监控
- ✅ 审计追踪维护
- ✅ 自动日志轮换

**监控的事件类型**:
- 成员加入/离开 (MEMBER_JOIN / MEMBER_LEAVE)
- 消息删除/编辑 (MESSAGE_DELETE / MESSAGE_EDIT)
- 角色变更 (ROLE_UPDATE)
- 频道创建/删除 (CHANNEL_CREATE / CHANNEL_DELETE)

**主要功能**:
```javascript
- logEvent(eventType, data)    // 记录事件
- flushLogs()                  // 写入日志文件
- searchLogs(eventType)        // 搜索日志
- getAuditStats()              // 获取审计统计
```

**日志存储**:
- 位置: `./logs/`
- 格式: JSON
- 文件名: `audit_YYYY-MM-DD.json`
- 自动轮换: 每5分钟或100条记录

**使用场景**:
- 追踪服务器所有重要事件
- 安全审计和合规性检查
- 问题诊断和回溯

---

### 4. 💾 自动备份系统 (Automated Backup System)

**文件路径**: `modules/backup.js`

**功能特性**:
- ✅ 服务器配置自动备份
- ✅ 频道数据备份
- ✅ 角色和权限备份
- ✅ 定时备份计划

**备份内容**:
- 服务器基本信息
- 所有频道配置
- 所有角色和权限
- 服务器设置

**主要功能**:
```javascript
- performFullBackup()          // 执行完整备份
- backupGuild(guild)           // 备份特定服务器
- listBackups()                // 列出可用备份
- restoreBackup(filename)      // 恢复备份
```

**备份策略**:
- 初始备份: 启动后5分钟
- 定期备份: 每24小时
- 保留期限: 7天
- 存储位置: `./backups/`

**使用场景**:
- 灾难恢复
- 服务器迁移
- 配置版本控制

---

### 5. 🏥 自动频道健康检查系统 (Automated Channel Health Check)

**文件路径**: `modules/health-check.js`

**功能特性**:
- ✅ 频道活动监控
- ✅ 不活跃频道检测
- ✅ 权限验证
- ✅ 健康状态报告

**检查项目**:
- 频道活跃度分析
- 权限配置验证
- Bot访问权限检查
- 整体健康分数计算

**主要功能**:
```javascript
- performHealthCheck()         // 执行健康检查
- checkGuildHealth(guild)      // 检查服务器健康
- checkChannelPermissions(ch)  // 检查频道权限
- reportHealth(guild, report)  // 报告健康状态
```

**健康评分**:
- 100分: 完美状态
- 70-99分: 良好
- 50-69分: 需要注意
- <50分: 需要紧急处理

**检查频率**:
- 初始检查: 启动后10分钟
- 定期检查: 每小时
- 警报阈值: 分数<70时发送警报

**使用场景**:
- 识别被遗忘的频道
- 及时发现权限问题
- 优化服务器结构

---

## 安装和配置 | Installation & Configuration

### 前置要求 | Prerequisites

- Node.js 16.9.0 或更高版本
- Discord Bot Token
- 必要的Bot权限

### 安装步骤 | Installation Steps

1. **克隆仓库**:
```bash
git clone <repository-url>
cd BunnyEraBot-
```

2. **安装依赖**:
```bash
npm install
```

3. **配置环境变量**:
```bash
cp .env.example .env
# 编辑 .env 文件，添加你的 BOT_TOKEN
```

4. **启动Bot**:
```bash
npm start
```

### 必需的Bot权限 | Required Bot Permissions

- View Channels (查看频道)
- Send Messages (发送消息)
- Embed Links (嵌入链接)
- Read Message History (读取消息历史)
- Manage Roles (管理角色) - 可选
- Manage Channels (管理频道) - 可选

---

## 系统架构 | System Architecture

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
├── package.json
├── .env
└── README.md
```

---

## 模块集成 | Module Integration

所有模块在 `index.js` 中被初始化和集成:

```javascript
// 初始化顺序
1. OperationsSystem       // 运营系统
2. AIAssistant            // AI助手
3. LogAuditSystem         // 日志审计
4. BackupSystem           // 备份系统
5. ChannelHealthCheck     // 健康检查
```

---

## 使用示例 | Usage Examples

### 查看服务器状态
```
用户: !status
Bot: 显示服务器详细状态信息（成员数、频道数、角色数等）
```

### 获取智能建议
```
用户: !suggest
Bot: 提供服务器管理的智能建议
```

### 查看帮助信息
```
用户: !help
Bot: 显示所有可用命令和功能
```

---

## 监控和日志 | Monitoring & Logging

### 控制台输出
Bot会在控制台输出详细的运行日志，包括:
- 系统启动信息
- 模块初始化状态
- 事件处理记录
- 错误和警告信息

### 日志文件
- **位置**: `./logs/`
- **格式**: JSON
- **内容**: 所有审计事件
- **轮换**: 自动按日期分文件

### 备份文件
- **位置**: `./backups/`
- **格式**: JSON
- **内容**: 完整服务器配置
- **清理**: 自动删除7天前的备份

---

## 性能优化 | Performance Optimization

- 内存管理: 活动日志限制在1000条
- 日志缓冲: 批量写入减少I/O
- 定时任务: 使用setInterval进行周期性任务
- 事件过滤: 忽略机器人消息减少处理负载

---

## 安全特性 | Security Features

- 🔒 敏感内容检测
- 🔒 权限验证
- 🔒 审计日志记录
- 🔒 安全事件追踪
- 🔒 不提交敏感信息

---

## 故障排除 | Troubleshooting

### Bot无法启动
- 检查 BOT_TOKEN 是否正确配置
- 确认Node.js版本 >= 16.9.0
- 检查依赖是否完整安装

### 模块初始化失败
- 检查文件权限（logs/、backups/目录）
- 查看控制台错误信息
- 确认Bot具有必要的Discord权限

### 日志/备份未生成
- 确认目录写入权限
- 检查磁盘空间
- 查看错误日志

---

## 贡献指南 | Contributing

欢迎贡献代码和建议！请遵循以下步骤:

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

---

## 许可证 | License

请参考仓库中的 LICENSE 文件。

---

## 联系方式 | Contact

如有问题或建议，请通过 GitHub Issues 联系我们。

---

**BunnyEra HQ - 让Discord服务器管理更智能、更高效！** 🐰✨
