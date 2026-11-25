# ragOps

Retrieve better. Ground every answer.

Offline RAG engineering toolkit. Run `npm ci`, `npm test`, `npm run demo`.

Local retrieval: `node src/cli.mjs fixtures/knowledge vacation hr.md catalog.txt`.

Experiments: `node src/benchmark.mjs`.

Local synthetic dashboard: `node src/serve-dashboard.mjs`, then open http://127.0.0.1:4178. Explore documents, chunks, rankings, verified context and synthetic benchmarks. Role switching demonstrates filtering, not authentication. No external provider calls by default. No factual grounding guarantee or verified live provider compatibility. Public release deferred.
