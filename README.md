# Retrieval Context Gateway

A small TypeScript and Bun proof repo for permission aware retrieval, citations, freshness labels, and audit events.

This is not a generic RAG demo. It models the context gateway an AI workflow needs before it can safely use company knowledge.

## Why this exists

Production AI systems need retrieval that respects:

1. actor permissions
2. document scopes
3. restricted context
4. citations
5. stale context
6. no-context fallback
7. auditability
8. operator trust

The model should not receive every document by default. The retrieval layer should decide what context is allowed, useful, fresh enough, and traceable.

## Run it

```bash
bun install
bun test
bun run demo
bun start
```

Then:

```bash
curl http://localhost:8792/health
curl http://localhost:8792/evals
curl -X POST http://localhost:8792/retrieve \
  -H 'content-type: application/json' \
  --data @examples/retrieval-request.json
```

## Eval coverage

The eval suite validates permission aware retrieval behavior: scope filtering, allowed citations, stale context labels, citation output, and audit events.

See [`docs/evals.md`](docs/evals.md).

Run it:

```bash
bun run test:evals
```

## Architecture

See [`docs/architecture.md`](docs/architecture.md).

## Positioning

Built by Rob McElvenny as public proof for AI systems infrastructure: retrieval gateways, context assembly, permission filtering, citations, evals, and production minded agent workflows.
