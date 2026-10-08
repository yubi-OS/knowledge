# 08. Deprecated-API cleanup while staying on stable

Scope: cleaning deprecated stable APIs without switching packages: the 2026 deprecation migration, the RPC transport move, the default-session change, and the stream-helper consolidation, with the package-plus-image update done first.

Grounding spine: yubi-OS/yubiOS skills/sandbox-stable/SKILL.md (source doc).

## What was deprecated, and when

The changelog entry is the anchor: dated Jun 9, 2026, "Deprecating Sandbox SDK features", and it points to "the 2026 deprecation migration guide, or move to the Sandbox SDK 1.0 preview when you can" (https://developers.cloudflare.com/changelog/post/2026-06-09-deprecating-sandbox-sdk-features/, jev weight 0.85). The transport timeline is inside the same entry: "In April 2026, we released the new RPC transport and deprecated the WebSocket transport. This setting governs how the sandbox container talks to the Workers ecosystem" (https://developers.cloudflare.com/changelog/post/2026-06-09-deprecating-sandbox-sdk-features/, jev weight 0.85). So the deprecation has two anchors: April 2026 for the transport swap, June 2026 for the formal guide and broader feature list.

## The RPC transport move

The migration guide gives the two configuration paths: "HTTP and WebSocket transports are deprecated. Switch to the RPC transport. To configure RPC transport for every sandbox in your Worker, set SANDBOX_TRANSPORT in your Worker's configuration: "vars": { "SANDBOX_TRANSPORT": "rpc" }. To configure RPC transport for a specific sandbox, pass transport: "rpc" to getSandbox(): transport: "rpc"" (https://developers.cloudflare.com/sandbox/guides/2026-deprecation/, jev weight 0.64). Worker-wide via `vars`, or per-sandbox via the `getSandbox` option. The source doc's own grep covers this first hit: `rg 'SANDBOX_TRANSPORT|transport:|exposePort\(|enableDefaultSession|execStream\(|readFileStream|writeFileStream'`.

## The scope of the guide

The guide's mdx source states its audience exactly: "This guide is for apps that stay on the current stable @cloudflare/sandbox package and need to leave deprecated features (transports, default sessions, stream helpers, and related APIs)" (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/guides/2026-deprecation.mdx, jev weight 0.49). Three families fall out: transports, default sessions, and stream helpers. Cloudflare also ships the guide as an agent skill, which confirms it is meant to be executed, not just read: "Use this skill when migrating a codebase that depends on the Cloudflare Sandbox SDK away from features deprecated in June 2026" (https://github.com/cloudflare/cloudflare-docs/blob/production/public/sandbox/guides/2026-deprecation/SKILL.md, jev weight 0.51).

The preview-hosted copy of that skill lists the concrete cleanup steps beyond transports: "Set enableDefaultSession: false on getSandbox(). Replace workflows that depend on persisted shell state with explicit sessions from sandbox.createSession(). Move stream-specific file and command logic to the base readFile(), writeFile(), and exec() APIs where streaming behavior is supported" (https://cloudflare-docs.cloudflare-docs.workers.dev/sandbox/guides/2026-deprecation/SKILL.md, jev weight 0.31, weak backing below 0.5; the steps are consistent with the docs pages at 0.64 and 0.85 and the source doc, but treat this copy as corroboration only).

## Sequencing rule

The source doc fixes the order of operations: "Update package + matching image first, then follow the guide." The gate (doc 01) supplies the reason: package and image must stay on the same line, so a cleanup that bumps only one side creates the exact mixed-line state the gate exists to stop. The cleanup ends where it started: "This path does not switch you to @next" (source doc), and the ship checklist requires that any deprecated transports or helpers found are either finished or tracked against the 2026 deprecation guide.

## Weak-source caution

The community mirror of the changelog announcement (0.12) is weak backing below 0.5 and carries no claims above (https://community.cloudflare.com/t/sandboxes-deprecating-sandbox-sdk-features/933294). Every dated or mechanical claim rests on the Cloudflare changelog and guide at 0.49 or higher, plus the source doc.
