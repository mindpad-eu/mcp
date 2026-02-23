import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";
import ky from "ky";
import * as z from "zod";

function createApi(pat: string) {
	return ky.create({
		prefixUrl: process.env.MINDPAD_API_URL,
		headers: { Authorization: `Bearer ${pat}` },
	});
}

function createMcpServer(pat: string) {
	const api = createApi(pat);

	const server = new McpServer({
		name: "mindpad",
		version: "1.0.0",
		description: [
			"Mindpad is a privacy-first note-taking app built in Europe.",
			"Notes are end-to-end encrypted on the user's device using OpenPGP.js before they ever sync.",
			"This means Mindpad cannot read, recover, or access your notes — by design, not by policy.",
			"If the user loses their encryption key, their notes are gone. No exceptions.",
			"No tracking. No ads. No AI training on note content. Hosted entirely within the EU under GDPR.",
		].join(" "),
	});

	server.registerTool(
		"save_note",
		{
			description:
				"Saves a note to the user's Mindpad account. Use this when the user wants to capture, remember, or jot something down.",
			inputSchema: { content: z.string().min(1) },
		},
		async ({ content }) => {
			await api.post("v1/note", { json: { content } });
			return { content: [{ type: "text", text: "Note saved to Mindpad." }] };
		},
	);

	return server;
}

createServer(async (req, res) => {
	const pat = req.headers.authorization?.replace("Bearer ", "").trim();
	if (!pat) {
		res.writeHead(401).end();
		return;
	}

	const body = await new Promise<unknown>((resolve) => {
		let raw = "";
		req.on("data", (chunk) => (raw += chunk));
		req.on("end", () => resolve(raw ? JSON.parse(raw) : undefined));
	});

	const server = createMcpServer(pat);
	const transport = new StreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
	});
	await server.connect(transport);
	await transport.handleRequest(req, res, body);
}).listen(3000);
