# mindpad mcp

Save notes to your [mindpad](https://www.mindpad.eu?utm_source=github) account directly from AI assistants.

[mindpad](https://www.mindpad.eu?utm_source=github) is a privacy-first, European note-taking app where notes are end-to-end encrypted on your device before they ever leave it — meaning even [mindpad](https://www.mindpad.eu?utm_source=github) can't read them. No tracking, no ads, no AI training on your content. Fully GDPR-compliant and hosted within the EU.

## Setup

**1. Generate a Personal Access Token**

Go to your [mindpad](https://www.mindpad.eu?utm_source=github) account settings and generate a Personal Access Token.

**2. Add to your AI assistant**

Add the following to your MCP client config (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "mindpad": {
      "command": "npx",
      "args": ["-y", "@mindpad/mcp"],
      "env": {
        "MINDPAD_PAT": "your-pat-here"
      }
    }
  }
}
```

**3. Restart your AI assistant**

That's it. You can now ask your assistant to save notes to your [mindpad](https://www.mindpad.eu?utm_source=github) account.

## Usage

Just talk to your assistant naturally:

- *"Save a note about today's meeting"*
- *"Jot this down for me: pick up groceries !errand"*
- *"Remember that the API key expires on Friday !work"*

Tags can be added inline using `!tagname`.

## Privacy

Your notes are end-to-end encrypted on your device before they sync. [mindpad](https://www.mindpad.eu?utm_source=github) cannot read them — by design, not by policy. If you lose your encryption key, your notes are gone. No exceptions.

Built in Europe. Hosted in Europe. Protected by GDPR.

## License

MIT
