# Code interpreter

Scope: the Python and JS code interpreter surface on the 1.0 preview: how it attaches, what `runCode` returns, and how it is used in AI code-executor patterns.

## The 1.0 preview surface

On `@next`, interpreter methods live on `sandbox.interpreter` after you attach `withInterpreter` on your Sandbox subclass. Method names match the stable interpreter, and `runCode` returns plain serializable data (https://developers.cloudflare.com/sandbox/1-0-preview/api/interpreter/, jev weight 0.89). The attach step is the part that differs from a plain import: the interpreter is opt-in per Sandbox subclass, which keeps the default surface small on the preview line.

The source doc (yubi-OS/yubiOS skills/sandbox-next/SKILL.md) routes two tasks to this surface: Python and JS code interpretation, each with its own docs page and API page (Interpreter and Interpreter API). It also repeats its standing rule that applies here: fetch the page before implementing, and let installed `@next` types win over guesses (source doc).

## Relationship to the stable interpreter

The stable interpreter API page is the retrieval target the source doc points at for the shared method surface (https://developers.cloudflare.com/sandbox/api/interpreter/, jev weight 0.78). The 1.0 page's statement that method names match the stable interpreter means you can navigate stable reference material for method semantics, but the attach mechanism and package line differ. As with all shared surfaces, ignore stable-only session and transport details when reading them for `@next` work (source doc).

## Use in AI code execution

The pattern the interpreter exists for is an AI model deciding to run code and the sandbox executing it. Cloudflare's AI code executor tutorial builds an AI-powered code execution system using Sandbox SDK and Claude: turn natural language questions into Python code, execute it securely, and return results, with a listed completion time of 20 minutes (https://developers.cloudflare.com/sandbox/tutorials/ai-code-executor/, jev weight 0.79). A related Workers AI variant from the 0.x line does the same with GPT-OSS: the model accepts natural language prompts, decides when Python code execution is needed, runs the code in isolated sandboxes, and returns results with AI-powered explanations (https://developers.cloudflare.com/sandbox/sdk/tutorials/workers-ai-code-interpreter/, jev weight 0.32, weak backing: it documents the 0.x line).

The 0.x AI code executor tutorial page itself carries the routing note: for new applications refer to the current AI code interpreter tutorial, and to move an existing application to 1.0 refer to the migration guide (https://developers.cloudflare.com/sandbox/sdk/tutorials/ai-code-executor/, jev weight 0.34, weak backing). That is a dated correction worth recording: 0.x tutorial links still rank well in search but are superseded on the preview line.

## Where it fits in the surface map

The interpreter sits alongside the process and terminal surfaces as one of three ways to run code: `exec` for argv commands, terminals for interactive shells, and the interpreter for structured code execution that returns serializable data. The 1.0 API hub lists the interpreter API among the preview's API pages (https://developers.cloudflare.com/sandbox/1-0-preview/api/, jev weight 0.86). The source doc's non-exhaustive cheatsheet covers process, terminal, and interpreter only, which is a useful hint about where the interesting API risk concentrates on this line (source doc).

## Error domain

The errors module includes interpreter errors as a domain alongside files, ports, and mounts: the 1.0 errors API module exports `ErrorCode`, `SandboxError`, `createErrorFromResponse`, and other domain errors covering files, ports, interpreter, and mounts (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/1-0-preview/api/errors.mdx, jev weight 0.82). So interpreter failures surface as typed errors in the same family as the rest of the SDK, rather than as raw exceptions; the errors doc in this corpus covers the retry-versus-relaunch decision.

## Practical habits

Two habits follow from the documented facts. First, when `runCode` results fail to serialize or type-check, suspect the return-shape expectation: `runCode` returns plain serializable data, not live object handles (https://developers.cloudflare.com/sandbox/1-0-preview/api/interpreter/, jev weight 0.89). Second, if interpreter methods are missing entirely, check that `withInterpreter` is attached to the Sandbox subclass, since the surface does not exist without it (https://developers.cloudflare.com/sandbox/1-0-preview/api/interpreter/, jev weight 0.89).

## Weak-backing notes

A DeepWiki page summarizing the code interpreter example is generated secondary documentation (https://deepwiki.com/cloudflare/sandbox-sdk/5.2-code-interpreter-example, jev weight 0.13, weak backing). A third-party fork's example README describing the Workers AI integration is unofficial (https://github.com/dus4w/ai-cloudflare-sandbox-sdk/blob/main/examples/code-interpreter/README.md, jev weight 0.24, weak backing). Neither should be cited for API signatures; the official preview API page and the installed types govern.
