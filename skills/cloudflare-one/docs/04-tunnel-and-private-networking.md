# 04 - Tunnel and Private Networking

Scope: cloudflared connectors and their HA model, remotely managed tunnels, virtual networks, private DNS, the off-ramp/on-ramp distinction between Tunnel, Mesh, and Cloudflare WAN, and the private networking guardrails that decide where connectivity actually breaks.

Grounding spine: source doc `yubi-OS/yubiOS skills/cloudflare-one/SKILL.md`.

## Connectors and high availability

The source doc's assessment asks which data centers, VPCs, offices, or network segments need connectivity, what HA posture is required (dev or test single connector, production multiple connectors, advanced multi-tunnel or site redundancy), and where cloudflared or WARP Connector or Mesh will run: VM, container, Kubernetes, bare metal, or other (source doc). The current docs back the production posture: [tunnel availability and failover](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-availability/) recommends deploying multiple cloudflared replicas for high availability and automatic failover across infrastructure (weight 0.95). The source doc repeats it as a guardrail: run multiple cloudflared connectors for production HA, preferably on separate hosts, and treat token-based remotely managed tunnels as the default for new deployments (source doc).

Remotely managed tunnels run on a token: the [tunnel tokens docs](https://developers.cloudflare.com/tunnel/reference/tunnel-tokens/) state that a remotely-managed tunnel only requires a token to run, and that anyone with the token can run the tunnel (weight 0.92). That property makes the token a secret with operational consequences, and the [tunnel permissions docs](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/remote-tunnel-permissions/) recommend rotating the tunnel token at a regular cadence to reduce the risk of compromise, noting rotation can happen with minimal disruption to users as long as the tunnel is served by at least 2 cloudflared replicas (weight 0.94). This is the dig confirming the source doc's preference for token-based tunnels: the token IS the deployment unit.

Egress is a precheck, not an afterthought: the source doc requires retrieving the [connectivity prechecks](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/troubleshoot-tunnels/connectivity-prechecks/) docs before naming exact endpoints, because whether connectors can reach Cloudflare over the required outbound ports and protocols decides feasibility before any config exists (source doc).

## Off-ramps and on-ramps

The source doc draws a directional distinction (source doc):

- Cloudflare Tunnel is an off-ramp from a private network to Cloudflare.
- Cloudflare WAN and Mesh are other off-ramps which can also be on-ramps.

Both Cloudflare Tunnel and Cloudflare Mesh can facilitate connectivity to internal networks; Cloudflare WAN can as well but is gated behind Enterprise subscriptions. The skill requires retrieving the [choose an on-ramp](https://developers.cloudflare.com/learning-paths/secure-internet-traffic/connect-devices-networks/choose-on-ramp/) learning path when deliberating between tunnel types (source doc).

## Virtual networks

The source doc's guardrail: use virtual networks primarily when IP subnets overlap and hostname-based routing is not used. They can control other user connectivity behavior, but the recommendation is to manage that through security policies instead (source doc). The current docs describe what they are: [virtual networks](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/cloudflared/tunnel-virtual-networks/) provide routing isolation within a Cloudflare account, each maintaining its own routing table to separate traffic between environments, partners, or applications (weight 0.92). The link between the 2 texts is exact: routing isolation is the mechanism; overlapping IP space is the reason to reach for it.

## Private DNS and routing

Private hostnames need explicit DNS routing and resolution; creating an Access app alone is not enough (source doc). The docs agree and operationalize it: to resolve private DNS queries, connect the private network with a Cloudflare Tunnel, verify under Networking routes that the IP address of the internal DNS resolver is included in the tunnel, and ensure split tunnels are configured to include traffic to private IPs and hostnames ([private DNS](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/cloudflared/private-dns/), weight 0.93). The source doc also points at resolver policies ([traffic policies, resolver policies](https://developers.cloudflare.com/cloudflare-one/traffic-policies/resolver-policies/)) and the connect-private-hostname guide as the surfaces to retrieve (source doc).

## The connectivity guardrails that cause most failures

The source doc's private networking section names 3 failure modes (source doc):

1. A healthy tunnel only proves cloudflared can reach Cloudflare. The tunnel must also have appropriate published application routes, network routes, or hostname routes for connectivity to function. Tunnel health is necessary, not sufficient.
2. Split tunnel mode changes the meaning of every route decision: in Exclude mode, traffic goes to Cloudflare when removed from excludes; in Include mode, traffic goes to Cloudflare only when added to includes.
3. Split tunnel entries must align with tunnel routes bidirectionally. A CIDR in the include list without a matching tunnel route causes a black hole; a tunnel route without a matching device profile entry means traffic never enters the tunnel.

Corroboration for the multi-connector pattern outside the primary docs is mixed and weighted accordingly: an [ingress controller HA guide](https://tunnel.strrl.dev/how-to/high-availability/) describes multiple controller and cloudflared replicas (weight 0.13), and a [community thread](https://community.cloudflare.com/t/one-tunnel-for-multiple-servers-with-different-services/496345) describes running cloudflared more than once with the same token as the HA mode (weight 0.09). Both are weak-backing only; the load-bearing sources are the developers.cloudflare.com pages above and the source doc.
