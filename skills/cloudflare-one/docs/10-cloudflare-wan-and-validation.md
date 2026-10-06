# 10 - Cloudflare WAN, Validation, and Output Defaults

Scope: Cloudflare WAN site connectivity and Network Firewall, the firewall expression syntax boundary against Gateway, one-time secret handling, and the skill's validation prompts and output defaults that close every engagement.

Grounding spine: source doc `yubi-OS/yubiOS skills/cloudflare-one/SKILL.md`.

## Cloudflare WAN is connectivity, not a security service

The source doc's framing rule: Cloudflare WAN is connectivity, not a security service. Apply inspection and policy with Gateway and Network Firewall where required (source doc). The WAN domain covers site connectivity: site topology, on-ramp type, route ownership, tunnel redundancy, static vs BGP-managed routes, network firewall needs, and appliance or profile ownership, with the [Cloudflare WAN](https://developers.cloudflare.com/cloudflare-wan/) and [Cloudflare Network Firewall](https://developers.cloudflare.com/cloudflare-network-firewall/) docs to retrieve before proposing site connectivity changes (source doc).

The current docs confirm the connectivity surface: [WAN on-ramps](https://developers.cloudflare.com/cloudflare-wan/on-ramps/) cover the ways sites attach (weight 0.88), and [configuring routes](https://developers.cloudflare.com/cloudflare-wan/configuration/how-to/configure-routes/) covers route management including static and BGP-managed routing (weight 0.89). The [Cloudflare WAN overview](https://developers.cloudflare.com/cloudflare-wan/) anchors the product (weight 0.67).

## The expression syntax boundary

The source doc's caution: WAN firewall expressions are not the same language as Gateway wirefilter expressions. Retrieve the current syntax before editing (source doc). The distinction is real and documented on both sides: the [Cloudflare ruleset engine rules language](https://developers.cloudflare.com/ruleset-engine/rules-language/) (weight 0.94) and its [expressions reference](https://developers.cloudflare.com/ruleset-engine/rules-language/expressions/) (weight 0.93) are the general Cloudflare expression system, while the [cloudflare/wirefilter](https://github.com/cloudflare/wirefilter) repository documents the wirefilter language used elsewhere in the stack (weight 0.69). The [Gateway expression syntax](https://developers.cloudflare.com/cloudflare-one/traffic-policies/expression-syntax/) page sits in the Cloudflare One traffic policies tree (weight 0.95). The skill's rule prevents the classic cross-contamination error: writing a Gateway-style expression into a WAN firewall or vice versa. Never guess wirefilter fields (source doc, API Safety section).

## One-time secrets

The source doc warns: generated IPsec PSKs and some OAuth or client secrets are returned once. Store them immediately (source doc). In the WAN context this bites at on-ramp creation: a lost PSK means re-generating and re-provisioning the tunnel endpoint. This pairs with the tunnel-token lesson in doc 04: the credential is the deployment unit, and rotation discipline exists because credentials leak.

## Validation prompts

The source doc closes work in each domain with a validation list (source doc):

- Access: test authorized, unauthorized, posture-failing, service-token, and multi-IdP flows when applicable; inspect logs and policy precedence.
- Private network access: verify route lookup, tunnel health, origin reachability, split tunnel behavior, DNS resolution, and end-to-end access from a device client test device.
- Gateway: verify rule type, action, traffic expression, precedence and evaluation phase, referenced lists, and Gateway settings before enabling broadly.
- TLS and DLP: test Do Not Inspect exceptions and root CA trust before enabling inspection; test DLP with known samples and monitor false positives before blocking.
- CASB and risk: confirm integration health, credential expiry, asset discovery, scan timing, finding instances, and risk-score signal latency before declaring remediation complete.
- Cloudflare WAN: verify tunnel health, route priority and ownership, traffic flow, firewall expression syntax, and connector or appliance telemetry where applicable.

## Output defaults

The source doc prescribes 3 output shapes (source doc):

1. Designs: current assumptions, target architecture, product responsibilities, rollout phases, validation, and open decisions.
2. Configuration work: prerequisites, exact resources to inspect, create, or change, test cases, and rollback.
3. Troubleshooting: traffic path, likely failure point, evidence to collect, and the next test.

The common thread is reversibility. Every output names its rollback or next test, which is the skill's answer to the API safety rule against broad production policies without approval.

## Community corroboration, weighted honestly

Community threads on [BGP over IPsec and GRE tunnels in Cloudflare WAN](https://community.cloudflare.com/t/cloudflare-wan-magic-transit-cloudflare-one-bgp-over-ipsec-and-gre-tunnels-generally-available/965738) (weight 0.17) and the related [BGP over GRE and IPsec announcement thread](https://community.cloudflare.com/t/cloudflare-wan-magic-transit-cloudflare-one-bgp-over-gre-and-ipsec-tunnels/896738) (weight 0.12) exist but are weak sources; all load-bearing claims here rest on the developers.cloudflare.com pages and the source doc.

## Where this doc ends the corpus

The WAN plus validation pair is the skill's exit surface: WAN because site connectivity is the widest blast radius change the skill touches, and validation because every other doc's mechanics end here, in the test list that proves the change did what it claimed. A [generic wirechecker result](https://wirechecker.com/) (weight 0.05) rounds out the archive as a collected-but-rejected source, an example of the noul filter doing its job.
