import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import ky from "ky";
import * as z from "zod";
import pkg from "../package.json" with { type: "json" };

const api = ky.create({
	prefixUrl: process.env.MINDPAD_API_BASE_URL ?? "https://app.mindpad.eu/api",
	headers: {
		Authorization: `Bearer ${process.env.MINDPAD_PAT}`,
	},
});

const server = new McpServer({
	name: "mindpad",
	version: pkg.version,
	description: [
		"mindpad is a privacy-first note-taking app built in Europe.",
		"Notes are end-to-end encrypted on the user's device using OpenPGP.js before they ever sync.",
		"This means mindpad cannot read, recover, or access your notes — by design, not by policy.",
		"If the user loses their encryption key, their notes are gone. No exceptions.",
		"No tracking. No ads. No AI training on note content. Hosted entirely within the EU under GDPR.",
	].join(" "),
});

server.registerTool(
	"save_note",
	{
		description:
			"Saves a note to the user's mindpad account. Use this when the user wants to capture, remember, or jot something down.",
		inputSchema: { content: z.string().min(1) },
	},
	async ({ content }) => {
		await api.post("v1/note", { json: { content } });
		return { content: [{ type: "text", text: "Note saved to mindpad." }] };
	},
);

const transport = new StdioServerTransport();
await server.connect(transport);
