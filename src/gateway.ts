import { documents } from "./data";
import type { AuditEvent, Citation, KnowledgeDocument, RetrievalRequest, RetrievalResult } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

function tokenize(input: string): string[] {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function canRead(request: RetrievalRequest, doc: KnowledgeDocument): boolean {
  if (doc.requiredScopes.length === 0) return true;
  return doc.requiredScopes.every((scope) => request.actor.scopes.includes(scope));
}

function score(queryTokens: string[], doc: KnowledgeDocument): number {
  const haystack = tokenize(`${doc.title} ${doc.body} ${doc.tags.join(" ")}`);
  return queryTokens.reduce((total, token) => total + haystack.filter((word) => word.includes(token)).length, 0);
}

function freshness(doc: KnowledgeDocument, now: string): "fresh" | "stale" {
  const age = new Date(now).getTime() - new Date(doc.updatedAt).getTime();
  return age > 90 * DAY_MS ? "stale" : "fresh";
}

function excerpt(doc: KnowledgeDocument, queryTokens: string[]): string {
  const sentences = doc.body.split(/(?<=\.)\s+/);
  return sentences.find((sentence) => queryTokens.some((token) => sentence.toLowerCase().includes(token))) ?? sentences[0] ?? doc.body;
}

export function retrieveContext(request: RetrievalRequest): RetrievalResult {
  const now = request.now ?? new Date().toISOString();
  const maxResults = request.maxResults ?? 3;
  const queryTokens = tokenize(request.query);
  const auditEvents: AuditEvent[] = [{ type: "retrieval.started", message: "Retrieval request accepted" }];

  const scored = documents
    .map((doc) => ({ doc, score: score(queryTokens, doc) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const readable: Citation[] = [];

  for (const item of scored) {
    if (!canRead(request, item.doc)) {
      auditEvents.push({
        type: "document.filtered",
        message: "Document filtered by scope policy",
        documentId: item.doc.id,
        reason: `missing scopes: ${item.doc.requiredScopes.filter((scope) => !request.actor.scopes.includes(scope)).join(", ")}`
      });
      continue;
    }

    readable.push({
      documentId: item.doc.id,
      title: item.doc.title,
      excerpt: excerpt(item.doc, queryTokens),
      updatedAt: item.doc.updatedAt,
      freshness: freshness(item.doc, now),
      classification: item.doc.classification,
      score: item.score
    });
  }

  const citations = readable.slice(0, maxResults);

  if (citations.length === 0) {
    auditEvents.push({ type: "retrieval.empty", message: "No readable context matched the request" });
    return {
      status: "needs_more_context",
      answer: "I do not have enough allowed context to answer this safely.",
      citations,
      auditEvents
    };
  }

  auditEvents.push({ type: "retrieval.completed", message: `Returned ${citations.length} citation(s)` });

  const staleNote = citations.some((citation) => citation.freshness === "stale")
    ? " Some context is stale and should be reviewed before action."
    : "";

  return {
    status: "answered",
    answer: `Based on allowed context, the strongest relevant point is: ${citations[0].excerpt}${staleNote}`,
    citations,
    auditEvents
  };
}
