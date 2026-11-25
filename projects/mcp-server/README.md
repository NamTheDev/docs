# MCP-Server

A Bun/TypeScript HTTP implementation of the Model Context Protocol. It registers reminder, knowledge, Discord and agent tool groups for compatible MCP clients.

[Repository](https://github.com/NamTheDev/MCP-Server)

## Installation

Install Bun and Git.

```sh
git clone https://github.com/NamTheDev/MCP-Server.git
cd MCP-Server
bun install --frozen-lockfile
bun run start
```

Verify the HTTP server:

```sh
curl http://127.0.0.1:3737/health
# ok
```

Connect a compatible HTTP MCP client using the server URL. Client-specific configuration formats differ; the following URLs are the server's actual mounts.

| URL | Registered tools |
| --- | --- |
| http://127.0.0.1:3737/mcp | All groups |
| http://127.0.0.1:3737/mcp/reminder | Reminders |
| http://127.0.0.1:3737/mcp/knowledge | Knowledge store |
| http://127.0.0.1:3737/mcp/discord | Discord |
| http://127.0.0.1:3737/mcp/agent | Agent utilities |

The HTTP handler validates localhost Host and Origin headers. Binding a different address does not by itself configure remote access or authentication.

## Configuration

| Variable | Default or behavior |
| --- | --- |
| `MCP_HOST` | 127.0.0.1 |
| `MCP_PORT` | 3737 |
| `KNOWLEDGE_DB_PATH` | database/knowledge.db |
| `REMINDER_DB_PATH` | database/reminders.db |
| `MCP_OPERATOR_ID` | Empty local operator ID by default |
| `DISCORD_ALLOWLIST` | Comma-separated IDs; falls back to operator ID |
| `DISCORD_VERIFY_ENABLED` | Gateway enabled only with value 1 |
| `DISCORD_APPROVAL_TIMEOUT_MS` | 60000 |
| `DISCORD_BATCH_WINDOW_MS` | 15000; 0 disables batch approval |

See config/auth.ts and the Discord skill for additional credential and policy configuration. Keep secrets out of committed files. The authorization secret is described by the source as future multi-tenant functionality, not a complete remote authentication system.

## Usage

### Reminders

The reminder tool accepts relative or absolute time expressions. A Discord user ID is required for adding and updating reminders. Use a real ID supplied by the intended recipient, not a guessed username. The scheduler polls every 30 seconds, records successful delivery and retries failed sends up to three times.

Example tool calls (notation, not shell commands):

```text
add_reminder(text="Review draft", when="30 minutes", discord_user_id="<your Discord ID>")
list_reminders()
```

For a known reminder ID, update the text or date using update_reminder; provide the same Discord ID explicitly. Use list_reminders before choosing an ID. Past or invalid times are rejected. Bare date-only expressions default to 09:00 local. Discord delivery requires a configured bot and permission to DM the recipient.

### Knowledge store

The store uses slug-normalized entry names with descriptions, tagged entries and named Markdown sections. Search covers entry names, descriptions, titles and content. Reading without a section returns an index; reading a named section returns its Markdown.

Example tool calls:

```text
store_knowledge(name="mix-notes", description="Audio notes",
  sections=[{title:"overview", description:"Session notes", content:"Keep the vocal dry."}],
  tags=["audio"])
search_knowledge(query="mix")
read_knowledge(name="mix-notes", section="overview")
```

Use update_knowledge for metadata, add_section and update_section for content. Updating tags replaces the tag array. Removal tools delete entries or sections. The skill requires stored content to preserve the user's supplied words verbatim.

### Discord authorization

The Discord policy associates tools with required scopes and risk classifications. Supported scopes are read, write, manage, moderate and admin. The CLI edits the local authorization database:

```sh
bun scripts/auth-cli.ts list
bun scripts/auth-cli.ts add '<user_id>' read,write
bun scripts/auth-cli.ts revoke '<user_id>'
```

Replace the placeholder with an authorized test user's ID. The default scopes for add are read,write; grant only required permissions. Review the approval policy before using write or administrative tools.

## Architecture and development

| Path | Responsibility |
| --- | --- |
| `index.ts` | MCP server factories, HTTP mounts, scheduler and gateway startup |
| `config/` | Runtime settings, authorization and policy |
| `database/` | SQLite stores and authorization state |
| `tools/` | Tool registration and implementations |
| `skills/` | Agent-facing usage instructions |
| `utils/` | Context, scheduling, approval and shared helpers |
| `scripts/auth-cli.ts` | Authorization administration |

Each mount creates a server with only its registered tool groups. Request headers are passed through the request-context utility. Reminder scheduling starts with the server; the Discord approval gateway is conditional.

## Verification

```sh
bun run typecheck
bun run build:check
bun run check
```

The combined check runs TypeScript checking and a temporary Bun build. Use a controlled local instance to verify discovery, permissions, reminder delivery and persistence; a successful build does not prove Discord integration is configured.

## Source references

[server](https://github.com/NamTheDev/MCP-Server/blob/main/index.ts), [auth](https://github.com/NamTheDev/MCP-Server/blob/main/config/auth.ts), [reminder skill](https://github.com/NamTheDev/MCP-Server/blob/main/skills/reminder.md), [knowledge skill](https://github.com/NamTheDev/MCP-Server/blob/main/skills/knowledge.md), [Discord skill](https://github.com/NamTheDev/MCP-Server/blob/main/skills/discord.md).
