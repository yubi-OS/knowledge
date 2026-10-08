# 01 Pre-Launch Checklist

Scope: the six-section pre-launch checklist as a hard launch gate, and the external standards each section anchors to.

The ground source (yubi-OS/yubiOS skills/shipping-and-launch/SKILL.md) opens its checklist section with six gated areas: code quality, security, performance, accessibility, infrastructure, and documentation. The checklist is positioned as a gate that applies only after a change has already cleared the project-wide Definition of Done (source doc, See Also section). In other words, the checklist does not replace general quality discipline; it is the launch-specific layer on top of it.

## Code quality

The source doc requires: all tests pass (unit, integration, e2e), the build succeeds with no warnings, lint and type checking pass, code is reviewed and approved, no unresolved TODO comments, no debugging statements such as console.log left in production code, and error handling that covers expected failure modes (source doc). These are pre-deployment gates, not post-deployment observations: a launch that starts with a red test suite is a rollback waiting to happen.

## Security

The source doc lists 7 security items: no secrets in code or version control, a clean ecosystem dependency audit (npm audit, pip-audit, cargo audit), input validation on all user-facing endpoints, authentication and authorization checks, security headers such as CSP and HSTS, rate limiting on authentication endpoints, and CORS restricted to specific origins rather than a wildcard (source doc). The dependency-audit item is deliberately ecosystem-generic: the mechanism is "run the audit tool your language ships", not one specific CLI.

## Performance

Performance gates in the source doc: Core Web Vitals within "Good" thresholds, no N+1 queries in critical paths, optimized images (compression, responsive sizes, lazy loading), bundle size within budget, database indexes on hot queries, and caching for static assets and repeated queries (source doc).

## Accessibility

The source doc requires keyboard navigation for all interactive elements, screen-reader conveyance of page content and structure, color contrast at WCAG 2.1 AA (4.5:1 for text), correct focus management for modals and dynamic content, descriptive error messages associated with form fields, and zero warnings from axe-core or Lighthouse (source doc). WCAG 2.1 AA and axe-core are the two external standards invoked here; the 4.5:1 contrast ratio is quoted directly in the source doc.

## Infrastructure and documentation

Infrastructure items: environment variables set in production, database migrations applied or ready, DNS and SSL configured, a CDN for static assets, logging and error reporting configured, and a health check endpoint that responds (source doc). Documentation items: README updated with new setup requirements, current API documentation, ADRs written for architectural decisions, changelog updated, and user-facing documentation updated where applicable (source doc).

## How this maps to industry practice

Google's SRE book documents a launch coordination checklist that covers architecture, machines and datacenters, volume estimates, capacity and performance, system reliability and failover, and monitoring, and treats walking the checklist as a required launch step (https://sre.google/sre-book/launch-checklist/, jev 0.93). The yubiOS checklist is the same pattern scoped to a web service: the infrastructure section of the source doc lines up with the capacity, failover, and monitoring rows of Google's checklist, and the code quality section lines up with its release-engineering rows.

A publicly published release readiness checklist template from Input Output's quality engineering group makes the same point the source doc makes by construction: such checklists are guidance and cannot cover every project's constraints, so each project must adapt the items to its own risk profile (https://input-output-hk.github.io/quality-engineering/docs/knowledge-hub/checklists-and-templates/release-readiness-checklist, jev 0.71).

Weak-backing context: a third-party release management checklist from LaunchDarkly covers similar ground with steps for avoiding downtime (https://launchdarkly.com/blog/release-management-checklist/, jev 0.42, weak backing), and a general software release checklist from Cortex makes the same structural argument (https://www.cortex.io/post/software-release-checklist, jev 0.19, weak backing). Cite them as corroboration only, not as authority.

## Operational notes

The source doc's Verification section makes the checklist auditable: before deploying, all checklist sections must be green, a feature flag must be configured if applicable, a rollback plan documented, monitoring dashboards set up, and the team notified (source doc). A checklist that cannot fail is not a gate; treat any unchecked box as a launch blocker rather than a note.

One drift note (2026-10-08): the source doc's dependency-audit line names npm audit, pip-audit, and cargo audit as examples. Ecosystem tooling changes; the invariant the source doc encodes is that the audit step exists and blocks on critical or high findings, whichever CLI implements it.
