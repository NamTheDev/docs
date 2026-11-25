# MCP-Server — Architecture and development

## Code organization

| Directory | Responsibility |
| --- | --- |
| `config/` | Runtime settings, limits, scope and approval policy |
| `database/` | SQLite-backed knowledge, reminders and authorization state |
| `tools/` | Tool registration and implementations |
| `skills/` | Agent-facing instructions |
| `utils/` | Context, authentication, approval, audit, scheduler and shared helpers |
| `scripts/` | Authorization administration CLI |

`index.ts` registers tool groups with the MCP SDK, mounts HTTP handlers and starts the reminder scheduler. The Discord gateway starts when enabled.

## Authorization and policy

The central Discord policy table associates tools with a required scope and risk classification. Scopes include read, write, manage, moderate and admin. The authentication CLI supports listing, adding and revoking authorized users; inspect `scripts/auth-cli.ts` before changing authorization state. Policy and database changes should be reviewed together.

## Verification

```sh
bun run typecheck
bun run build:check
bun run check
```

The combined check runs TypeScript checking and a Bun build check. Validate MCP discovery and tool behavior against a controlled test environment before using real Discord resources. Check scheduler behavior, permissions, approval expiry and database persistence when changing related modules.

## Source references

Reviewed against [MCP-Server source](https://github.com/NamTheDev/MCP-Server/tree/37e0aa27f587c3733e285fc65b9789c0cef2c004).

- [package.json](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/package.json)
- [index.ts](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/index.ts)
- [config/policy.ts](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/config/policy.ts)
- [scripts/auth-cli.ts](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/scripts/auth-cli.ts)
- [.github/workflows/code-verification.yml](https://github.com/NamTheDev/MCP-Server/blob/37e0aa27f587c3733e285fc65b9789c0cef2c004/.github/workflows/code-verification.yml)
