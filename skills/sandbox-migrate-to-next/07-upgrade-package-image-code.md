# 07. Upgrade: package, image, and code by area

Scope: upgrading the npm package and container image in lockstep, then applying per-area code replacements with the doc-backed shapes.

## Package and image first

The source doc's upgrade mechanics (source doc):

```sh
npm install @cloudflare/sandbox@next
```

```dockerfile
FROM cloudflare/sandbox:next
# Python: cloudflare/sandbox:next-python
```

Two constraints wrap these commands. First, alignment: the hard rule requires the Worker package and container image on the same `@next` line (doc 03), and the Dockerfile reference generalizes it: "Pin the container tag to the same preview line as @cloudflare/sandbox@next (for example cloudflare/sandbox:next or a matching prerelease). Do not mix a preview Worker package..." with a non-matching image ([0.82](https://developers.cloudflare.com/sandbox/configuration/dockerfile/)). Second, tagging: "Same prerelease tag on Worker and image when not on floating `next`" (source doc). The migrate doc says the same from the install side: "Confirm the lockfile resolves @cloudflare/sandbox to a preview build. Use the -python image variant when you run Python. Keep the Worker package and container image on the same @next line" ([0.85](https://developers.cloudflare.com/sandbox/1-0-preview/migrate/)). Docker Hub confirms the tags exist: `next-python` and a pinned `0.13.0-next.776.1-python` on `cloudflare/sandbox` ([0.61](https://hub.docker.com/r/cloudflare/sandbox/tags)).

## Commands, handles, waits

The core shape change, from the source doc (source doc):

```ts
// Before (stable)
const result = await sandbox.exec("npm test");

// After (@next)
const process = await sandbox.exec(["/bin/bash", "-lc", "npm test"]);
const result = await process.output({ encoding: "utf8" });
```

Note what changed beyond the call: the string became an argv array with an explicit shell binary (because `npm test` alone needs no shell but the general case does), and completion moved from the await on `exec` to an explicit `output()` call. A long-running service keeps a handle instead of a result (source doc):

```ts
const server = await sandbox.exec(["/bin/bash", "-lc", "npm run dev"], {
  cwd: "/workspace/app",
});
await server.waitForPort(3000, { timeout: 60_000 });
await server.kill(); // numeric; default 15
```

This shape demonstrates 3 map rows at once: per-launch `cwd` (sessions gone), `waitForPort` with a timeout that cancels the wait only, and numeric kill with default 15. The processes guide describes the model these shapes implement: "treat the sandbox as a computer you drive with explicit programs. Each exec() starts a new supervised process from argv" ([0.79](https://developers.cloudflare.com/sandbox/1-0-preview/processes/)).

## Terminals

```ts
const terminal = await sandbox.createTerminal({ command: ["bash"], cwd: "/workspace" });
const t = await sandbox.getTerminal(terminal.id);
if (!t) return new Response("terminal gone", { status: 410 });
return t.connect(request, { cursor, cols, rows });
```

(source doc). The terminal API reference documents `createTerminal`, handles, connect, and control methods ([0.80](https://developers.cloudflare.com/sandbox/1-0-preview/api/terminals/)); the terminals guide covers the resource model and browser connect ([0.84](https://developers.cloudflare.com/sandbox/1-0-preview/terminals/)). The `getTerminal` null case maps to HTTP 410 because a pre-cutover terminal ID is stale after deploy (doc 08).

## Interpreter

```ts
import { Sandbox as BaseSandbox } from "@cloudflare/sandbox";
import { withInterpreter } from "@cloudflare/sandbox/interpreter";

export class Sandbox extends BaseSandbox<Env> {
  interpreter = withInterpreter(this);
}
```

(source doc). The interpreter guide confirms the pattern is on the `@next` line: "This page uses the interpreter extension on @cloudflare/sandbox@next" ([0.77](https://developers.cloudflare.com/sandbox/1-0-preview/interpreter/)), and the API reference adds that "Method names match the stable interpreter; runCode returns plain serializable data" ([0.80](https://developers.cloudflare.com/sandbox/1-0-preview/api/interpreter/)), so existing interpreter call bodies mostly survive once the attachment exists.

## Git

```ts
const clone = await sandbox.exec(
  ["git", "clone", "--depth", "1", "--", repoUrl, "/workspace/repo"],
  { cwd: "/workspace" },
);
const result = await clone.output({ encoding: "utf8" });
```

(source doc). This is the argv-`git` replacement for stable's `gitCheckout`: a plain process with argv, `--` argument separation before the URL, and an explicit output wait. It doubles as a worked example of the exec rules from doc 03.

## Environment and isolation

The upgrade step also covers `cwd` / `env` / secrets per the area table (source doc). The stable environment-variables documentation lists the 3 legacy injection levels (sandbox-level `setEnvVars()`, per-command exec options, session-level `createSession()`) ([0.84](https://developers.cloudflare.com/sandbox/sdk/configuration/environment-variables/)); with sessions gone, the preview keeps the first 2 shapes. One hard boundary carries over: no live secrets in the sandbox env (validation item 6, source doc), because a sandbox is untrusted work space. The migrate doc's user-isolation line completes the step: "Isolate users with separate sandbox IDs" (source doc), which replaces any attempt to share one sandbox across users via sessions.
