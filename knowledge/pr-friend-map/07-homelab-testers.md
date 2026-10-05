# 07 Homelab testers: early friends who accept risk when it is named

Scope: recruiting homelab and security owner-operators as early testers of a technical preview, with explicit risk framing, backup and recovery expectations, and a non-daily-driver constraint stated up front.

## Who homelab operators are and what they already do

The homelab audience is well defined by its own literature. A mainstream guide describes a homelab as running servers and services at home for learning and self-hosting, and lays out what getting started involves (https://www.howtogeek.com/what-is-a-homelab-and-how-do-you-start-one/, jev weight 0.7620). The self-hosting practice itself, hosting and managing applications on your own server instead of consuming from SaaS providers, is catalogued community-wide in the awesome-selfhosted list, a large curated index of free software network services (https://github.com/awesome-selfhosted/awesome-selfhosted, jev weight 0.5220). This is an audience that installs operating systems for fun, keeps backups, and reads documentation.

The isolation instinct is already part of the culture, which makes the risk framing of a technical preview land. One personal security lab project describes its purpose as simulating real-world attack and defense scenarios, covering SSH hardening, firewall policy, intrusion prevention, audit logging, and automated threat detection, built in an isolated virtual environment (https://github.com/luvjadey/linux-security-homelab, jev weight 0.4118, weak backing). Another homelab repository states its environment is intentionally minimal, stable, and fully isolated, allowing safe experimentation without external exposure (https://github.com/danielecyber/homelab, jev weight 0.2696, weak backing). A practitioner writeup puts the rationale plainly: a place to generate activity, test detections, break configurations, investigate failures, and learn from mistakes without impacting production systems (https://medium.com/@janbandhuabhinav/i-built-a-cybersecurity-home-lab-from-scratch-heres-what-i-learned-after-20-labs-9693b3bdec46, jev weight 0.1126, weak backing). These are weak-backed citations individually, but they agree with each other and with the strong how-to source above.

## Why the immutable-desktop overlap matters

The same audience follows the immutable Linux conversation. A popular Linux publication surveys immutable distributions and frames immutability as contributing security and reliability (https://itsfoss.com/immutable-linux-distros/, jev weight 0.4488, weak backing). For a project delivered as a bootable container image, this audience already understands the update and rollback model at an intuition level, which lowers the cost of explaining a technical preview.

The engineering practice these testers respect is documented in their own literature too: a guide to self-hosted preview environments describes building dev sandboxes with explicit security boundaries for trusted teams, resource limits, and clear separation (https://eastondev.com/blog/en/posts/dev/20260605-self-hosted-dev-sandboxes-preview-urls/, jev weight 0.4951, weak backing). A technical preview of an OS is the same idea at machine granularity.

## The contribution and the ask

The contribution is a technical-preview setup note that states, without hedging:

1. Exactly which hardware was tested, so nobody generalizes a result the project never claimed.
2. What the backup story is before the first install, including what happens when the unlock key is lost.
3. What recovery looks like when the flow fails, written from the rehearsal, not from aspiration.
4. The explicit statement that this is not a daily-driver recommendation yet.

The ask follows from the note: "would you test this in a non-daily-driver environment?" This is an ask the audience can say yes to safely, because the constraint is built into the question. It also filters for the testers whose feedback matters: people who already run isolated environments and can produce logs.

The gate before this outreach is the Gate 1 evidence page: the preview note must link to reproduced evidence, because this audience tests claims by breaking them. The success signal is hardware offers and logs coming back, not star counts. A tester who reports the exact command that failed on their board has converted curiosity into evidence, which is the only conversion the campaign should optimize for at this stage.
