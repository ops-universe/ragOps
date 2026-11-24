# ADR 001: Offline-first lexical retrieval

Use BM25 with no dependencies for the initial vertical slice. Semantic adapters are optional; no external network by default. Trade-off: lexical ranking misses synonyms and meaning.
