# 06. C/A residual-cell closure by instrumenting verifiers

Scope: the 2 continuous/adaptive residual cells the skill exists to close, why they were residual, and the instrumentation pattern that closes them. This is an internal-record subtopic, no dig.

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md). All claims are attributed to the source doc.

## Where the residual came from

The source doc places the skill's origin in the corpus-enrichment work after cycle 8 of the curve-guided-rsi loop: it was created "per deep-research Stream 1 §4.3 (corpus enrichment for the 2-cell continuous/adaptive residual post-cycle-8, accepting the structural-gap residual for `composefs-kernel-floors` and `yubikey-operations` per §3.4 recommendation)" (source doc). The numbers behind that: post-cycle-8 coverage was "continuous/adaptive = 68/70" (source doc), meaning 2 of 70 coverage cells had no continuous/adaptive contribution.

The reason those 2 cells were residual is structural, not accidental: "The 2 C/A residual cells are structural-gap skills (`composefs-kernel-floors`, `yubikey-operations`) that are by design one-shot operations" (source doc). A kernel-floor verification runs when a kernel mounts; a YubiKey ceremony runs when a key is enrolled or used. Neither operation is itself continuous, so neither skill could contribute a continuous/adaptive coverage cell on its own.

## The closure pattern

The source doc states the canonical solution: "the canonical yubiOS solution is to instrument their verifiers with Falco/Tetragon rules" (source doc). The instrumented closure is stated per cell (source doc):

- `composefs-kernel-floors`: "closed via Falco rule on below-floor kernel mount". The Falco rule watches mount events and alerts when a mount happens on a kernel below the version floor that skill pins.
- `yubikey-operations`: "closed via Falco rule on unexpected FIDO2 enrollment". The Falco rule watches enrollment events and alerts when a FIDO2 ceremony happens where none is expected.

The pattern generalizes: a one-shot verifier becomes continuously covered by attaching a detection rule to the event its verification depends on. The verifier stays one-shot by design; the Falco rule provides the continuous observation over the same operation.

## Why Falco rules carry the closure

The source doc assigns both closures to Falco rules specifically (source doc), and its skill description names Falco as the syscall detection layer of the four-framework stack (source doc, doc 02). A below-floor kernel mount and an unexpected FIDO2 ceremony are both syscall-adjacent events, which is the event class Falco's rule engine covers.

## What "well-served" means

The source doc states the skill's purpose for both cells: "This skill is the corpus-additive anchor that ensures both are well-served, and provides the canonical instrumentation for any future yubiOS workload that requires continuous runtime detection" (source doc). Two commitments follow:

1. The 2 named cells are covered by the 2 named Falco rules, so the C/A primitive is "well-served" for them.
2. The pattern (instrument a one-shot verifier's event with a Falco/Tetragon rule) is the canonical recipe for any future yubiOS workload with the same structural shape.

## Where the residual is tracked

The source doc ties the accounting to a specific artifact: "gaps in C/A that are attributable to this skill are tracked in the cycle-9 run log at `refs/curve-guided-rsi-v2-cycle9-corpus-enrichment-2026-08-06.md` on `yubi-OS/yubiOS`" (source doc). Any future claim that a C/A gap belongs to this skill should be checked against that run log, not invented here.

This doc is deliberately free of external mechanism detail: the residual cells, their closure, and the tracking path are all internal record, and the source doc is the only source this corpus has for them. The Falco rule mechanics behind the closure are covered in doc 02.
