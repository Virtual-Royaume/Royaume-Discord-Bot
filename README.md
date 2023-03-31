# Royaume Discord Bot
It is the bot of our Discord community, it offers various utility features. It is written in TypeScript and uses the DiscordJS package to interact with the Discord API. 

## Setup
### Node & NPM
You must have NodeJS and NPM installed on your PC with this versions :
| NodeJS | NPM |
| ------ | --- |
| 18.X   | 8.X |

### Environment variables
You must set this environment variables in your .env file :
```
# Discord bot token :
BOT_TOKEN="your token"

# GitHub token :
GITHUB_TOKEN="your GitHub PAT (personal access token)"

# Royaume API :
API_LINK=https://dev-api.royaume.world
API_TOKEN="get the API token in our Discord"
```

### Recommended VSCode extensions
- [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql-syntax)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Usage
### File strucure for auto-loading
```
📂src/
├── 📂commands/
│   └── 📂command-name/
│       ├── 📄command-name.builder.ts
│       ├── 📄command-name.cmd.ts
│       ├── 📄command-name.util.ts
│       ├── 📄command-name.type.ts
│       └── 📂[sub-commands]/
│           ├── 📂group-exemple/
│           │   └── 📄sub-cmd-name.cmd.ts
│           └── 📄sub-cmd-name.cmd.ts
```
<details>
  <summary>Commands</summary>

⚠ All commands files, sub-commands files, groups folders and sub-command-group files should have the same name as defined in your `command-name.builder.ts`

---
#### `command-name.builder.ts`
Builder of our command
| export         | type                     | required                     | description                                               |
| :------------- | :----------------------- | :--------------------------- | :-------------------------------------------------------- |
| `slashCommand` | `SlashCommandDefinition` | `true`                       | SlashCommandBuilder of our command                        |
| `guilds`       | `GuildsCommand`          | `false`                      | If this is defined, command will only be on these servers |
| `enableInDev`  | `EnableInDev`            | `false` *(default: `false`)* | If bot is launch in dev-mode, command will not be loaded  |

---
#### `command-name.cmd.ts`
Execution of our command
| export    | type             | required | description                                 |
| :-------- | :--------------- | :------- | :------------------------------------------ |
| `execute` | `CommandExecute` | `true`   | Will be executed when the command is called |

\--------------------------------------------------------------------------------------------------
<details>
  <summary>SubCommands</summary>

`SubCommands` are located in `[sub-commands]/` folder of our command

#### `group-exemple/sub-cmd-name.cmd.ts`
Execution of our sub-command group
| export    | type             | required | description                                           |
| :-------- | :--------------- | :------- | :---------------------------------------------------- |
| `execute` | `CommandExecute` | `true`   | Will be executed when the sub command group is called |

#### `sub-cmd-name.cmd.ts`
Execution of our sub-command
| export    | type             | required | description                                     |
| :-------- | :--------------- | :------- | :---------------------------------------------- |
| `execute` | `CommandExecute` | `true`   | Will be executed when the sub command is called |
</details>

\--------------------------------------------------------------------------------------------------
#### `command-name.util.ts`
All utilities functions our command need

---
#### `command-name.type.ts`
All types our command need

---
</details>

```
├── 📂events/
│   └── 📂event-name/
│       ├── 📄event-name.event.ts
│       ├── 📄event-name.util.ts
│       └── 📄event-name.type.ts
```
<details>
  <summary>Events</summary>

#### `event-name.event.ts`
Builder of our event
| export        | type           | required                     | description                                            |
| :------------ | :------------- | :--------------------------- | :----------------------------------------------------- |
| `event`       | `EventName`    | `true`                       | Name of our targeted event                             |
| `execute`     | `EventExecute` | `true`                       | Will be executed when our event will be called         |
| `enableInDev` | `EnableInDev`  | `false` *(default: `false`)* | If bot is launch in dev-mode, event will not be loaded |

---
#### `event-name.util.ts`
All utilities functions our event need

---
#### `event-name.type.ts`
All types our event need

---
</details>

```
└── 📂tasks/
    └── 📂task-name/
        ├── 📄task-name.task.ts
        ├── 📄task-name.util.ts
        └── 📄task-name.type.ts
```
<details>
  <summary>Tasks</summary>

#### `task-name.task.ts`
Builder of our event
| export        | type           | required                     | description                                                                                  |
| :------------ | :------------- | :--------------------------- | :------------------------------------------------------------------------------------------- |
| `interval`    | `TaskInterval` | `true`                       | Interval of our task *(write in cron syntaxe: "* * * * * *" => "sec min hour d month week")* |
| `execute`     | `TaskExecute`  | `true`                       | Will be executed when our task will be on his interval                                       |
| `enableInDev` | `EnableInDev`  | `false` *(default: `false`)* | If bot is launch in dev-mode, task will not be loaded                                        |

---
#### `task-name.util.ts`
All utilities functions our task need

---
#### `task-name.type.ts`
All types our task need

---
</details>