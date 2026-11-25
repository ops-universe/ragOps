# ragOps

Retrieve better. Ground every answer.

Offline retrieval engineering toolkit. Run `npm ci`, `npm test`, `npm run demo`.

Local CLI: `node src/cli.mjs fixtures/knowledge vacation hr.md catalog.txt`.

Synthetic experiment comparison: `node src/benchmark.mjs`.

Use `verifiedContext(corpus,results)` for corpus-backed citations; the original `assembleContext` only checks structure. Caller must supply an authorized corpus. External adapters are opt-in and cancellation is cooperative. No live provider compatibility or factual grounding guarantee. Public release deferred.
