# MCP-Server — Setup and usage

## Requirements and setup

Install Bun and clone the repository.

```sh
git clone https://github.com/NamTheDev/MCP-Server.git
cd MCP-Server
bun install --frozen-lockfile
bun run start
```

The default HTTP host is `127.0.0.1` and port is `3737`. Check the health endpoint with:

```sh
curl http://127.0.0.1:3737/health
```

A successful health response is `ok`. Configure a compatible HTTP MCP client with the endpoint appropriate to the task.

| Endpoint | Tools |
| --- | --- |
| `/mcp` | All groups |
| `/mcp/reminder` | Reminder operations |
| `/mcp/knowledge` | Knowledge operations |
| `/mcp/discord` | Discord integration |
| `/mcp/agent` | Agent tools |

The server validates localhost Host and Origin headers. Changing the host variable alone does not establish remote access compatibility.

## Configuration

| Environment variable | Purpose |
| --- | --- |
| MCP_HOST, MCP_PORT | HTTP binding |
| KNOWLEDGE_DB_PATH | Override knowledge SQLite database path |
| REMINDER_DB_PATH | Override reminders SQLite database path |
| MCP_OPERATOR_ID | Local operator identifier |
| DISCORD_VERIFY_ENABLED | Enable Discord approval gateway when set to 1 |

Refer to the configuration and skill source for remaining Discord credential and approval settings. Keep credentials out of committed files.

## Tool usage

The built-in skill documents explain [reminders](https://github.com/NamTheDev/MCP-Server/blob/main/skills/reminder.md), [knowledge](https://github.com/NamTheDev/MCP-Server/blob/main/skills/knowledge.md) and [Discord](https://github.com/NamTheDev/MCP-Server/blob/main/skills/discord.md). Connect only the tool groups needed by the client, and review requests that modify external services.

## Source references

Reviewed against [MCP-Server source](https://github.com/NamTheDev/MCP-Server/tree/37e0aa27f587c3733e285fc65b9789c0cef2c004).

- [index.ts](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/index.ts)
- [config/server.ts](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/config/server.ts)
- [config/database.ts](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/config/database.ts)
- [config/auth.ts](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/config/auth.ts)
- [config/skills.ts](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/config/skills.ts)
