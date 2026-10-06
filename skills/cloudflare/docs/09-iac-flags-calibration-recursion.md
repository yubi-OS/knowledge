# 09 IaC, feature flags, calibration, and recursion

Scope: the IaC decision tree (Pulumi, Terraform, REST API), the Flagship feature flag rows (binding, OpenFeature SDK, REST API), and the source doc's Calibration and Recursion self-audit rules.

## IaC: the three routes

The source doc (yubi-OS/yubiOS skills/cloudflare/SKILL.md) gives the IaC tree in one line: pulumi/ (Pulumi), terraform/ (Terraform), or api/ (REST API).

The Workers IaC docs (weight 0.94, https://developers.cloudflare.com/workers/platform/infrastructure-as-code/, updated 2026-09-22) confirm the lineup and add the SDK tier: deploy and manage Cloudflare Workers using Terraform, Pulumi, and the Cloudflare API SDKs, with SDK libraries such as cloudflare-typescript and cloudflare-python for programmatic management. So the tree is really four tiers: full IaC tools (Terraform, Pulumi), direct REST, and language SDKs.

The Pulumi docs (weight 0.63, https://developers.cloudflare.com/pulumi/, updated 2026-04-21) state the language reach: provision and manage Cloudflare resources using Pulumi IaC in TypeScript, Python, Go, and other languages. The canonical provider repository (weight 0.50, https://github.com/pulumi/pulumi-cloudflare) confirms the provider exists as Cloudflare's resource provider for Pulumi programs. Weakly weighted, labeled: the Pulumi registry page (weight 0.36) notes the provider must be configured with credentials before use; the deepwiki page (weight 0.17) describes the provider wrapping the upstream Terraform provider through a bridge layer; the etcollective repository (weight 0.12) is an unrelated IaC repo and carries no authority.

## Feature flags: Flagship

The source doc's feature-flag tree routes:

- Evaluate in Workers: Flagship binding (env.FLAGS)
- Evaluate in Node.js or browser: OpenFeature SDK (@cloudflare/flagship)
- Manage flags via API: Flagship REST API

The Flagship docs (weight 0.80, https://developers.cloudflare.com/flagship/, updated 2026-06-30) are the authoritative summary and they sharpen the tree: use the official OpenFeature SDKs to evaluate flags from Workers, Node.js, browsers, Python, and Go server applications; switch from another flag provider by changing one line of configuration; serve different flag values based on user attributes; rules support 11 comparison operators, logical AND/OR grouping, and sequential evaluation. Note the drift against the source doc: the tree presents the OpenFeature SDK as the Node.js and browser path and a binding as the Workers path, while the docs route all five environments through OpenFeature SDKs. The SDK docs (weight 0.72, https://developers.cloudflare.com/flagship/sdk/, updated 2026-06-30) confirm the same five environments for the official Flagship OpenFeature SDKs. The canonical SDK repository (weight 0.61, https://github.com/cloudflare/flagship) recommends the TypeScript SDK for most use cases, supporting HTTP evaluation and browser-side caching. Weakly weighted, labeled: the npm package page (weight 0.44) notes server-side (Node.js, Cloudflare Workers) and client-side (browser) support via isolated sub-path exports; the launch post (weight 0.48, https://blog.cloudflare.com/flagship/, dated 2026-04-17) introduces Flagship as built on OpenFeature, the CNCF open standard, working everywhere (Workers, Node.js, Bun, Deno, browser) but fastest on Workers where flags are evaluated within the Cloudflare network; the PyPI page (weight 0.11) notes the Python SDK supports HTTP mode only.

Dated correction to record: the source doc's binding row (env.FLAGS) is not contradicted by any high-weight source, but the docs' official interface language is OpenFeature SDKs across environments. Where the two could diverge in practice, follow the docs per the skill's resolution order.

## Calibration (source doc, internal-record portion, no dig)

The Calibration section of the source doc is an internal record about the skill itself, so this portion cites the source doc only and ran no web dig. Its rules: the skill ships no baked-in numbers; every numeric claim (limits, pricing tiers, compatibility dates, type signatures) must be re-retrieved from the Retrieval Sources table at use time; docs win over bundled references; the drift class is that Cloudflare limits, pricing, and API signatures change frequently and an un-re-retrieved number is expired, not stale-but-usable; a failed retrieval means the claim fails openly rather than being guessed; and measured numbers belong to the specific references/<product>/ file or the docs, never to the index page itself.

## Recursion (source doc, internal-record portion, no dig)

The Recursion section of the source doc is likewise internal. Its rules, with cadence triggers: run an index-rot audit before each retrieval, because the skill is a pointer table and product renames (a recurring Cloudflare pattern) break rows silently; run a drift check per use, and if a decision tree routes to a product whose reference content contradicts the docs fetch, record the broken row and fix the tree in the same session; keep changelog discipline, so when Cloudflare ships a new product (the tree's blind spot by construction) add the row to the matching decision tree and the Product Index in one edit, because an index that knows about a product only through prose is half-indexed; and re-run on compatibility-date bumps, new product announcements on the changelog, or any task that needed a reference file the index lacked.
