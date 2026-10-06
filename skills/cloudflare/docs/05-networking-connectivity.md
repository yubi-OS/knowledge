# 05 Networking and connectivity

Scope: the "I need networking/connectivity" decision tree from the source doc: Cloudflare Tunnel, Spectrum, TURN, Network Interconnect, Argo Smart Routing, Workers VPC, and smart placement.

## The tree as the source doc states it

The source doc (yubi-OS/yubiOS skills/cloudflare/SKILL.md) routes connectivity by what needs to reach what:

- Expose local service to the internet: tunnel/
- TCP or UDP proxy for non-HTTP: spectrum/
- WebRTC TURN server: turn/
- Private network connectivity: network-interconnect/
- Optimize routing: argo-smart-routing/
- Optimize latency to backend, not user: smart-placement/
- Real-time video and audio: realtimekit/ or realtime-sfu/

The rows split along two axes: direction of exposure (publish an internal service, or reach a private service from Workers) and the layer being optimized (routing path versus protocol proxy versus latency to backend).

## Tunnel and Spectrum, doc-confirmed

The Spectrum docs (weight 0.94, https://developers.cloudflare.com/spectrum/, updated 2026-04-23) define the product as proxying and protecting TCP and UDP applications. The tunnel integrations docs (weight 0.94, https://developers.cloudflare.com/tunnel/integrations/, updated 2026-09-11) add the composition rule the tree does not state: Spectrum extends DDoS protection and traffic acceleration to non-HTTP protocols, and you can route Spectrum application traffic to origins connected via Tunnel using a DNS CNAME record or Load Balancer, but Spectrum integration with Tunnel is only supported for HTTP and HTTPS applications. That last clause is a real boundary: the non-HTTP strength of Spectrum and the Tunnel origin-hiding mechanism do not compose for TCP-only services.

The product page (weight 0.56, https://www.cloudflare.com/products/spectrum/) adds that Spectrum integrates with Argo Smart Routing and Load Balancing for automatic failover, and the application-services page (weight 0.58, https://www.cloudflare.com/application-services/products/cloudflare-spectrum/) states the network scale as 335 locations worldwide.

## Argo Smart Routing

The Argo docs (weight 0.96, https://developers.cloudflare.com/argo-smart-routing/, updated 2026-08-25) state the mechanism: Argo Smart Routing detects real-time network issues and routes web traffic across the most efficient network path, avoiding congestion, which yields faster loading, increased reliability, and reduced costs, with benefits most apparent for users farthest from the origin server. The get-started docs (weight 0.96, https://developers.cloudflare.com/argo-smart-routing/get-started/, updated 2026-05-05) note that this behavior allows Cloudflare to deliver content from data centers closest to the visitor, and the product page (weight 0.55, https://www.cloudflare.com/application-services/products/argo-smart-routing/) confirms the accelerate-by-avoiding-congestion framing. The Argo 2.0 engineering post (weight 0.87, https://blog.cloudflare.com/argo-v2/) is the deeper history and also connects the tree's two other rows in one example: a financial employee connects to Cloudflare in New York, and requests are routed to a data center connected to Cloudflare through a Cloudflare Network Interconnect attached to Cloudflare in Singapore.

## Workers VPC

Workers VPC is the newest row and the dig reaches it well. The overview docs (weight 0.92, https://developers.cloudflare.com/workers-vpc/, updated 2026-09-18) define it: securely connect your private cloud to Cloudflare to build cross-cloud apps; Workers VPC allows you to connect your Workers to your private APIs, services, and databases in external clouds (AWS, Azure, GCP, on-premise, and others) that are not accessible from the public Internet. The mesh example docs (weight 0.93, https://developers.cloudflare.com/workers-vpc/examples/connect-to-cloudflare-mesh/, updated 2026-09-16) show the lightest path: a VPC Network binding with Cloudflare Mesh (formerly WARP Connector) connects a Worker to any private service in the account without pre-registering individual hosts or specifying a Cloudflare Tunnel UUID. This matters for routing decisions: Workers VPC is the row for Workers reaching private backends, while Tunnel is the row for publishing an internal service outward, and the two can describe the same private network from opposite directions.

## Weak and thin coverage, labeled

The dashboard community post about the Network Overview page (weight 0.10, https://community.cloudflare.com/t/cloudflare-fundamentals-network-overview-page-in-the-dashboard/922778) is weak. The third-party Spectrum explainer (weight 0.11, https://stackharbor.com/en/knowledge-base/cf-spectrum-non-http-tcp-udp/) lists proxying SSH, RDP, game servers, and custom protocols behind the anycast edge while hiding the origin IP; weak weight, orientation only.

The dig returned no high-weight source for TURN, Network Interconnect specifics, or the realtimekit rows; those rows rest on the source doc's routing alone, and any numeric or API claim about them must go through the retrieval channels described in doc 01 before being used.
