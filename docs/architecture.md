# Architecture

## Purpose

`retrieval-context-gateway` is a small proof repo for permission aware retrieval and context assembly.

It models the layer between an AI workflow and company knowledge sources.

## Flow

1. Actor submits a query with role and scopes.
2. Gateway scores candidate documents.
3. Gateway filters documents by required scopes.
4. Gateway labels context freshness.
5. Gateway returns citations, answer summary, and audit events.

## Runtime primitives

1. actor identity
2. scopes
3. document classification
4. required document scopes
5. freshness labels
6. citations
7. audit events
8. no-context fallback

## Production extensions

1. vector database or hybrid search
2. workspace and tenant isolation
3. document level ACL sync
4. source span citations
5. reranking
6. prompt context budgets
7. PII and secret filters
8. eval dashboards
9. OpenTelemetry traces
10. approval gates for stale or restricted context
