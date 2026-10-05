# 04 - LGPL-2.1 license fit for a commercial-layer OS project

Scope: what LGPL-2.1 permits and requires when an operating system project wants a commercial layer on top, and the notice and source obligations that come with distribution.

## The license text is the primary source

The GNU project publishes LGPL-2.1 itself at https://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html (weight 0.96), and the later LGPL-3.0 text at https://www.gnu.org/licenses/lgpl-3.0.html (weight 0.98). The LGPL-3.0 text defines the load-bearing structural terms: the "Library" is the covered work, and an "Application" or "Combined Work" is the separately authored program that combines with it. Those definitions are what make a combined commercial product legally possible under an LGPL'd core.

The weakly backed encyclopedic summary agrees on the headline: LGPL lets developers and companies integrate an LGPL component into their own, even proprietary, software (source: https://en.wikipedia.org/wiki/GNU_Lesser_General_Public_License, weight 0.18, weak backing). A weakly backed practitioner page makes the same point from a vendor's experience shipping LGPL FFmpeg builds in commercial software (source: https://medialooks.com/lgpl, weight 0.29, weak backing).

## The commercial layer is permitted, with conditions

Qt's own LGPL obligations page is the strongest vendor-side source in the dig: with the LGPL license option, applications can keep their source code closed as long as all the requirements are met (source: https://www.qt.io/development/open-source-lgpl-obligations, weight 0.85). Qt is a large commercial codebase distributed under LGPL, so its obligations page is direct evidence that the LGPL path supports a commercial layer, not just commentary.

Weakly backed sources describe the requirement set in the same terms the yubiOS register assumed: preserve copyright and license notices, make corresponding source available for distributed LGPL binaries, and keep the LGPL'd component separately modifiable or replaceable. Sources with weak backing only: a law-firm checklist of LGPL requirements for businesses (source: https://batesonlaw.com/lgpl-license-legal-requirements-what-businesses-must-do/, weight 0.19), an SK Telecom guide detailing the notice obligation to keep copyright and license information intact in source redistributions and to mark modifications (source: https://sktelecom.github.io/en/guide/use/obligation/lgpl-3.0/, weight 0.38), and general developer guides (sources: https://uslawexplained.com/lgpl_license, weight 0.10; https://uslawexplained.com/lgpl, weight 0.11, both weak).

## What the dig could not settle

The dig did not surface a primary source resolving the combined-work boundary questions yubiOS actually faces, such as whether the replaceable-component requirement is satisfied by an image-based OS composition where the LGPL core ships as a separately bootable component. Stack Exchange threads on exactly this question carry weak weights only (source: https://opensource.stackexchange.com/questions/14227/right-to-modify-proprietary-software-linked-to-lgplv2-1-licensed-library, weight 0.08, weak backing; https://softwareengineering.stackexchange.com/questions/47323/can-i-use-an-lgpl-licenced-library-in-my-commercial-app, weight 0.03, weak backing). The honest reading: the register's assumption that LGPL-2.1 permits the commercial boundary described in the operating covenant is consistent with the strong sources (gnu.org license texts, Qt obligations page), but the specific application to yubiOS's image structure remains a flagged decision for counsel, not a settled fact.

## Distribution obligations baseline

What is solidly grounded: the LGPL license texts at gnu.org (weights 0.96 and 0.98) are the authoritative statement of obligations, and the weakly backed secondary sources converge on notice preservation plus source availability for distributed binaries. Before the docker.io/0mniteck/yubios distribution channel carries more weight, a NOTICE-equivalent pointing back to yubi-OS/yubiOS and each fork's repo should be confirmed to exist, exactly as the register recommends without asserting it is done.

## Sources considered

| URL | Weight | Note |
|---|---|---|
| https://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html | 0.96 | LGPL-2.1 license text (primary) |
| https://www.gnu.org/licenses/lgpl-3.0.html | 0.98 | LGPL-3.0 text, combined work definitions (primary) |
| https://www.qt.io/development/open-source-lgpl-obligations | 0.85 | Vendor obligations page, commercial LGPL in practice |
| https://sktelecom.github.io/en/guide/use/obligation/lgpl-3.0/ | 0.38 | Weak: notice obligations guide |
| https://medialooks.com/lgpl | 0.29 | Weak: vendor compliance experience |
| https://batesonlaw.com/lgpl-license-legal-requirements-what-businesses-must-do/ | 0.19 | Weak: requirements checklist |
| https://en.wikipedia.org/wiki/GNU_Lesser_General_Public_License | 0.18 | Weak: background |
| https://uslawexplained.com/lgpl_license | 0.10 | Weak: background |
| https://uslawexplained.com/lgpl | 0.11 | Weak: background |
| https://opensource.stackexchange.com/questions/14227/right-to-modify-proprietary-software-linked-to-lgplv2-1-licensed-library | 0.08 | Weak: unresolved boundary question |
| https://softwareengineering.stackexchange.com/questions/47323/can-i-use-an-lgpl-licenced-library-in-my-commercial-app | 0.03 | Weak: background |
