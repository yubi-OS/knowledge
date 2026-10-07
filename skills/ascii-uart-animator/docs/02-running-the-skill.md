# 02. Running the skill

Scope: how the animation scripts are invoked, what they depend on, and the two invocation styles the skill supports.

Internal-record subtopic, no dig: everything in this doc comes from the source doc (https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

## The invocation contract

Each animation script is self-contained Python that posts to the bridge directly. The source doc's canonical invocation runs one script file through `run_script` with the rock1 shell bridge connection passed in:

```python
run_script(
    file={path: "skills/personal-WbtUgeUv/ascii-uart-animator/scripts/fish_swim.py"},
    connections=[{id: "conn_6rp6oRY9DBJG", name: "rock1 shell bridge"}],
    executor="sandbox",
)
```

Three parts of that call are load-bearing:

1. The `connections` entry is what makes the bridge reachable. The run_script egress proxy injects the bridge credentials only when the connection is passed; a request without it fails with an authentication error. The connection id shown here (`conn_6rp6oRY9DBJG`) is the one the source doc records, and doc 08 covers why the live id must be re-checked before every play.
2. The `executor` is `sandbox`, not the worker. The scripts need no filesystem, but the sandbox executor is the safer default for scripts that post long payloads and wait for a slow bridge round trip (source doc).
3. The script path lives under the skill's own `scripts/` directory, so each animation is a standalone artifact rather than a shared library with per-animation parameters.

## Inline invocation

The second style copies the relevant `render_frame` logic into a `run_script` inline call. This is the path for ad hoc experiments: a new frame renderer does not need a committed script file to be testable (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). The inline path pairs naturally with doc 06's extension recipe: prototype `render_frame(n, total)` inline, then promote it into a script under `scripts/` once it renders correctly.

## Compatibility floor

The skill's frontmatter pins the dependency set: Python 3.8+ stdlib on the agent side, the rock1 shell bridge connection, and a writable UART char device on rock1 owned by the bridge user (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)). No third-party packages are involved. The stdlib constraint matters for the egress environment: a script that imports nothing beyond the standard library runs anywhere the run_script executors run.

## What a run produces

A run has no return payload to speak of: the bridge executes the bash script and the animation's effect is on the receiving device, not in the HTTP response. The observable artifacts of a successful run are (a) a 2xx from the bridge and (b) the animation playing on the receiving side of the UART. That asymmetry is why the calibration discipline in doc 08 exists: the agent cannot see the screen, so pacing errors show up as symptoms (a frozen frame) rather than as errors in the response (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc)).

## Failure modes at the invocation layer

The source doc names two invocation-layer failures. A stale bridge connection id 401s or 530s (covered in doc 08's re-run triggers). And a script that approaches the bridge latency bound needs `run_script` timeout headroom, because a bridge call carrying a multi-thousand-line bash script takes 20+ seconds of wall clock (source doc, https://github.com/yubi-OS/yubiOS/blob/main/skills/ascii-uart-animator/SKILL.md (source doc); detailed in doc 07).
