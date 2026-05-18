import { expect, test } from "bun:test";
import { retrieveContext } from "../src/gateway";
import { runEvals } from "../src/evals";

test("retrieval filters documents by actor scope", () => {
  const result = retrieveContext({
    actor: { id: "guest", role: "guest", scopes: [] },
    query: "retrieval policy restricted context",
    now: "2026-05-18T00:00:00.000Z"
  });

  expect(result.citations.some((citation) => citation.documentId === "doc-internal-retrieval-policy")).toBe(false);
  expect(result.auditEvents.some((event) => event.type === "document.filtered")).toBe(true);
});

test("retrieval returns citations for allowed context", () => {
  const result = retrieveContext({
    actor: { id: "operator", role: "operator", scopes: ["docs:read"] },
    query: "retrieval citations restricted context",
    now: "2026-05-18T00:00:00.000Z"
  });

  expect(result.status).toBe("answered");
  expect(result.citations.some((citation) => citation.documentId === "doc-internal-retrieval-policy")).toBe(true);
});

test("retrieval labels stale context", () => {
  const result = retrieveContext({
    actor: { id: "admin", role: "admin", scopes: ["finance:read"] },
    query: "payment incident approval",
    now: "2026-05-18T00:00:00.000Z"
  });

  expect(result.citations.some((citation) => citation.freshness === "stale")).toBe(true);
});

test("eval suite passes", () => {
  expect(runEvals().passed).toBe(true);
});
