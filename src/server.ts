import { retrieveContext } from "./gateway";
import type { RetrievalRequest } from "./types";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data, null, 2), { status, headers: { "content-type": "application/json" } });

Bun.serve({
  port: Number(process.env.PORT ?? 8792),
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/health") return json({ ok: true, service: "retrieval-context-gateway" });
    if (url.pathname === "/documents") return json({ documents: ["public and policy filtered at query time"] });
    if (url.pathname === "/retrieve" && req.method === "POST") {
      const body = await req.json() as RetrievalRequest;
      return json(retrieveContext(body));
    }
    if (url.pathname === "/evals") {
      const { runEvals } = await import("./evals");
      return json(runEvals());
    }
    return json({ error: "not found" }, 404);
  }
});

console.log("retrieval-context-gateway listening on :8792");
