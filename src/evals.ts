import { retrieveContext } from "./gateway";

export function runEvals() {
  const operator = { id: "operator", role: "operator" as const, scopes: ["docs:read"] };
  const guest = { id: "guest", role: "guest" as const, scopes: [] };
  const admin = { id: "admin", role: "admin" as const, scopes: ["finance:read"] };

  const allowed = retrieveContext({ actor: operator, query: "retrieval citations restricted context", now: "2026-05-18T00:00:00.000Z" });
  const filtered = retrieveContext({ actor: guest, query: "retrieval policy restricted context", now: "2026-05-18T00:00:00.000Z" });
  const stale = retrieveContext({ actor: admin, query: "payment incident approval", now: "2026-05-18T00:00:00.000Z" });
  const empty = retrieveContext({ actor: guest, query: "xylophone nebula marmalade", now: "2026-05-18T00:00:00.000Z" });
  const capped = retrieveContext({ actor: admin, query: "ai platform retrieval approval policy incident", maxResults: 1, now: "2026-05-18T00:00:00.000Z" });
  const conflicting = retrieveContext({ actor: operator, query: "customer followup approval threshold", now: "2026-05-18T00:00:00.000Z" });

  const checks = [
    { name: "operator receives scoped citation", passed: allowed.citations.some((c) => c.documentId === "doc-internal-retrieval-policy") },
    { name: "guest cannot read scoped internal document", passed: filtered.auditEvents.some((e) => e.type === "document.filtered") },
    { name: "filtered restricted context is absent from answer", passed: !filtered.answer.toLowerCase().includes("unauthorized users") },
    { name: "stale context is labeled", passed: stale.citations.some((c) => c.freshness === "stale") },
    { name: "answers include citations", passed: allowed.citations.length > 0 },
    { name: "audit trail records completion", passed: allowed.auditEvents.some((e) => e.type === "retrieval.completed") },
    { name: "no context returns explicit fallback", passed: empty.status === "needs_more_context" && empty.auditEvents.some((e) => e.type === "retrieval.empty") },
    { name: "max results cap is respected", passed: capped.citations.length === 1 },
    { name: "conflicting allowed context is flagged", passed: conflicting.warnings.length > 0 && conflicting.auditEvents.some((e) => e.type === "context.conflict_detected") }
  ];

  return { passed: checks.every((check) => check.passed), checks };
}
