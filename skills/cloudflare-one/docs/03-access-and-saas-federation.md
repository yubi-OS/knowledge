# 03 - Access and SaaS Federation

Scope: Cloudflare Access application shapes, the access models the skill routes between, Access policy mechanics, and the identity and access guardrails that separate what Access controls from what Gateway and SaaS apps control.

Grounding spine: source doc `yubi-OS/yubiOS skills/cloudflare-one/SKILL.md`.

## Application shapes and access models

The source doc's assessment for Access asks the app shape first: web app, API, SSH, RDP, VNC, database, SaaS app, public hostname, private IP, or private hostname, and requires retrieving the [choose an application type](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/choose-application-type/) docs before choosing (source doc). The current docs confirm the shape taxonomy is real and hierarchical: self-hosted apps are the most versatile type, representing any resource where you control where traffic goes, whether a public website on Cloudflare DNS, a non-web service on a private network behind a Cloudflare Tunnel, or a Worker (weight 0.95).

The source doc then routes the ask into one of 5 access models (source doc):

1. Clientless browser access.
2. Private networking with the device client.
3. Peer to peer connectivity.
4. Service connections with service tokens or mutual TLS.
5. SaaS SSO federation.

The pairing rule that follows: Access controls application authorization; Gateway controls traffic inspection and filtering, and both are used when the requirement spans identity-aware app access and network or web security (source doc). A public hostname Access app can be clientless; a private destination app requires WARP or another network on-ramp plus routes and DNS resolution, and the [self-hosted private app docs](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/non-http/self-hosted-private-app/) must be retrieved before configuring private destinations (source doc).

## Policy mechanics

Access policies are built from rules with selectors. The current [Access policies docs](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/) state that the criteria or attributes users must meet are available for all Access application types, including SaaS, self-hosted, and non-HTTP applications (weight 0.95). The source doc requires retrieving those docs before configuring selectors or evaluation order, and lists the policy knobs: user groups, device posture, session duration, mTLS, service tokens, and app launcher visibility (source doc). For custom evaluation, [External Evaluation rules](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/external-evaluation/) let Access Allow or Block policies evaluate the user against an external endpoint, checking that the outgoing JWT was signed by the configured Keys URL, has not expired, the API returns success true, and the nonce is unchanged and unique per request (weight 0.94).

Two hard semantics from the source doc:

- Access policies are default-deny. A private app with routes but no Allow policy still blocks access.
- Access policy selectors can use IP lists, but not Gateway domain or URL lists.

## Identity and access guardrails

The source doc's identity section is the densest set of distinctions in the skill:

- Access Groups are Cloudflare objects; IdP and SCIM groups are identity claims. Gateway group selectors use synced IdP groups, not Access Groups (source doc). The SCIM mechanism behind this is documented: after configuring [SCIM provisioning](https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/scim/), identities created, edited, or deleted in the identity provider update automatically across supported applications (weight 0.93).
- Group names and SAML or OIDC attributes are case-sensitive. Verify exact claim names and values before creating group-based rules (source doc).
- SCIM changes and group membership can be stale until sync and re-authentication complete; troubleshoot with the user's last authenticated identity, not just the IdP state (source doc).
- If group sync is missing, do not invent group selectors (source doc).

## SaaS federation

SaaS applications in Access get an additional authentication layer: when a SaaS app integrates with Access, users log in to the application through Access as an IdP first (weight 0.94, [SaaS applications](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/saas-apps/)). Access supports both SAML and OIDC SaaS apps; the [generic SAML instructions](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/saas-apps/generic-saml-saas/) describe the SAML flow, and note that by default Access sends the user's email address as the SAML NameID, customizable via the name_id_transform_jsonata field on the SaaS application through the Access applications API (weight 0.94). The design history is on the [Cloudflare blog](https://blog.cloudflare.com/cloudflare-access-for-saas/): the Access login flow runs on Cloudflare Workers, and Workers convert the JWT content into SAML assertions sent to the SaaS app, so the application sees Cloudflare Access as its identity provider while Access aggregates identity signals from the customer's SSO provider (weight 0.65).

The boundary the source doc draws: SaaS federation handles authentication into the SaaS app. SaaS authorization and tenant restrictions usually require SaaS-side roles and/or Gateway tenant controls (source doc).

## Browser capabilities, not conflated

The source doc repeats this guardrail twice, which makes it load-bearing: Browser Rendering for SSH, RDP, and VNC is an Access capability; Browser Isolation renders general web content remotely. Do not conflate them (source doc).

Weak-backing note: aggregator mirrors of these pages ([justalittlebyte mirror](https://cloudflare-docs.justalittlebyte.ovh/cloudflare-one/applications/configure-apps/saas-apps/generic-saml-saas/), weight 0.1; [tutorial site](https://tutorials.dodatech.com/cloudflare/access-oidc-saml/), weight 0.11) were collected but every claim above rests on the primary developers.cloudflare.com pages or the source doc.
