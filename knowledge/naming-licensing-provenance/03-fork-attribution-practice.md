# 03 - Fork attribution practice: keeping upstream licenses and notices intact

Scope: fork naming and upstream attribution practice for forks of existing open-source projects, and the obligation to keep upstream LICENSE and NOTICE files intact.

## The baseline obligation: attribution plus copyleft compliance

Complying with open-source licenses is described in a peer-reviewed practitioner column as a basic activity of any product vendor that ships products containing open source code, with attribution and copyleft as the two most common obligation families (source: https://dirkriehle.com/wp-content/uploads/2025/08/11104202.pdf, weight 0.51). For yubiOS, whose primary repo is LGPL-2.1 and whose org contains forks of bootc, mkosi, bcvk, and firmware projects, that is the operating rule: the forks inherited obligations by using the upstream code, not by choosing them.

Permissive licenses make the floor explicit. The Apache-2.0 entry on Choose a License states that its main conditions are preservation of copyright and license notices, while licensed works, modifications, and larger works may be distributed under different terms and without source code (source: https://choosealicense.com/licenses/apache-2.0/, weight 0.73). The general license index repeats the same shape across families (source: https://choosealicense.com/licenses/, weight 0.80).

## NOTICE files and what must survive a fork

The Apache Software Foundation's own licensing howto (https://apache.org/dev/licensing-howto.html, weight 0.92) is the authoritative reference for how NOTICE files work under Apache-2.0, including which upstream notices must be carried into redistributions. An Apache project's redistribution requirements page makes the practice concrete: redistributions preserve LICENSE and NOTICE content and call out modifications (source: https://portals.apache.org/applications/license.html, weight 0.75). The ASF's main site reiterates the Apache-2.0 grant structure that makes this necessary (source: https://www.apache.org/, weight 0.55).

For copyleft upstreams the boundary rules differ. The GPL-3.0 license text defines what counts as a covered work versus an aggregate (source: https://www.gnu.org/licenses/gpl-3.0.en.html, weight 0.59), and the Software Freedom Law Center's guidance on GPL and non-GPL collaboration lays out how differently licensed components can sit side by side without merging their obligations (source: https://softwarefreedom.org/resources/2007/gpl-non-gpl-collaboration.html, weight 0.77). That structural separation is exactly the pattern yubiOS uses: separate boot components and firmware images combined at boot time rather than statically merged.

## Fork renaming and the ethical layer

Weakly backed community sources fill in the renaming etiquette. A GitHub community discussion advises updating the copyright information in the LICENSE file when creating a new project from forked code (source: https://github.com/orgs/community/discussions/47161, weight 0.24, weak backing). Community threads on Stack Exchange argue that a fork diverging into a competing project should change its name even where the license does not force it (sources: https://softwareengineering.stackexchange.com/questions/230184/do-you-have-to-rename-the-software-when-you-fork-a-repo, weight 0.11, weak backing; https://opensource.stackexchange.com/questions/2013/if-a-project-is-forked-and-its-license-is-changed-which-license-should-be-follo, weight 0.22, weak backing). A weakly backed fork guide says the same in vendor terms: know the license terms before forking, because the forked code carries them (source: https://help.author.envato.com/hc/en-us/articles/360000473263-Guidelines-for-forking-GPL-code, weight 0.13, weak backing).

The strong conclusion the dig supports: upstream LICENSE and NOTICE preservation is a hard requirement for the permissive and Apache-family forks, the GPL boundary rules govern the bootloader forks, and renaming etiquette is community expectation rather than legal obligation. The yubiOS register's framing, that fork-name risk is standard fork-attribution practice rather than a new trademark question, matches what the sources support.

## Sources considered

| URL | Weight | Note |
|---|---|---|
| https://apache.org/dev/licensing-howto.html | 0.92 | ASF licensing howto, NOTICE handling |
| https://choosealicense.com/licenses/ | 0.80 | License index |
| https://softwarefreedom.org/resources/2007/gpl-non-gpl-collaboration.html | 0.77 | SFLC GPL boundary guidance |
| https://choosealicense.com/licenses/apache-2.0/ | 0.73 | Apache-2.0 conditions |
| https://portals.apache.org/applications/license.html | 0.75 | Redistribution requirements |
| https://dirkriehle.com/wp-content/uploads/2025/08/11104202.pdf | 0.51 | Attribution and copyleft obligations |
| https://www.gnu.org/licenses/gpl-3.0.en.html | 0.59 | GPL-3.0 text |
| https://www.apache.org/ | 0.55 | ASF grant structure |
| https://github.com/orgs/community/discussions/47161 | 0.24 | Weak: LICENSE update on fork |
| https://opensource.stackexchange.com/questions/2013/if-a-project-is-forked-and-its-license-is-changed-which-license-should-be-follo | 0.22 | Weak: rename ethics |
| https://help.author.envato.com/hc/en-us/articles/360000473263-Guidelines-for-forking-GPL-code | 0.13 | Weak: fork compliance |
| https://softwareengineering.stackexchange.com/questions/230184/do-you-have-to-rename-the-software-when-you-fork-a-repo | 0.11 | Weak: rename ethics |
| https://en.wikipedia.org/wiki/Open-source_license | 0.10 | Weak: background |
| https://github.com/Rajioba1/managing-software-licensing/blob/main/references/apache-2-redistribution.md | 0.10 | Weak: background |
| https://stackoverflow.com/questions/37781587/what-should-i-note-when-i-want-to-change-apache-license-2-0-code | 0.06 | Weak: background |
| https://softwareengineering.stackexchange.com/questions/277688/if-i-fork-a-project-on-github-that-is-licensed-under-mit-how-do-i-handle-the | 0.09 | Weak: background |
| https://unanswered.io/guide/do-you-need-to-cite-open-source-code | 0.09 | Weak: background |
| https://opensource.stackexchange.com/questions/15581/does-presence-of-a-license-in-source-code-strictly-apply- | 0.04 | Weak: discarded |
| https://git-fork.com/ | 0.11 | Discarded: off-topic product page |
| https://forum.ragezone.com/threads/release-preservation-co-client-source-5065.1272277/ | 0.02 | Discarded: off-topic forum post |
