# 06 - Attack surface defaults

**Scope:** Network defaults that keep the deception LAN attack surface minimal: WireGuard-zone-only listening, no WAN bind, no redirect of the real SSH endpoint, owner break-glass path.

## The 4 defaults

The prototype's network defaults are inherited unchanged from the 2026-07-17 proof plan, and multi-host does not relax any of them; each host still enforces them independently:

1. Decoy listeners bind only inside the WireGuard zone.
2. No WAN bind: nothing in the deception LAN is reachable from the internet side.
3. No redirect of the real SSH endpoint: firewall rules never steer traffic meant for the real service into the decoy pool or vice versa.
4. A separate owner break-glass path so management access survives decoy misbehavior.

The isolation rationale is well documented in honeypot practice. Isolation guidance describes honeypot containment as a layered architecture where network segmentation, firewall policy, one-way logging, authentication separation, and decoy data all play a role, rather than a single configuration choice (source: https://danharkey.com/posts/honeypot-isolation-best-practices-to-contain-risk-and-capture-threat-intelligence, jev weight 1.0). The same source enumerates the controls that keep attackers contained so they gain nothing while the defender gains intelligence (source: https://www.danharkey.com/posts/honeypot-isolation-controls-that-keep-attackers-contained, jev weight 1.0).

## Why zone-only listening matters

Placing a honeypot where it can be monitored from a distance while attackers access it, without exposing the main network, is the standard placement advice: honeypots are commonly put in a DMZ or outside the external firewall precisely so the production network is not adjacent to the bait (source: https://www.techtarget.com/cybersecurity/definition/What-is-a-honeypot-How-it-protects-against-cyberattacks, jev weight 1.0). The WireGuard zone plays the DMZ role in the prototype, with one important improvement over an internet-facing DMZ: the decoy surface is reachable only through authenticated mesh peers, so the population touching it is bounded and known to the owner.

SSH honeypot studies reinforce the exposure-minimization principle. One study exposed only a modified SSH service, kept the rest of the host locked down, and reported that none of the honeypots were compromised during the study, attributing the safety to the lack of root access and a nologin shell (source: https://steve-parker.org/articles/ssh-honeypot/, jev weight 1.0). Cloud SSH honeypot projects deliberately expose an SSH endpoint to observe brute-force and reconnaissance behavior, and treat the exposure boundary itself as the design object (source: https://github.com/Srakawichi/cloud-ssh-honeypot, jev weight 1.0). The prototype makes the same boundary explicit: the WireGuard-zone-only default is the firewall statement of "this is where attackers are allowed to be."

## The non-negotiables

2 of the 4 defaults exist to protect the real endpoint rather than to lure anyone:

- No redirect of the real SSH endpoint. A misconfigured port-forward or traffic rule that sends real admin traffic into the decoy pool would let the owner lock themselves out, and a rule that sends attacker traffic toward the real service would invert the whole design. The proof plan's firewall file exists to make both mistakes structurally impossible.
- Owner break-glass path. If every decoy host misbehaves at once, the owner must still have a path to real management that does not traverse the deception layer. This is the human-side version of the fail-safe rule in doc 09.

The OpenSSH project's own framing of SSH as the encrypted remote-login tool that eliminates eavesdropping (source: https://www.openssh.org/, jev weight 1.0) is the reminder of what is being protected: the real endpoint's confidentiality and availability are the assets; the decoys are disposable by design.

## Design conclusion

Attack surface minimization is the prototype's first-order invariant, ranked above decoy realism. Every other design decision (tarpit backend, pool planning, coordination model) is subordinate to the rule that the deception LAN can never increase what an attacker can reach on the real network. Doc 07's evidence plan includes the firewall-view check that verifies the defaults held after deployment.
