# shell-bridge-connection

Knowledge corpus explicating the yubiOS skill **shell-bridge-connection** ("How to work with the user's shell-bridge connections (rock1 + ubuntu boxes) effectively"), minted from yubi-OS/yubiOS skills/shell-bridge-connection/SKILL.md on 2026-10-06.

Ground source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/shell-bridge-connection/SKILL.md (3992 bytes). The SKILL.md is the primary source of record; every doc below cites it for its grounding spine plus searXNG-dig sources for external mechanisms.

## Contents

| NN | slug | one-line scope |
|---|---|---|
| 01 | run-contract | The POST /run call shape: connections-param Bearer injection, argv-array command with bash -lc, subprocess.run verbatim semantics, 3-key response, GET 501, head/tail outputs |
| 02 | the-boxes | Box profiles: ubuntu (X1E80100, primary ARM64 runner agentId 22, KVM/imaging) and rock1 (original SBC, UART/audio, restored 2026-09-24, runner agentId 23); internal-record |
| 03 | funnel-bearer-pattern | Tailscale Funnel exposure plus the ~50 LOC stdlib Python bearer-auth bridge (debug-with-cli pattern) and Sauna proxy credential injection |
| 04 | auth-diagnostics | Status-code decision table: 401 http.server page (token mismatch), 502 (bridge dead), 501 (liveness), direct-token test, resolved 2026-09-24 rock1 zombie saga |
| 06 | token-config-locations | /etc/rock1-shell.env on both boxes, /home/ubuntu/bear, bootstrap script, Actions runner tree, systemd unit names; internal-record |
| 07 | operational-lessons | Uptime is not tailnet age, ping before long pushes, runner-host sweep lines; internal-record |
| 08 | security-hardening | /home/ubuntu/bear 0644 to 0600, token leaks into .bash_history, never-print-token discipline, root-execution context |

## Research summary

- Results collected: 48 (8 queries across 4 web-shaped subtopics, top 6 kept per query)
- Weight split: 6 high (>= 0.5) / 42 low (< 0.5) of 48
- Jev requests: 5, usage tokens in 6800 / out 1004 (outline validation 1 x score 8Q; noul weighting 4 x 12Q)
- Endpoints: outline validation and all weighting via DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13); worker relay not needed
- Redo counts: 0
- Skipped docs: none; outline subtopic 05 (zombie-401-saga) was dropped by the outline validation metric (score 0.19, drop-0 rule) and its content retained inside 04-auth-diagnostics
- Internal-record subtopics (no dig, per the skills-variant speed optimization): 02, 06, 07

Preflight 2026-10-06: searXNG 85 results healthy; /api/decide (clef) 200 (campaign preflight run orchestrator-side; agent-side probe skipped for speed). Digs this mint: 8 queries, 271 raw results, 48 kept.

## Gaps

None. Every kept subtopic was authored. Low-weight results are labeled as weak backing in the docs where they are cited.
