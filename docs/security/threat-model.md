# Threat model

Retrieved text is untrusted data, never executable instructions. Local ingestion rejects traversal, absolute paths, symlinks, nonregular files, invalid UTF-8, NUL and files over 1 MB. Reads are bounded even if the file grows. Root and ancestors must be trusted and not concurrently mutable by an adversary; path checks are not a sandbox against filesystem races. No external provider or generation. Retrieval does not guarantee truth.
