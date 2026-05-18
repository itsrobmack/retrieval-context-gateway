import { retrieveContext } from "./gateway";

const result = retrieveContext({
  actor: { id: "rob", role: "operator", scopes: ["docs:read"] },
  query: "How should retrieval handle citations and restricted context?",
  now: "2026-05-18T00:00:00.000Z"
});

console.log(JSON.stringify(result, null, 2));
