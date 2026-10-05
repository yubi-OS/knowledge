# The lead machine port: verbatim port, refuse-to-claim guards, gated sends

Scope: `jev-lead-lib.js` is a verbatim port of the audit/extract/normalize/template library; every refuse-to-claim guard is preserved; 40 ported behavioral tests including both false-positive traps validate the port; D1 (`jev_leads`) is the v1 system of record; sends are `resend.send` gated actions with HubSpot deferred.

## Verbatim port as a discipline

The port is verbatim by policy: the audit, extract, normalize, and template logic moved from the n8n side to the worker without rewrites. The reason is behavioral equivalence: when the logic is a port rather than a reimplementation, the test suite ports with it, and 40 behavioral tests (including both known false-positive traps) validate that the worker version behaves like the original. Reimplementation would have discarded that guarantee.

## The refuse-to-claim guards

The library preserves every refuse-to-claim guard, meaning the system declines to assert lead qualities it cannot verify:

- `javascript_rendered` sites: content that only renders in a browser is claimed as unavailable rather than guessed at; the open-item list confirms the fix (a Daytona sandbox lane for JS-rendered pages) is future work, not a silent fallback.
- Form-vendor fingerprints: when a site's booking form is a third-party vendor widget, the system refuses to claim it detected the vendor's own booking behavior.
- The roughly 60-vendor booking detection lane: detection across the known vendor set stays in the ported logic, unchanged.
- Facebook-only or no-website lanes: businesses reachable only through a social page, or with no web presence at all, follow their own handling instead of being forced through the website audit path.

The principle behind all four is honesty over coverage: a missing signal is reported as missing, never filled by inference. This is the same posture the data-quality literature describes for lead pipelines: validation layers exist so the system does not pass bad data downstream (https://leadslogix.com/blog/how-to-build-a-data-enrichment-pipeline, weight 0.13, weak backing, cited only as the general practice). The lead-validation pattern argument, that CRM adoption problems are often data-quality problems in disguise, makes the same case from the operator's side (https://www.cortexlegion.com/articles/lead-validation-deduplication-pattern, weight 0.17, weak backing). The strongest grounding for the port's outbound half is legal: the CAN-SPAM Act covers all commercial messages with no exception for business-to-business email, requires honoring opt-out requests within 10 business days, and requires a valid physical postal address in every message (https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business, weight 0.97). Gating every send through the deterministic gate is how an automated system keeps those obligations auditable rather than accidental (https://www.uschamber.com/co/grow/marketing/email-marketing-unsubscribe-laws, weight 0.63).

## D1 as the v1 system of record

Lead state lives in `jev_leads` in D1 for v1. Two accessors anchor deduplication: `getLeadByDedupeKey` and `getLeadByContactEmail`, which the advisor integration added as cross-lane contract gaps during the build. An idempotent intake (webhook receives lead data, validates and normalizes fields, prevents duplicates before they reach the CRM) is the established template for this kind of pipeline (https://community.n8n.io/t/lead-intake-template-with-validation-deduplication-and-data-table-storage/3138, weight 0.44, weak backing, cited as the pattern family). HubSpot as the eventual system of record is deferred deliberately: CRM writes through the gate become a policy learning when prioritized, which keeps v1 from blocking on a third-party integration.

## Sends as gated actions

Outreach sends are `resend.send` gated actions: the send is a proposed action like any other, passing through the deterministic gate before the Resend API is called. The decision to use Resend over Instantly was the operator's. The gate layering matters for compliance: an automated send system that must honor opt-outs and message requirements needs every send to be a recorded, approvable event, which is exactly what the gate provides.

## Fail-closed credentials

The Places leg of lead research depends on `GOOGLE_PLACES_API_KEY`, pending in the Secrets Store at the time of the build. Until the secret lands, lead-research fails closed: `credential_unavailable`, zero fetches, with the behavior test-asserted rather than assumed. A missing credential degrades to no work, not to work without credentials.
