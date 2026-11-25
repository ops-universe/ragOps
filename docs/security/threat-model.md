# Threat model

Retrieved text is untrusted data, never executable instructions. Local ingestion rejects traversal, absolute paths, symlinks, nonregular files, invalid UTF-8, NUL and files over 1 MB. Reads are bounded even if the file grows. Root and ancestors must be trusted and not concurrently mutable by an adversary; path checks are not a sandbox against filesystem races. Index persistence also requires trusted paths. Integrity hashes are not authentication.

The local dashboard binds to 127.0.0.1, checks Host and Origin, requires a per-server request token for protected API routes, rejects non-GET methods, and uses CSP and no-store headers. It serves a fixed synthetic corpus. Role selection is a simulation; anyone with local access can select administrator. The token is not authentication. Filtering occurs before retrieval, and verified citations are checked against the permitted corpus. Role changes clear prior evidence and reject late responses. These controls do not establish tenant isolation or real enterprise ACLs.

External adapters require explicit authorization. No external provider implementation is bundled; timeout and cancellation are cooperative, not isolation of arbitrary adapter code. Offline hash embeddings are not learned semantic embeddings. No live provider compatibility or factual grounding guarantee.

Regression evidence: [main CI 45524953576](https://github.com/ops-universe/ragOps/actions/runs/45524953576) at e377dc2f59142a58368dd8a540f14894bd154eae; 20 core tests, two Chromium tests and all dependency audits passed. Zero vulnerabilities reported by those audits is not proof of absence of all security defects. Public release deferred.
