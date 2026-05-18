import type { KnowledgeDocument } from "./types";

export const documents: KnowledgeDocument[] = [
  {
    id: "doc-public-ai-platform",
    title: "AI platform overview",
    body: "The AI platform should expose model routing, retrieval, evals, audit events, and human approval gates for risky workflows.",
    classification: "public",
    requiredScopes: [],
    updatedAt: "2026-05-10T12:00:00.000Z",
    tags: ["ai-platform", "evals", "approval"]
  },
  {
    id: "doc-internal-retrieval-policy",
    title: "Retrieval policy",
    body: "Retrieval must filter documents by actor scope, include citations, preserve source freshness, and avoid using restricted context for unauthorized users.",
    classification: "internal",
    requiredScopes: ["docs:read"],
    updatedAt: "2026-05-16T12:00:00.000Z",
    tags: ["retrieval", "policy", "citations"]
  },
  {
    id: "doc-restricted-payments",
    title: "Payments incident runbook",
    body: "Payment incident actions require admin role, finance scope, explicit approval, and full audit logging before any operational change.",
    classification: "restricted",
    requiredScopes: ["finance:read"],
    updatedAt: "2026-01-01T12:00:00.000Z",
    tags: ["payments", "incident", "approval"]
  }
];
