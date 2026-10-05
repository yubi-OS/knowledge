# Operator console v2 at /jev/

Scope: the `/jev/` dashboard is the cost-low internal tooling surface: a prompt console (textarea to task), an Automations tab (deploy, validate, activate, pause, run-now with input), a models pill (route to model id), the navy/violet terminal aesthetic, and fail-soft sessionStorage state.

## What the console is for

The retarget directive made the dashboard the center of the automation workflow: deploying automations and accepting prompts directly, as cost-low internal tooling. The console turns every operation the API offers into a button, so the operator drives the automation lifecycle without a client.

## The prompt console

The prompt console is a textarea that submits its contents as a task through prompt intake (`POST /api/jev/tasks` with `payload.prompt`). It is the operator-facing face of the untrusted-input flow: the operator types natural language, the 70B tier proposes actions, and the proposals still pass the same validation and gate as everything else. The console makes the trust boundary visible by keeping the proposal-and-approval loop on one screen.

## The Automations tab

The Automations tab exposes the registry lifecycle: deploy (new draft version), validate (run definition validation), activate (single-active-per-name swap), pause, and run-now with an input payload. This maps the operator's intent directly onto the registry's verbs (see the automation registry doc): deploy and activate are separate buttons because they are separate operations with different risk. Console designs for operator lifecycles structure their surfaces around exactly this kind of state transition set; the Actions console organizes its interface into a main navigation, left menu, and editing area with a Develop tab (https://developers.google.com/assistant/console/ui, weight 0.60, moderate backing for the structural pattern). Operational consoles more broadly group service lifecycle operations, deployment status visibility, and runtime health as their core capabilities (https://llm-port.github.io/docs/features/ops-console, weight 0.59, weak backing, cited as a comparable console's capability list).

## The models pill

The models pill renders the live model routes (route name to model id), backed by `/api/jev/models`. It is a small observability feature with outsized debugging value: when a stage misbehaves, the operator sees at a glance which model the route resolved to, without querying the routing layer.

## The aesthetic

The console keeps the navy/violet terminal aesthetic: dark surfaces, monospaced type. Terminal-style UI design systems treat monospace typography and window decorations as the defining features for developer tools (https://github.com/chyinan/terminal-ui-design-system, weight 0.59, weak backing for the aesthetic convention). Dark dashboard design generally trades on carefully chosen contrast rather than color inversion (https://adminlte.io/blog/dark-dashboard-templates/, weight 0.55, weak backing). For a machine that runs gated actions on live infrastructure, the terminal look is also functional: logs and structured output read naturally in monospace.

## Fail-soft sessionStorage

Console state (the last prompt, the selected automation) lives in sessionStorage and degrades fail-soft: if storage is unavailable or stale, the console falls back to defaults rather than erroring. Browser-platform guidance recommends sessionStorage over localStorage where per-tab isolation and reduced cross-tab state bugs matter (https://learn.microsoft.com/en-us/aspnet/core/blazor/state-management/protected-browser-storage?view=aspnetcore-10.0, weight 0.95; and https://learn.microsoft.com/en-us/aspnet/core/blazor/state-management/webassembly?view=aspnetcore-10.0, weight 0.96, on user state held in browser memory). For an internal console the tradeoff is deliberate: nothing important persists across tabs, and a corrupted console state never blocks an operator action.

## Why the console lives on the worker

Serving the console from the same Worker that runs the automations means there is no second deployment target: the console, the API, the engine, and the scheduler ship together, and the console's buttons can only call the API the Worker already validates. That keeps the internal tooling surface from becoming a separate system with its own drift.
