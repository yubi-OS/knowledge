# skills/docker-setup-qemu-action

Knowledge corpus explicating the yubiOS skill **docker-setup-qemu-action** (ground source: `yubi-OS/yubiOS skills/docker-setup-qemu-action/SKILL.md`, fetched 2026-10-06, 7383 B). Topic: registering QEMU emulators for cross-platform Docker builds in GitHub Actions, the linux/arm64 and other non-native architecture patterns, and the cross-platform-build discipline the skill teaches.

## Docs

1. [01-when-to-use-cross-platform.md](01-when-to-use-cross-platform.md) - when the skill applies: cross-platform builds such as linux/arm64 on amd64 runners, and the trigger condition tied to build-push-action platform targets.
2. [02-action-reference-and-inputs.md](02-action-reference-and-inputs.md) - the action reference: platforms input, 'all' vs explicit lists, user-mode (not full-system) emulation boundary, reset input, v4 version drift.
3. [03-standard-multi-platform-setup.md](03-standard-multi-platform-setup.md) - the standard 4-step workflow YAML: QEMU, Buildx, login, build and push, and each action's documented job.
4. [04-order-matters-step-ordering.md](04-order-matters-step-ordering.md) - why the step order matters: QEMU registration must precede builder creation and use; login position is flexible.
5. [05-performance-tradeoffs.md](05-performance-tradeoffs.md) - the cost side: 5-10x emulation slowdown heuristic, the 9-to-69-minute datapoint, platforms: all cost, native-runner guidance.
6. [06-alternatives-native-arm.md](06-alternatives-native-arm.md) - the non-QEMU path: matrix strategy with platform-specific runners, GitHub-hosted arm64 runners, ARM learning paths.
7. [07-yubios-application-and-coverage.md](07-yubios-application-and-coverage.md) - the yubiOS note (QEMU only for multi-arch bootc builds), least-privilege and declarative-policy coverage, RSI cycle closures. Internal-record subtopic, no dig.

## Research summary

- Results collected: 84 (72 from 12 initial searXNG queries, 12 from the 1 redo)
- Weight split: 28 results at weight >= 0.5, 56 below 0.5
- Jev requests: 7 (1 outline score + 5 weighting batches of 15 + 1 redo weighting batch of 12), usage 9207 input / 1631 output tokens, via DefAPI direct (typesafe/jev-1.13)
- Redos: 1 dig redo (subtopic 04: attempt-1 queries returned off-topic results)
- Skipped docs: none (7 of 7 outline subtopics authored; subtopic 7 was the internal-record subtopic requiring no dig)

Preflight 2026-10-06: searXNG healthy (orchestrator campaign preflight); DefAPI decisions endpoint (typesafe/jev-1.13) HTTP 200 on first live call.
