# Retrieval eval matrix

This repo evaluates context retrieval as a workflow contract.

The goal is not only to return similar text. The goal is to return allowed, fresh enough, citable context that an AI workflow can use safely.

## Current eval coverage

| Eval | What it proves | Why it matters |
|---|---|---|
| Scope filtering | Documents with missing scopes are filtered | Agents must not use context the actor cannot access |
| Allowed citation returned | Actor with the right scope receives relevant context | Useful retrieval needs permission aware access, not blanket denial |
| Stale context labeled | Old context is marked stale | Stale context may require review before action |
| Citation output present | Answers include document ids, excerpts, and freshness | Operators need traceability from answer to source |
| Audit trail recorded | Retrieval emits started, filtered, and completed events | Operators need to reconstruct what happened |
| Filtered answer safety | Restricted text does not leak into the generated answer | Scope filtering must protect both citations and answer text |
| No context fallback | Empty readable retrieval returns an explicit fallback | Agents should say when allowed context is insufficient |
| Result cap | `maxResults` limits returned citations | Retrieval behavior should stay predictable for downstream workflows |

## Failure cases this catches

1. Restricted context leaks into answers.
2. Retrieval gives an answer without citations.
3. Stale context is treated as fresh.
4. Filtered documents disappear without an audit reason.
5. Empty retrieval pretends to know the answer.
6. Restricted source text leaks through the final answer.
7. Retrieval ignores caller supplied result caps.

## Additional evals to add next

1. Reranking with conflicting sources.
2. Freshness thresholds by document type.
3. Metadata filtering by customer, team, or workspace.
4. Query rewriting with audit events.
5. Citation span offsets for exact source highlighting.
6. Eval fixtures for weak context and conflicting context.
7. Workspace specific access boundaries.

## Interview framing

For production retrieval, I would test more than semantic similarity. I would test whether the retrieval layer respects permissions, returns citations, labels stale context, handles no-context cases, and emits enough audit events for an operator to understand what happened.

Retrieval is part of the safety boundary. If an agent can retrieve data it should not see, or if it answers without traceable context, the workflow becomes difficult to trust.
