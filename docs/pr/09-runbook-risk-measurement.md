# 09 - Launch runbook, risk response, measurement, and approvals

Scope: the day-anchored launch runbook (D-14 through D+30), the 9-row risk and response table, the weekly measurement dashboard, and the role-based approval system that gates new claims.

Grounding spine: yubi-OS/yubiOS docs/PR.md, sections "Launch runbook", "Risk and response plan", "Measurement", and "Ownership and approvals". Internal-record subtopic, no dig; all claims are source-doc claims.

## Launch runbook

The runbook is keyed to a launch day D and has 5 phases (source doc: yubi-OS/yubiOS docs/PR.md):

### D-14 to D-8: evidence freeze

- Select the exact commit and artifacts under announcement.
- Run the proof from a clean environment and archive output.
- Have a second person reproduce it.
- Re-check every claim, link, tag, trademark notice, and recovery step.
- Capture current blockers and decide which are launch-stopping.

### D-7 to D-3: targeted briefings

- Offer no more than 3 to 5 tailored briefings.
- Give every recipient the same factual evidence and launch time.
- Maintain a question log and update the FAQ without changing the underlying claims.
- Prepare correction, security, and infrastructure incident responses.

### D-2 to D-1: go/no-go

- Confirm artifact availability, site health, contacts, moderation coverage, and demo hardware.
- Stop if a production/dev tag ambiguity, signing discrepancy, recovery failure, or trademark objection is unresolved.
- Pre-write launch, delay, and correction messages.

### D-day

- Publish the canonical evidence page first.
- Publish the project post and targeted community submissions second.
- Send pitches only after canonical links are live.
- Keep at least 2 technical responders available; log questions and corrections.
- Do not debate threat-model limits defensively. Link the evidence and acknowledge unknowns.

### D+1 to D+30

- Publish corrections immediately and visibly.
- Turn repeated questions into documentation.
- Triage external findings by boundary and severity.
- Report outcomes at D+7 and D+30, including failures and low-performing channels.
- Thank contributors with permission; do not turn unsolicited review into implied endorsement.

The ordering discipline is the runbook's core: evidence before posts, posts before pitches, and a stop condition on D-2 that treats ambiguity as a blocker rather than a footnote (source doc).

## Risk and response plan

9 risks with paired prevention and response (source doc):

| Risk | Prevention | Response |
|---|---|---|
| Project name or logo creates perceived Yubico affiliation | Trademark review, independence line, conservative asset use | Pause amplification, correct copy everywhere, cooperate on rename or asset changes if required |
| "No TPM" becomes the headline | Use the identity/platform split in headline and briefing | Correct promptly: no mandatory TPM for owner-facing unlock; TPM/fTPM may provide measurement |
| WIP image is treated as safe for daily use | Gate labels, hardware matrix, destructive-install warnings | Pin a warning, contact the outlet, correct the canonical page, document affected users |
| TEST-only authenticator reaches a production tag | Automated separation gates and release verification | Stop distribution, revoke/retag as appropriate, publish incident facts, rotate affected artifacts, investigate authority path |
| Security finding arrives during campaign | SECURITY.md, monitored role address, response owner | Acknowledge privately, triage, coordinate disclosure, pause scheduled claims that depend on the control |
| Demo fails or evidence cannot be reproduced | Clean-room rehearsal and backup hardware | Delay; publish only after root cause and new evidence are available |
| AI narrative overwhelms the technical work | Lead with owner control and proof; keep AI as a supporting angle | Redirect to artifacts and avoid culture-war framing |
| Personal data is amplified | Role-based contacts and removal of unnecessary personal details | Remove from canonical docs, request cache/search correction where practical, rotate exposed contact channels if needed |
| Community sees drive-by marketing | Participate upstream and ask narrow technical questions | Stop cross-posting, answer substantively, and return only with upstream-relevant evidence |

## Measurement

A weekly dashboard with 6 dimensions, each with a metric and a reason it matters (source doc):

| Dimension | Metric | Why it matters |
|---|---|---|
| Qualified awareness | Relevant referring domains, technical article mentions, repeat visitors to evidence pages | Distinguishes useful discovery from empty reach |
| Contributor conversion | New issue authors, reviewers, reproductions, accepted changes, returning contributors | Measures whether the campaign improves the project |
| Hardware progress | Board offers, tested configurations, reproduced ceremonies, Path A evidence completed | Connects communications to the flagship blocker |
| Trust | Corrections, claim-ledger exceptions, response time, independent confirmations | Measures credibility directly |
| Release safety | Production/dev separation checks, provenance/SBOM verification, recovery success | Prevents campaign pressure from weakening release discipline |
| Community quality | Questions answered, actionable findings, upstream engagements, toxic/low-signal moderation load | Shows whether channel choice is sustainable |

Process rules around the dashboard: record the baseline before Wave 1; use tagged links for channel attribution but avoid invasive tracking; review metrics at D+7, D+30, and D+90; and stop tactics that generate attention without qualified review or safe adoption (source doc).

## Ownership and approvals

6 roles replace personal contact details (source doc):

| Role | Responsibility |
|---|---|
| Campaign owner | Timeline, asset completion, contact log, metrics |
| Technical spokesperson | Architecture, demos, interviews, final factual review |
| Security reviewer | Claim ledger, threat-boundary language, disclosure readiness |
| Release verifier | Artifact/tag/provenance/SBOM and test evidence |
| Community responder | Discussion coverage, contributor routing, moderation |
| Brand/legal reviewer | Name, trademark, licensing, privacy, endorsements |

The approval rule: the technical spokesperson and the security reviewer must both approve any new security claim, and the release verifier must approve any availability or artifact claim. Missing approval means delay, not softer wording invented at launch time (source doc).

## How the pieces interlock

The runbook operationalizes the gates (doc 05): D-14's evidence freeze is the gate check repeated under deadline pressure, and the D-2 stop list maps 1 to 1 onto the claim-ledger failure shapes (tag ambiguity, signing discrepancy, recovery failure, trademark objection). The risk table's rows are the same boundaries restated as incidents, and the trust dimension of the dashboard measures how well the response half of the table executes (source doc).
