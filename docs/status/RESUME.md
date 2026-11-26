# Resume

Last verified functional main: e377dc2f59142a58368dd8a540f14894bd154eae
Post-merge evidence: https://github.com/ops-universe/ragOps/actions/runs/45524953576
PR #7 merged. Phases 1–8 implementation and documented offline acceptance passed; 20 core tests and 2 real Chromium tests. Public release deferred by owner.

## Reproduce
```sh
npm ci
npm audit --audit-level=high
npm test
npm run demo
node src/benchmark.mjs
node src/cli.mjs fixtures/knowledge vacation hr.md catalog.txt
(cd browser-runner && npm ci && npm audit --audit-level=high && npx --no-install playwright install --with-deps chromium && npx --no-install playwright test)
(cd website-react && npm ci && npm audit --audit-level=high && npm run build && VITE_BASE_PATH=/ragOps/ npm run build)
```

Local dashboard: node src/serve-dashboard.mjs; open http://127.0.0.1:4178.

## Next
Verify and merge final documentation reconciliation PR under normal exact-head checks/reviews/protections. Recheck current main and CI on resumption; evidence above is anchored to functional commit, not a future documentation commit. No further documented offline feature phase pending. Do not start public release unless explicitly authorized. Preserve trusted-root, synthetic-role, cooperative adapter and citation limitations; no production authentication or live provider claims.

## Wave 1 re-verification — 2026-11-26

Audited main 422310651dd9ac79a6e2a853a8078f85ce039ac8. The documented implementation checkpoint is an ancestor; intervening changes are documentation and static website infrastructure, not product runtime or core tests. Actual push-triggered [Core CI 45664450316](https://github.com/ops-universe/ragOps/actions/runs/45664450316) passed 20/20 core tests, zero failures/skips. 2 Chromium scenarios; role-switch delayed-response clearance, authorized citation spans, bounded ingestion, adapter timeout and loopback/host/token denial passed. Root and website builds and configured dependency audits passed; inspected audit logs reported zero vulnerabilities. [Pages 45664451173](https://github.com/ops-universe/ragOps/actions/runs/45664451173) passed build, deployment and three public documentation-route checks. Static documentation hosting is distinct from deployment of the local product runtime. All previously documented scope and security limitations remain in force. The historical implementation SHA remains the acceptance anchor. No product release or Developer Preview authorized; no new functional implementation assigned. Revalidate later commits through normal gates.
