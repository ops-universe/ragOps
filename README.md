# ragOps

Retrieve better. Ground every answer.

Developer Preview in development. Offline BM25 retrieval, no vector database or LLM required.

Run `npm ci`, `npm test`, `npm run demo`.

Local CLI: `node src/cli.mjs fixtures/knowledge vacation hr.md catalog.txt`. Accepts explicit relative .txt/.md paths inside a trusted root. Outputs JSON ranked evidence, not generated answers. See threat model for filesystem trust boundary.
