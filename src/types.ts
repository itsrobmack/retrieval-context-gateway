export type Classification = "public" | "internal" | "restricted";

export type Actor = {
  id: string;
  role: "guest" | "operator" | "admin";
  scopes: string[];
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  body: string;
  classification: Classification;
  requiredScopes: string[];
  updatedAt: string;
  tags: string[];
  conflictGroup?: string;
};

export type RetrievalRequest = {
  actor: Actor;
  query: string;
  maxResults?: number;
  now?: string;
};

export type Citation = {
  documentId: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  freshness: "fresh" | "stale";
  classification: Classification;
  score: number;
  conflictGroup?: string;
};

export type RetrievalResult = {
  status: "answered" | "needs_more_context" | "denied";
  answer: string;
  citations: Citation[];
  auditEvents: AuditEvent[];
  warnings: string[];
};

export type AuditEvent = {
  type: string;
  message: string;
  documentId?: string;
  reason?: string;
};
