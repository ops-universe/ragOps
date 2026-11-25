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
