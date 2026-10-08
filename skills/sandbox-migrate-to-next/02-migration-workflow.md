# 02. The 5-step migration workflow

Scope: the ordered workflow the skill drives (review, audit, clarify, upgrade, validate), its stop-for-user-decision points, and the rule that installed types and the migrate doc outrank memory.

## The workflow

The source doc defines 5 ordered steps (source doc):

1. Review the hard rules and the replacement map.
2. Audit the codebase; list hits and target shapes.
3. Clarify with the user (cutover, bridge, Python image, unclear sites).
4. Upgrade package, image, and code.
5. Validate.

After each step the skill adds one governing instruction: "Stop after any step that needs a user decision" (source doc). In practice that gate fires at step 3 almost always, because the clarify step is where production cutover consent is obtained (see doc 06). It can also fire earlier: if the audit surfaces a call site the replacement map does not cover, that is an unclear site and belongs in the clarify conversation rather than in improvised code.

The upstream migrate guide matches this shape and adds its own framing: "This guide moves a project onto @cloudflare/sandbox@next, the preview of Sandbox SDK 1.0. Migrate when you can so you are ready when 1.0 becomes the stable release" ([0.81](https://developers.cloudflare.com/sandbox/1-0-preview/migrate/)). A later Cloudflare page, "Plan the move to Sandbox SDK 1.0," describes the same program of work in planning terms: "Choose how to switch live Sandbox SDK 0.12 sandboxes to 1.0, prepare your code for the deploy that cannot be undone, and remove what 0.12 leaves behind" ([0.88](https://developers.cloudflare.com/sandbox/sdk/migrate/plan-the-move/)). That phrase "the deploy that cannot be undone" is the cutover constraint from doc 08 stated from the planning side.

## Prefer installed types and the doc over memory

The source doc is emphatic: "Prefer installed @next types and the migrate doc over memory" (source doc). This is an anti-hallucination rule aimed at agents. After `npm install @cloudflare/sandbox@next`, the type declarations in `node_modules` are the authority on what exists; anything the agent remembers from the stable line (transport options, session methods, string kill signals) is suspect until the types or the migrate page confirm it. The upgrade step in doc 07 reinforces this per-area: "For each area, implement from the doc, not from stable habits" (source doc).

The migrate doc itself is the depth layer the skill defers to: "Depth lives in docs. Fetch the linked page when a step needs detail" (source doc). The skill carries the control flow; the Cloudflare pages carry the API specifics.

## Where the depth lives

The skill's upgrade section maps each code area to a doc page (source doc): commands, handles and waits to the Processes pages; `cwd`/`env` and secrets to the Environment and Outbound traffic pages; dropping sessions to Migrate and Lifecycle; terminals to the Terminals page; the interpreter to its page; errors to the Errors page; durable jobs across requests to the process-lifetime section of Processes. The 1.0 preview overview confirms this doc set exists as a section: "Use this section for preview APIs and the migration path" ([0.77](https://developers.cloudflare.com/sandbox/1-0-preview/)).

## Order matters

The order is not decorative. Reviewing hard rules first (step 1) prevents the most expensive mistakes before any code is touched: version-line mismatch and gradual rollout are both caught there (doc 03). Auditing second (step 2) produces the inventory that the upgrade step works through and the clarify step asks about. Clarifying third (step 3) means the user consents to cutover semantics before anything is deployed. Upgrading fourth (step 4) bundles package, image, and code so they land in lockstep. Validating last (step 5) is the only step that can confirm the port is complete (doc 09).

## Known drift

The source doc's human-guide links point at `developers.cloudflare.com/sandbox/1-0-preview/...` paths. A weakly weighted GitHub issue ([0.25](https://github.com/cloudflare/skills/issues/212)) reports that as of October 1, 2026 only `1-0-preview/migrate/` resolves to real content (at `/sandbox/sdk/migrate/`) while other 1-0-preview links redirect to the sandbox landing page. When a linked page does not render, locate the same content under the current `/sandbox/` information architecture rather than assuming the API changed.
