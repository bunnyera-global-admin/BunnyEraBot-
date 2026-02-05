# BunnyEraBot — Discord Bot Development

## Bot Invite URL
The bot is already created in Discord.  
Use this OAuth2 URL to install the bot into the server:

https://discord.com/oauth2/authorize?client_id=1468891460677140575&permissions=11280&integration_type=0&scope=bot

## Task for AI Developer
You (AI agent) are responsible for:

1. Building the Discord bot inside this repository.
2. Using the invite URL above to ensure the bot is installed in the target server.
3. Implementing all required bot features inside this repo.
4. Managing the bot codebase, structure, and deployment pipeline.
5. Writing all necessary files (index.js, package.json, config, docs, etc.).
6. Using the bot token (provided separately by the human operator) to run the bot.

## Requirements
- Node.js + discord.js v14
- Bot must be able to:
  - Read server channels
  - Modify channel topics
  - Send messages
  - Perform automated tasks

## Notes
- The human operator will provide the bot token manually.
- Do NOT commit the token into the repository.
- All configuration must support environment variables.
