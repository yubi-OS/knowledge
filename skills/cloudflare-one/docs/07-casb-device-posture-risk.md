# 07 - CASB, Device Posture, and Risk

Scope: CASB scanning and remediation, device posture checks and integrations, and user risk scoring: what each provides, what it does not, and the operational cautions the skill attaches to each.

Grounding spine: source doc `yubi-OS/yubiOS skills/cloudflare-one/SKILL.md`.

## CASB: out-of-band, not inline

The source doc's sharpest correction: API CASB is out-of-band and periodic. It does not provide real-time inline enforcement, although some integrations support remediation; use Gateway granular application controls for inline CASB capability in supported applications, retrieving the [granular application controls](https://developers.cloudflare.com/cloudflare-one/traffic-policies/http-policies/granular-controls/) docs when creating security policies for specific actions in specific SaaS applications (source doc).

What CASB actually does: when a third-party SaaS application or cloud environment is integrated with Cloudflare CASB, CASB makes API calls to its endpoints and reads relevant data on the customer's behalf, with read-only permissions that follow the least-privileged model, only the minimum access required to perform a scan ([Cloud and SaaS findings](https://developers.cloudflare.com/cloudflare-one/cloud-and-saas-findings/), weight 0.9). The product framing confirms the scan model: simple API integrations continuously scan environments for vulnerabilities and potential risks to manage posture and secure data at rest ([Cloudflare CASB product page](https://www.cloudflare.com/sase/products/casb/), weight 0.65).

## Findings and remediation

[Findings](https://developers.cloudflare.com/cloudflare-one/cloud-and-saas-findings/manage-findings/) are security issues detected within SaaS and cloud applications involving users, data at rest (files stored in the apps), and other configuration settings; with Cloudflare CASB you review the findings list in Cloudflare One and take action on the issues found (weight 0.93). The source doc adds the operating discipline: findings are tied to specific assets and instances, so drill into affected assets before recommending remediation; use current dashboard remediation guidance for CASB fixes; and most remediations happen in the SaaS admin console, not Cloudflare (source doc).

Two timing cautions from the source doc: large SaaS integrations can take 24 to 48 hours for initial scans, and reauthorizing can restart scan state, so check credential health before reconnecting (source doc).

## Device posture

The source doc's assessment asks for the required checks, third-party EDR and MDM integrations, enrollment rules, device profiles, and split tunnel alignment (source doc). The integration mechanics are documented: a [custom device posture integration](https://developers.cloudflare.com/cloudflare-one/integrations/service-providers/custom/) is built by testing that Cloudflare can authenticate to the API URL with the provided Access credentials, then configuring a device posture check that decides whether a given posture score constitutes a pass or fail (weight 0.95). A service-provider example is the [SentinelOne posture integration](https://cloudflare-docs.justalittlebyte.ovh/cloudflare-one/identity/devices/service-providers/sentinelone/), where the WARP client reads endpoint data from SentinelOne (weight 0.08, weak source; treated as an example pointer only, not load-bearing).

## User risk score

Risk scoring in Zero Trust assigns users a score of Low, Medium, or High based on detections of user activity, posture, and settings ([user risk score, Zero Trust insights](https://developers.cloudflare.com/cloudflare-one/insights/risk-score/), weight 0.92). In Access, users with a High risk score can be blocked while users with Low or Medium scores access the application ([user risk score, Cloudflare One](https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/risk-score/), weight 0.93).

The source doc's cautions: user risk scores are behavior-based and asynchronous; CASB findings do not automatically imply high user risk (source doc). Before using risk in policies, retrieve the user risk score docs, and assess false-positive sources such as VPNs and service accounts, plus whether risk feeds investigation or enforcement (source doc).

Third-party posture signal context: a [Cloudflare blog post](https://blog.cloudflare.com/unified-risk-posture/) describes integrating with CrowdStrike Falcon to enforce policies based on the Falcon Zero Trust Assessment score, delivering continuous real-time security posture assessments across endpoints regardless of location, network, or user (weight 0.51, moderate; a blog, not docs, but directly on-topic).

## How the 3 systems connect

The skill treats these as 3 separate evidence systems with different clocks (source doc):

| System | Mode | Latency |
|---|---|---|
| CASB | Out-of-band periodic API scans | Initial scans up to 24 to 48 hours for large integrations |
| Device posture | Checked at connection time via the device client | Real-time at enrollment and reconnection |
| User risk | Behavior-based, asynchronous | Score updates lag the behavior |

The assessment questions encode the connections: split tunnel alignment belongs to device posture; inline protection belongs to Gateway, not CASB; enforcement readiness belongs to risk scoring, not finding volume. The validation prompt closes the loop: confirm integration health, credential expiry, asset discovery, scan timing, finding instances, and risk-score signal latency before declaring remediation complete (source doc).
