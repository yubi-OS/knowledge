# rootless-privilege knowledge corpus

Knowledge corpus minted from yubi-OS/yubiOS refs/adjacent-problems-rootless-privilege-2026-09-01.md (NSS 6/12 Adjacent problems axis). Topic: rootless builds and runtime privilege minimisation.

## Docs

- 01-rootless-docker-daemon.md: Rootless Docker daemon mode, user namespaces, the 2-helper setuid residue, and adoption limitations.
- 02-rootless-buildkit-buildx.md: Rootless BuildKit and buildx builders, standalone and daemon modes, prerequisites, and comparison with rootful.
- 03-podman-rootless-setuid.md: Podman's rootless, daemonless model and how newuidmap/newgidmap bound the privileged surface.
- 04-capabilities-ambient-sysadmin.md: The capabilities model, ambient sets, and CAP_SYS_ADMIN as root by another name.
- 05-daemon-socket-attack-surface.md: Why a rootful daemon socket is a root-equivalent handoff and the escalation paths that follow.
- 06-systemd-unit-hardening.md: ProtectSystem, NoNewPrivileges, CapabilityBoundingSet and the surrounding sandboxing directive family.
- 07-systemd-analyze-security-gate.md: Exposure scores as a hardening regression gate and the offline-mode CI gate pattern.
- 08-vm-per-step-isolation.md: MicroVM build isolation, the per-build versus per-step cost curve, and why the VM answers isolation, not privilege.
- 09-runtime-privilege-monitoring.md: Falco and Tetragon as the detection layer, plus moment-boundary privilege patterns.

## Research summary

- Results collected: 108 raw from 18 searXNG queries (2 per subtopic, top 6 kept per query), 88 unique after URL deduplication.
- Weight split: high 50, low 38, unweighted 0 (jev noul >= 0.4 counted high).
- jev requests: 1 outline validation + 18 weight batches + 23 retries (5s pacing) = 42 total API requests; every unique result received exactly 1 weight. Budget note: over the soft ~40-request budget because batches 14 to 18 returned empty answer maps and the shared rate limiter 429ed the first retry pass; all 12 remaining results were weighted after a 90s cooldown.
- Redos performed: 0.
- Skipped docs: none. All 9 validated subtopics were authorable from their digs at weight >= 0.4.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.
