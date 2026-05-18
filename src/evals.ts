import { retrieveContext } from "./gateway";

export function runEvals() {
  const operator = { id: "operator", role: "operator" as const, scopes: ["docs:read"] };
  const guest = { id: "guest", role: "guest" as const, scopes: [] };

  const allowed = retrieveContext({ actor: operator, query: "retrieval citations restricted context", now: "2026-05-18T00:00:00.000Z" });
  const filtered = retrieveContext({ actor: guest, query: "retrieval policy restricted context", now: "2026-05-18T00:00:00.000Z" });
  const stale = retrieveContext({ actor: { id: "admin", role: "admin", scopes: ["finance:read"] }, query: "payment incident approval", now: "2026-05-18T00:00:00.000Z" });

  const checks = [
    { name: "operator receives scoped citation", passed: allowed.citations.some((c) => c.documentId === "doc-internal-retrieval-policy") },
    { name: "guest cannot read scoped internal document", passed: filtered.auditEvents.some((e) => e.type === "document.filtered") },
    { name: "stale context is labeled", passed: stale.citations.some((c) => c.freshness === "stale") },
    { name: "answers include citations", passed: allowed.citations.length > 0 },
    { name: "audit trail records completion", passed: allowed.auditEvents.some((e) => e.type === "retrieval.completed") }
  ];

  return { passed: checks.every((check) => check.passed), checks };
}
