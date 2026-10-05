# 01 Amutable Company Profile

Scope: the founding, leadership, location, and mission of Amutable, the company behind the current systemd vision, plus its public engineering footprint.

## Founding announcement

Amutable was announced in late January 2026. Phoronix reported on 2026-01-27 that systemd founder and lead developer Lennart Poettering announced the creation of a new company called Amutable (source: https://www.phoronix.com/news/Amutable, jev 0.66). The Register covered the story two days later on 2026-01-29, reporting that Poettering left Microsoft and co-founded the company with Chris Kuhl and Christian Brauner (source: https://www.theregister.com/software/2026/01/29/systemd-daddy-departs-microsoft-for-linux-startup/4437009, jev 0.68). It's FOSS added 2026-01-30 that the company operates out of Berlin, Germany (source: https://itsfoss.com/news/amutable-linux-security/, jev 0.29, low weight). Slashdot's aggregation carried the additional detail that Poettering will continue to remain deeply involved in the systemd ecosystem (source: https://linux.slashdot.org/story/26/01/30/235231/author-of-systemd-quits-microsoft-to-prove-linux-can-be-trusted, jev 0.25, low weight).

## Leadership

The leadership trio is consistent across sources: Chris Kuhl as CEO, Christian Brauner as CTO, and Lennart Poettering as Chief Engineer (source: https://www.phoronix.com/news/Amutable, jev 0.66; https://itsfoss.com/news/amutable-linux-security/, jev 0.29). The company's own About page describes the executive team as Christian Brauner, maintainer of the VFS subsystem in Linux, and Chris Kuhl, former founder and CEO of Kinvolk, acquired by Microsoft, alongside Lennart Poettering (source: https://amutable.com/about, jev 0.23, low weight). The About page is the primary source for those individual bios but received a low jev weight, so treat the role descriptions as company self-description rather than independently verified fact.

## Mission

The company mission is to deliver determinism and verifiable integrity to Linux workloads everywhere (source: https://www.phoronix.com/news/Amutable, jev 0.66). The LinkedIn company page phrases the same goal as "bringing determinism and verifiable integrity to Linux systems" with 1130 followers at collection time (source: https://www.linkedin.com/company/amutable/, jev 0.35, low weight). The positioning places the company in the Linux security and OS-integrity space, embedding verification directly into the system rather than bolting it on afterward (source: https://malwaretips.com/threads/systemd-creator-quits-microsoft-to-form-his-own-linux-focused-start-up.139394/, jev 0.03, low weight, forum).

## Public engineering footprint

Amutable maintains its own site with a company blog; the post "Amutable: A New Secure Foundation" leads with runtime integrity as the product thesis (source: https://amutable.com/, jev 0.37, low weight). The site also lists upcoming conference appearances, including Lennart Poettering, Michael Vogt, and Daan De Meyer speaking at All Systems Go! in Berlin, Germany on 2026-10-01 (source: https://amutable.com/, jev 0.59).

Poettering's All Systems Go! 2026 talk is titled "Provisioning and Deployment Mechanisms in systemd" and covers systemd-sysinstall, systemd-sysupdate, credentials, and related tooling for provisioning and deploying operating systems (source: https://cfp.all-systems-go.io/all-systems-go-2026/speaker/UNJXNH/, jev 0.59; video: https://media.ccc.de/v/all-systems-go-2026-434-provisioning-and-deployment-mechanisms-in-systemd, jev 0.81). This is the clearest public signal of what the company is building on: the deployment stack Poettering has spent the last years assembling in systemd itself.

## Relevance to image-based immutable Linux

The founding matters for image-based OS work for two reasons. First, the people who set the direction for systemd (Poettering) and the kernel VFS (Brauner) are now commercially focused on the same integrity goals that image-based distributions depend on (source: https://www.theregister.com/software/2026/01/29/systemd-daddy-departs-microsoft-for-linux-startup/4437009, jev 0.68). Second, the mission statement maps directly onto the systemd mechanisms the vision rests on: determinism corresponds to image-based, reproducible OS builds, and verifiable integrity corresponds to signed, verity-protected images and measured boot (source: https://www.phoronix.com/news/Amutable, jev 0.66; https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## Gaps

No independent funding, headcount, or product-launch reporting surfaced in the dig beyond the founding coverage; David Strauss's CPO role is asserted in the parent source material but did not appear in any collected result, so it is recorded here as unverified rather than stated as fact.
