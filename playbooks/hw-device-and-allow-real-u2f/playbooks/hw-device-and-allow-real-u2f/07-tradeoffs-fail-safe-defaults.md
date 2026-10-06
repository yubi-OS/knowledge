# 07 - Tradeoffs: fail-safe defaults, silent-green risk, and the missing fail-fast

Scope: what the two-flag design buys, what it costs, and the gap the playbook itself names.

The source doc's tradeoffs section records 3 judgments (source doc: yubi-OS/yubiOS `playbooks/hw-device-and-allow-real-u2f.md`, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/hw-device-and-allow-real-u2f.md):

1. Default `allow_real_u2f: false` is fail-safe. A hosted amd64 dispatch still detects a key someone plugs in. The cost is 1 re-dispatch when deliberately running on rock1 with a real key.
2. Requiring `hw_device` explicitly means an unattended dispatch can report green while never touching real hardware. The operator must read the job's skip lines before claiming hardware coverage.
3. Still missing: the dispatch step does not itself run `lsusb` and fail fast when a key is present and the flag is unset. Today that check is the operator's job (the manual pre-flight in 05).

External framing, weak backing only. The Command Line Interface Guidelines argue that tools should make dangerous behavior explicit and require deliberate confirmation rather than clever defaults (https://clig.dev/, jev weight 0.26, weak). An essay on skipped tests argues that a skipped test must not be read as a passing result, because the green line silently over-reports coverage (https://baodev.studio/blog/skipped-tests-are-not-tested/, jev weight 0.14, weak). Both sources back the playbook's framing at weak weight only; the operative rules in this corpus are the source doc's, and these citations are context, not authority.

The design logic behind each tradeoff:

- The `false` default is the safe side of the choice. If the default were `true`, a hosted runner with an accidentally attached YubiKey would silently switch the passless tests onto real hardware (the 03 race), and no dispatch-time signal would exist. With `false`, the failure is a guard refusal and a re-dispatch, which is cheap and visible. The source doc prices this at 1 extra dispatch per deliberate rock1 run.
- The `hw_device` explicitness rule trades convenience for honesty of results. An unattended dispatch is the common case (self-mode), and the empty-device default means the hardware install leg is skipped rather than guessed at. The cost is that a green run can be hardware-free; the playbook's remedy is procedural: read the skip lines before claiming coverage.
- The missing fail-fast is an acknowledged gap, not an oversight the playbook hides. The guard catches the wrong-device case at test time, and the 422 catches undeclared forwarding at dispatch time, but the window between "key present, flag unset" and "guard refuses mid-run" is not closed by the dispatch step itself. The playbook assigns that check to the operator today (05).

The corpus records these as the source doc states them. The gap (3) is the natural candidate for a follow-up change: a dispatch-step `lsusb` check would move the operator's pre-flight into the workflow itself, at the cost of coupling the dispatch step to hardware detection. That is a design decision for the yubiOS maintainers; the playbook does not prescribe it.
