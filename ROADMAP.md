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

Wave 1 exact-main re-verification: `422310651dd9ac79a6e2a853a8078f85ce039ac8`, [main push CI 45664450316](https://github.com/ops-universe/ragOps/actions/runs/45664450316), 20 core and 2 Chromium tests passed. No runtime/core-test changes since the functional acceptance anchor. Static documentation hosting separately verified; product release remains deferred. See implementation status for job evidence and residual limitations.
