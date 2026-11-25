# Roadmap

- [x] 1 Foundation
- [x] 2 Document ingestion
- [x] 3 Retrieval engine
- [x] 4 Offline semantic/hybrid retrieval (deterministic hash baseline; no live provider verification)
- [x] 5 Context and citations (corpus-backed verification)
- [x] 6 Reproducible synthetic experiments and CLI
- [x] 7 Local dashboard (real Chromium acceptance)
- [x] 8 Synthetic enterprise scenarios (simulated role filtering)
- [ ] 9 Developer Preview and public release — explicitly deferred

Phases 1–8 engineering acceptance recorded at e377dc2f59142a58368dd8a540f14894bd154eae, [post-merge CI](https://github.com/ops-universe/ragOps/actions/runs/45524953576). 20 core tests and 2 Chromium tests passed; all three jobs successful and dependency audits reported zero vulnerabilities. Scope is offline/synthetic; see threat model and implementation status. This is not production or release certification.
