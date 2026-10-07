# 05 Dependency injection and lane test isolation

Scope: the lane rules that make parallel lanes independently testable: deps-injected modules, lane tests that import nothing from other lanes (stubs matching documented interfaces), one lane owning the shared data layer, node --test with all tests passing before a lane returns, and the sandbox path-copy convention.

Grounding spine: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md ("source doc").

## The three lane rules

The source doc's "Lane rules (non-negotiable)" section states 3 rules and labels them non-negotiable.

Rule 1: "Modules are deps-injected; lane tests import NOTHING from other lanes (inject stubs matching the documented interface). One lane owns the shared data layer; others consume it by name." This rule has 3 parts. Modules take their dependencies as injected parameters rather than importing them directly. Tests substitute stubs shaped to the documented interface, so a lane's test suite exercises the lane in isolation. And the shared data layer (the one module every lane would otherwise import) is owned by exactly one lane, with every other lane consuming it by name rather than by import.

Rule 2: "Tests run with node --test and ALL pass before the lane returns. Never weaken a test." Two constraints: the runner is fixed (node's built-in test runner, no bespoke harness per lane), and the completion condition is absolute (all green before return, and no editing a test to make it pass).

Rule 3: "Point lanes at session/subagent/... paths; copy outputs to the canonical dir yourself (sandbox write restrictions)." Lanes write to their own session/subagent directories because their sandbox cannot write to the canonical tree; the orchestrator performs the copy after the lane returns.

## Why import isolation is the load-bearing rule

Rule 1 is what makes parallel lanes possible at all. If lane A's tests imported lane B's module, lane B could not run until lane A finished, the lanes would serialize, and a bug in lane B would masquerade as a failure in lane A. Stub injection breaks that coupling at the type seam: each stub matches the documented interface from the SPEC's module file contract, so a lane's suite passes against any implementation that honors the contract, including the eventual real one. The "one lane owns the shared data layer" clause handles the one dependency that genuinely is shared: ownership means the data layer's tests are its owner's responsibility, and consumers test against the documented interface, never against the owner's internals.

## The node --test requirement

Fixing the runner is what makes the advisor's job mechanical. The advisor lane "runs all suites together," which only composes if every suite speaks the same runner protocol. The node.js test runner is built into the runtime, requires no per-lane dependency decisions, and produces a uniform pass/fail stream. The dig for this subtopic surfaced the official Node.js test runner documentation as the canonical reference for the runner (weak, 0.09; nodejs.org/api/test.html, and the beta mirror at weak, 0.09; beta.docs.nodejs.org/test). A Better Stack guide walks the same runner for beginners (weak, 0.04; betterstack.com/community/guides/testing/nodejs-test-runner/). All dig weights here are below 0.5 and are labeled weak; the runner choice itself is the source doc's.

## Dependency injection background

The general technique predates this skill: the dependency injection pattern, in which components receive their collaborators rather than constructing or importing them, is standard software practice (weak, 0.04; en.wikipedia.org/wiki/Dependency_injection). Test-isolation literature makes the same move for tests: mocks and stubs stand in for real dependencies so a unit is exercised without its collaborators (weak, 0.04; codemag.com/article/0906061/Isolating-Dependencies-in-Tests-Using-Mocks-and-Stubs). The source doc's contribution is the parallel-build-specific constraint: the stub must match the documented interface from the SPEC, and the import prohibition is absolute, not a preference.

## The sandbox path convention

Rule 3 exists because of how the lanes execute: implementation lanes run in sandboxes whose write restrictions prevent them from writing the canonical source tree. Pointing lanes at session/subagent/... paths keeps each lane's output isolated, and the orchestrator's copy step is the single merge point into the canonical directory. This also gives the orchestrator a natural inspection point: it can review a lane's outputs before they land in the canonical tree, and a lane's RETURN payload (paths, test counts, interface summaries) maps 1-to-1 onto the files being copied.

## Failure modes the rules prevent

The integration lessons section records what happens when these rules are violated. A test driver that does not match the real backend (parity failure, lesson 1) is exactly the stub-drift Rule 1's "matching the documented interface" clause prevents. The approvals-array adapter drop (lesson 2) is the cost of an adapter that silently narrows an interface. The "never weaken a test" clause closes the classic escape hatch where a lane relaxes an assertion to return green, which would push the real failure into the advisor's integration pass where it is most expensive to find.
