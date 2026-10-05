# 02 - Telemetry stewardship: opt-in, consent, and data ownership

Scope: stewardship rules for telemetry in open-source products, opt-in versus opt-out defaults, consent, data minimization, and who telemetry data belongs to.

## The authoritative floor: the LF guidance

The Linux Foundation's guidance on telemetry data and open source is the strongest-backed source in this corpus (weight 0.72). It defines telemetry as "data about how software is used or performing, often collected through a phone-home mechanism built directly into the software," and frames the governance question as one of policy and best practice rather than tooling: projects should decide collection deliberately, disclose it clearly, and treat user consent as the control point (weight 0.72: https://bestpractices.linuxfoundation.org/privacy/telemetry.html). For a covenant, this is the anchor clause: telemetry is legitimate only when it is a disclosed, consented choice.

## Opt-in versus opt-out

The sharpest thinking on defaults comes from Russ Cox's transparent telemetry series. Cox documents that when maintainers considered telemetry for Go, "by far the most common suggestion was to make the system opt-in," and that transparent telemetry, an explicitly opt-in design with public, inspectable collected data, was accepted as "an appropriately minimal amount of collection" (weight 0.59: http://research.swtch.com/telemetry-opt-in). The opt-in consensus matters because an opt-out default inverts the consent relationship: the user must act to stop collection rather than act to allow it.

Vendor writing agrees in practice even when it argues about labels. Notesnook's policy essay contrasts opt-in, opt-out, and zero telemetry and lands on private-by-default with explicit consent as the defensible position (weight 0.38, weak backing: https://notesnook.com/blog/telemetry-opt-in-vs-opt-out). A 2026 essay on developer-tool telemetry distills the same rule set: explicit opt-in, readable payloads, and architectures that prevent invasive tracking (weight 0.31, weak backing: https://goatfied.com/blog/telemetry-in-open-source-developer-tools-done-ethically). PostHog, itself a telemetry vendor, concedes the topic is "an ethical and business minefield" and that caution, not enthusiasm, is the right default stance (weight 0.31, weak backing: https://posthog.com/blog/open-source-telemetry-ethical).

## The failure example that defines the rule

The ZDNet reporting on Windows 10 telemetry shows what a covenant must prevent: Microsoft built a telemetry system users "can dial back almost to zero, but can't turn off completely" (weight 0.07, weak backing: https://www.zdnet.com/article/is-windows-10-telemetry-a-threat-to-your-personal-privacy/). The lesson is categorical: a default that cannot be fully refused is not consent, and a covenant that permits telemetry should require an off switch that actually works.

## What a telemetry clause should say

Synthesizing the corpus: telemetry ships off by default; any collection is opt-in with a working refusal path; collected data is kept minimal and inspectable; and the covenant names telemetry-by-default as a conflict trigger, so a proposal that ships collection on is caught by the conflict policy rather than by user backlash.
