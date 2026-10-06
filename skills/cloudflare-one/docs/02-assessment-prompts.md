# 02 - Assessment Prompts

Scope: the pre-configuration assessment checklist the skill runs before any change, covering architecture and current state, access and SaaS federation, tunnels and private networking, Gateway with TLS and DLP, CASB and device posture, and Cloudflare WAN site connectivity.

Grounding spine: source doc `yubi-OS/yubiOS skills/cloudflare-one/SKILL.md`. All "source doc" attributions refer to that file. This is the skill's "avoid jumping straight to configuration" layer: use only the prompts relevant to the task.

## Architecture and current state

The source doc requires 6 assessment blocks before any design or change:

- Sites and users: offices, branches, data centers, VPCs, remote users, contractors, user counts, and the current connectivity model.
- Applications and destinations: SaaS, public apps, private apps, APIs, infrastructure targets, protocols, ports, hostnames, and IP ranges.
- Connectivity: VPN, MPLS, SD-WAN, direct internet breakout, centralized backhaul, site-to-site needs, and the private DNS architecture.
- Security stack: current SWG, NGFW, VPN or ZTNA, DLP, CASB, email security, logging, and compliance requirements.
- Identity: IdP, SCIM or group sync, group naming, multi-IdP needs, service accounts, and contractor or partner access.
- Rollout: pilot users and sites, blast radius, rollback path, support owners, and success criteria (source doc, all 6 blocks).

The identity block has a concrete current-docs anchor: [SCIM provisioning](https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/scim/) is the open standard protocol that lets an identity provider synchronize user identity information with cloud applications, so identities created, edited, or deleted in the IdP update automatically across supported apps after configuration (weight 0.93). Whether that sync is configured is a yes-or-no fact that determines whether group-based policies are possible at all.

## Access and SaaS federation

The source doc asks about app shape, access model, policy needs, and SaaS details. App shape spans web app, API, SSH, RDP, VNC, database, SaaS app, public hostname, private IP, or private hostname, and the skill requires retrieving the [choose an application type](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/choose-application-type/) docs before choosing (source doc). The current docs state that self-hosted applications are the most versatile type and account for the majority of Access deployments, covering any resource where you control where traffic goes: a public website on Cloudflare DNS, a non-web service on a private network connected with a Cloudflare Tunnel, or a Worker (weight 0.95). Access model options in the source doc: clientless browser access, private networking with the device client, peer to peer connectivity, service connections with service tokens or mutual TLS, or SaaS SSO federation (source doc). Policy needs span user groups, device posture, session duration, mTLS, service tokens, and app launcher visibility, with the [Access policy docs](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/) to be retrieved before configuring selectors or evaluation order (source doc). SaaS details to collect: SAML vs OIDC support, ACS and redirect URLs, Entity IDs and client IDs, required attributes, and tenant-control requirements (source doc).

## Tunnel and private networking

The source doc's tunnel prompts: which sites and segments need connectivity; HA posture (dev or test single connector, production multiple connectors, advanced multi-tunnel or site redundancy); where cloudflared or WARP Connector or Mesh will run (VM, container, Kubernetes, bare metal); whether connectors can reach Cloudflare over the required outbound ports, with [connectivity prechecks](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/troubleshoot-tunnels/connectivity-prechecks/) to be retrieved before naming exact endpoints; whether the connector can resolve and reach every private origin; required CIDRs and hostnames, overlapping IP spaces, [virtual networks](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/cloudflared/tunnel-virtual-networks/), [split tunnels](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/configure/route-traffic/split-tunnels/), and private DNS or [resolver policy](https://developers.cloudflare.com/cloudflare-one/traffic-policies/resolver-policies/) needs; and the management model, where the source doc prefers remotely managed token-based tunnels for new deployments unless there is a clear reason for local config.

## Gateway, TLS, and DLP

Prompts here: traffic controls (DNS categories, HTTP URL and path inspection, L4 ports and protocols, egress IP requirements, custom lists, allow and block exceptions), with the [Gateway traffic policy docs](https://developers.cloudflare.com/cloudflare-one/traffic-policies/) to be retrieved for current selectors and order of enforcement (source doc); identity needs, checking [Gateway identity selectors](https://developers.cloudflare.com/cloudflare-one/traffic-policies/identity-selectors/) and [SCIM provisioning](https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/scim/) when groups are involved (source doc); TLS inspection readiness (root CA deployment path, certificate-pinned applications, compliance exceptions, FIPS requirements), retrieving the [TLS decryption docs](https://developers.cloudflare.com/cloudflare-one/traffic-policies/http-policies/tls-decryption/) before enabling (source doc); and DLP readiness (sensitive data types, channels to inspect, DLP profiles, payload logging requirements, false-positive tolerance), retrieving the [DLP docs](https://developers.cloudflare.com/cloudflare-one/data-loss-prevention/) before creating enforcement (source doc).

## CASB, device posture, and risk

The source doc asks: for CASB, the SaaS vendors, admin access level, scan policy, org size, remediation owner, and whether inline protection is also required, retrieving the [manage findings docs](https://developers.cloudflare.com/cloudflare-one/cloud-and-saas-findings/manage-findings/) before recommending remediation; for device posture, the required checks, third-party EDR and MDM integrations, enrollment rules, device profiles, and split tunnel alignment; for risk scoring, relevant behavior signals, false-positive sources such as VPNs or service accounts, and whether risk feeds investigation or enforcement, retrieving the [user risk score docs](https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/risk-score/) before using risk in policies (all source doc).

## Cloudflare WAN and site connectivity

For site connectivity the source doc prompts on site topology, on-ramp type, route ownership, tunnel redundancy, static vs BGP-managed routes, network firewall needs, and appliance or profile ownership, retrieving the [Cloudflare WAN](https://developers.cloudflare.com/cloudflare-wan/) and [Cloudflare Network Firewall](https://developers.cloudflare.com/cloudflare-network-firewall/) docs before proposing changes (source doc).

## Why assessment comes first

A [third-party Zero Trust readiness checklist](https://www.nanosek.com/resources/cloudflare-zero-trust-readiness-checklist) lists the same domains in the same order (weak source, weight 0.09, not load-bearing here), but the source doc's version is the operative one because each prompt is wired to a specific docs surface to retrieve. The skill's rule is that the assessment output is an input contract: every prompt block maps to resources the workflow step 4 will inspect.
