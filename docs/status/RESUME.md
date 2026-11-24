# Resume

Last verified main: c0e8f8f54924a900e9ae3d8158c0578ed925fe02
CI: https://github.com/ops-universe/ragOps/actions/runs/45461258768

Current phase 2: verify local ingestion PR; then harden retrieval contracts and implement semantic/hybrid. Reproduce: npm ci && npm test && npm run demo; node src/cli.mjs fixtures/knowledge vacation hr.md catalog.txt; cd website-react && npm ci && npm run build.
Known limitation: ingestion root must be trusted, not concurrently writable by an adversary; no persisted index or external provider.
