# util — Formatting and verification

## Root README

Use this sequence: project title, AI Disclaimer, Introduction, Resources, License. Keep detailed documentation in linked files. Include a truthful AI disclosure link and the applicable license/attribution.

## AI disclosure

Root `AI_DISCLAIMER.md` must begin with `# AI Usage Notice` and contain the three H2 headings in order:

- AI involvement
- Human oversight and responsibility
- Limitations and attribution

Each section must contain at least ten words and accurately reflect project-specific assistance and limitations.

## Commit format

```text
Docs: Clarify project usage

25-11-2026

- Explain the current workflow.
- Link the corresponding source.
```

Use a capitalized type and subject, a real DD-MM-YYYY date, and one or more detail bullets. Copy the canonical validators and commit format note rather than inventing a separate policy.

## Verification

Use the AI disclosure and commit-message workflows, and require their checks in repository rules where authorized. Successful checks are not merge gates by themselves. Validate browser layout, theme signaling, shared configuration equality and functionality for web applications. Report incomplete checks.

Canonical references: [README format](https://github.com/NamTheDev/util/blob/main/formatting/README_FORMAT.md), [AI disclosure](https://github.com/NamTheDev/util/blob/main/formatting/AI_DISCLOSURE.md), [commit format](https://github.com/NamTheDev/util/blob/main/formatting/COMMIT_FORMAT.md).

## Source references

Reviewed against [util source](https://github.com/NamTheDev/util/tree/7b79f69ab7158afd7f8f74be02164ff27d188e29).

- [formatting/README_FORMAT.md](https://github.com/NamTheDev/util/blob/7b79f69ab7158afd7f8f74be02164ff27d188e29/formatting/README_FORMAT.md)
- [formatting/AI_DISCLOSURE.md](https://github.com/NamTheDev/util/blob/7b79f69ab7158afd7f8f74be02164ff27d188e29/formatting/AI_DISCLOSURE.md)
- [formatting/COMMIT_FORMAT.md](https://github.com/NamTheDev/util/blob/7b79f69ab7158afd7f8f74be02164ff27d188e29/formatting/COMMIT_FORMAT.md)
- [commit_message_format.txt](https://github.com/NamTheDev/util/blob/7b79f69ab7158afd7f8f74be02164ff27d188e29/commit_message_format.txt)
