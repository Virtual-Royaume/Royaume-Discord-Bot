# Royaume Discord Bot

## Invite link (only work for Royaume server)
- [INVITE LINK](https://discord.com/api/oauth2/authorize?client_id=831542935014867014&permissions=0&scope=applications.commands%20bot)  
- [INVITE LINK (DEV BOT)](https://discord.com/api/oauth2/authorize?client_id=985837649048784917&permissions=0&scope=bot%20applications.commands)

## How to start 
### Node & NPM
You must have NodeJS and NPM installed on your PC with this versions :
| NodeJS  | NPM   |
| ------- | ----- |
| 16.X    | 8.X   |

### Environment variables
You must set this environment variables in your .env file :
```
# Discord bot token
BOT_TOKEN=discordBotToken

# GitHub token
GITHUB_TOKEN=optionalGitHubPersonalToken

# Royaume API
API_LINK=https://api.royaume.world
API_TOKEN=royaumeAPIToken
```

## Deploy
If you want to deploy the bot, it is recommended to use Docker for that.

Then, you can run :
- `docker compose up --build -d` : for build the project with Docker
- `docker compose logs -f royaume-bot` : see the logs in real time