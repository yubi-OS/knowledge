# 04. Telemetry stewardship

Scope: stewardship rules for telemetry in open-source operating systems: default-off, documented collection, auditable content, and where hosted commercial services may collect data without contaminating the OS.

## Default-off is the accepted baseline, and distributions prove it works

Fedora's telemetry change documents the operating rule: metrics uploading is opt-in, and users upgrading from previous versions of Fedora Workstation get opt-in behavior because the project did not yet have a mechanism to ask for consent to data collection after a system upgrade the way it does for fresh installs [1] (weight 0.82). The change went further and required the collected data to be documented publicly before collection starts. This is the canonical shape of a covenant telemetry clause: opt-in by default, collection scope published in advance, and consent collected explicitly.

Canonical's approach drew a similar (if contested) reception: Ubuntu introduced opt-in, open-source telemetry, and coverage argued the model is workable for Linux users precisely because the collection code itself is open source and the user chooses [2] (weight 0.69). The two distribution examples agree on the same two properties: choice and inspectability.

## The opt-out lesson

The inverse case is instructive: a proposal by a Red Hat engineer to add opt-out telemetry to the Fedora desktop caused controversy in the Fedora community [3] (weight 0.25, weak backing). Community discussion of the change pressed exactly the questions a covenant must answer up front: what data will be collected, exactly, and when is the user shown the choice [4] (weight 0.13, weak backing). The lesson is that defaults are policy: opt-out framing converts a diagnostic into a product decision about users rather than a service to them.

## The failure mode: telemetry arriving with a change of stewardship

The Audacity case is the standard cautionary tale. After Muse Group acquired the open-source audio editor in 2021, plans to introduce telemetry triggered widespread community reaction, with users labeling the software spyware and creating forks such as Tenacity; the stewardship then adjusted course in response [5] (weight 0.36, weak backing). A follow-up analysis credits the community reaction with changing the project's trajectory [6] (weight 0.29, weak backing). The generalizable point for a covenant: telemetry commitments must bind future stewards and acquirers, not just the founding team, because the moment stewardship changes is the moment defaults get renegotiated.

## Hosted commercial data is a separate category

Operational data collected by a hosted or managed commercial offering (a fleet dashboard, a support service) is data about the use of a product the customer chose, not telemetry baked into the operating system image. A covenant can permit the former while prohibiting the latter. The distinction matters because the OS image ships to everyone, while the hosted service is an opt-in commercial relationship; conflating them is how default-on telemetry enters an otherwise clean image.

## The user-side principle

Forum sentiment reduces the principle to one line: privacy should be the default and the burden of telemetry problems belongs to the vendor, not the user [7] (weight 0.03, weak backing, forum). Covenants exist to encode exactly that intuition into checkable rules, so it survives leadership changes and commercial pressure.

## Caveats

The two distribution telemetry claims (Fedora change page, ZDNet on Ubuntu) carry the strong backing in this doc. The opt-out controversy, the Audacity narrative, and forum positions are weakly backed and labeled as such; they are used for the pattern, not for precise facts.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://fedoraproject.org/wiki/Changes/Telemetry | 0.82 |
| 2 | https://www.zdnet.com/article/canonicals-ubuntu-telemetry/ | 0.69 |
| 3 | https://fosspost.org/fedora-wants-to-add-telemetry-to-its-linux-distribution/ | 0.25 |
| 4 | https://discussion.fedoraproject.org/t/what-data-will-be-collected-exactly-a-breakout-topic-for-the-f40-change-request-on-privacy-preserving-telemetry-for-fedora-workstation/85417 | 0.13 |
| 5 | https://salivity.github.io/audacity/article/how-muse-group-changed-audacity-s-trajectory | 0.36 |
| 6 | https://salivity.github.io/audacity/article/audacity-telemetry-controversy-explained | 0.29 |
| 7 | https://news.ycombinator.com/item?id=18601889 | 0.03 |
| 8 | https://thetechylife.com/does-audacity-spy-on-you/ | 0.09 |
| 9 | https://en.wikipedia.org/wiki/Criticism_of_Microsoft | 0.43 |
| 10 | https://discussion.fedoraproject.org/t/questions-about-opt-in-telemetry/136727 | 0.16 |
| 11 | https://www.linux.org/pages/download/ | 0.87 |
| 12 | https://www.openevidence.com/ | 0.47 |
