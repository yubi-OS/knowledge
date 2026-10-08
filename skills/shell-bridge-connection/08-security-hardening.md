# 08 - Token hygiene and hardening risks

Scope: the standing security risks recorded around the bridges: permissive token files, history leakage, root execution, and the discipline that keeps the single shared token contained.

## The threat model in one paragraph

Both bridges live on the public internet behind Tailscale Funnel (doc 03), guarded by one static Bearer token (source doc). That token is a single point of compromise: whoever reads it can execute arbitrary commands as root on the boxes. The source doc records two concrete exposures and the working discipline that limits them.

## Exposure 1: the shared-token copy at 0644

`/home/ubuntu/bear` is a shared-token copy that was world-readable 0644 as of 2026-09-24, with the hardening card targeting 0600 (source doc). The general Linux permission model makes 0600 the standard for secret files: owner read-write, no group or other access (https://linuxize.com/post/chmod-command-in-linux/, weight 0.07, weak backing; https://sshflow.com/blog/chmod-600/, weight 0.07, weak backing). Both external sources are weak; the source doc's recorded state and target are the authoritative claims here.

Until the file is tightened, any local user on ubuntu can read a root-capable credential. The fix is one command plus verification:

```
chmod 600 /home/ubuntu/bear
stat -c '%a' /home/ubuntu/bear   # expect 600
```

## Exposure 2: token leakage into .bash_history

Sidecar token files in the Actions runner tree, such as `snn`, get removed by tooling but can leak into `.bash_history` (source doc). The leak path is mechanical: a shell command that references the token file stays in history after the file is gone, and the history line itself becomes the record of where a credential lived.

External context on the risk class: a writeup of a leaked secret that forced a four-year git history rewrite (https://alexsinyaev.com/accidentally-pushed-secrets-to-git/, weight 0.12, weak backing) and a bash-history security guide on why secrets in history persist (https://blog.servarat.net/bash-history-security-5-ways-to-keep-passwords-and-api-keys-out-, weight 0.16, weak backing). Both are weak sources; the source doc's recorded observation is the claim that matters.

Practical containment, consistent with the source doc: never cat a token file interactively; extract tokens into shell variables inside non-interactive calls; and grep the runner host's `.bash_history` for token-file names when auditing.

## Discipline: never print the token

The direct-token test (doc 04) works because the token is handled as `$TOKEN`, extracted from the env file and never echoed (source doc). This discipline is what allows the test to exist without widening the leak surface. Any diagnostic that prints `$TOKEN`, even truncated, is a bug.

## Context: root execution by design

The bridge runs as root on both boxes, so `~` is `/root` on ubuntu (source doc). This is deliberate: the rollout script is "run as root on EACH tailnet device" (source doc), and CI-adjacent work needs root. The consequence is that the token's effective power is root on the box, which is why the two exposures above are graded as serious rather than moderate, and why the public Funnel hostname (doc 03) makes the token the only gate.

## Hardening checklist

1. Tighten `/home/ubuntu/bear` to 0600 (source doc target; one command, verify with stat).
2. Sweep `.bash_history` on ubuntu for `bear`, `snn`, and `ROCK1_SHELL_TOKEN` references (source doc leak path).
3. Keep the never-print-token discipline in every diagnostic (source doc).
4. Rotate the token only via the full rotation path: env file plus connection row, on both boxes (doc 06); partial rotation recreates the 401 saga (doc 04).
5. Re-verify with a direct-token test using `X-Sauna-Connection-Id: none` after any rotation (source doc).
6. Re-check both exposures after runner reinstalls and bootstrap re-runs, since both are the events that rewrite the relevant files.
