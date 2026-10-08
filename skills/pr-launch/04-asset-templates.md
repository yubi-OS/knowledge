# 04 - Asset Templates: The 6 Launch Assets

**Scope:** The asset templates the pr-launch skill ships (Show HN post, r/netsec seed post, r/privacy seed post, press pitch, social thread), their structural rules, and what external guidance says about the same formats.

Ground spine: the source doc, yubi-OS/yubiOS skills/pr-launch/SKILL.md, sections "Asset Templates" and "Output Artifacts". Claims from digs carry their URL and jev noul weight.

## The asset set

Phase 0 of the source doc prescribes 6 assets before launch day (source doc): a Show HN post (technical, links to the repo), a Reddit seed post for r/netsec and r/linux (technical), a Reddit seed post for r/privacy (general), a 1-paragraph press pitch (Phoronix, LWN, Ars Technica), and a 3-post social thread. The output-artifacts section fixes the file paths: documents/pr/assets/hn-post.md, reddit-netsec.md, reddit-privacy.md, press-pitch.md, social-thread.md (source doc, see doc 07).

## Show HN post structure

The source doc's template has 5 parts (source doc):

1. Title in the "Show HN: <name> - <one-line claim with the differentiator>" format.
2. The repo URL as the first line.
3. A short framing paragraph that names the failure of the default (TPM is OEM-controlled, absent on ARM, a black box) and why the alternative mechanism fits.
4. A 4-item bullet list mapping each integration point to its interface (PIV/CCID for Secure Boot key custody, FIDO2 via systemd-cryptenroll for disk encryption, pam-u2f >= 1.3.1 for app auth with the CVE floor named, resident ed25519-sk for SSH).
5. Design lineage (bootc, ParticleOS) plus the ADR claim, and an offer: "Happy to answer questions about..."

The official HN guidelines define what Show HN is for: "something you've made that other people can play with" (https://news.ycombinator.com/showhn.html, weight 0.74). Practitioner guides, weakly sourced, converge on honesty and specificity: "focus on honesty and specificity in your post. Clearly describe what was built, acknowledge a genuine limitation, and avoid promotional language" (https://startkitz.com/blog/show-hn-tips-how-to-write, weight 0.12, weak backing). What gets flagged is covered by favors.dev: titles that read as marketing and solicited upvotes are the flagged patterns (https://favors.dev/blog/show-hn-launch-guide, weight 0.10, weak backing), which matches the source doc's banned-word rule.

## Subreddit seed posts differ by audience

The r/netsec template (technical) leads with a descriptive title, a full write-up link, the motivation (TPM absent on Snapdragon ARM64, vendor-locked, or untrusted in corporate MDM scenarios), and a numbered 4-step security chain, each step naming its exact mechanism (PIV slot 9c signing the UKI via sbsign --engine pkcs11, LUKS2 unlock bound to the FIDO2 credential, pam-u2f with the CVE floor, resident ed25519-sk). It also documents the FIDO2/hidraw versus PIV/CCID distinction and points to ADR-002 (source doc).

The r/privacy template (general) leads with a first-person story title, uses emoji bullets for the 4 capabilities, states the no-TPM and works-on-regular-hardware claims, and closes with the onboarding promise: "you don't need to already understand FIDO2" (source doc).

Same repo, same 4 capabilities, 2 different abstractions. The structure rule: technical assets cite interfaces and ADRs, general assets cite outcomes and onboarding (source doc).

## Press pitch structure

The source doc's press pitch is one paragraph plus a why-now paragraph and a closing offer (source doc):

- Subject line: "yubios: open-source bootable Linux using YubiKey as full hardware root of trust" - the news, stated flatly.
- Greeting by name, "Quick tip - might interest your readers," then a 1-paragraph summary covering the full chain and "No OEM trust anchor required."
- A why-now paragraph: ARM64 hardware often lacks a usable TPM, and enterprise YubiKey deployments are ubiquitous while distributions treat the keys as 2FA-only.
- GitHub link, an offer to answer technical questions or provide a briefing, and the ADR proof point.
- Signature from a named human.

External pitch guidance, weakly sourced, sets word budgets the source doc's template already meets: "a media pitch email that gets a response is short (under 200 words), addressed to one specific journalist by name, leads with a concrete story hook" (https://obapr.com/resources/media-pitch-email-templates-25-real-examples-that-get-responses-2026/, weight 0.18, weak backing); "a good media pitch is a personal email under 150 words: a subject line that states the news, a first line that shows you know the..." outlet (https://www.presspilot.io/guides/media-pitch-examples, weight 0.19, weak backing). The slicedbrand template collection covers the same format from the agency side (https://slicedbrand.com/insights/posts/tech-pr-pitch-templates-proven-email-formats-that-get-journalists-to-respond, weight 0.25, weak backing). LinkedIn's guide frames the story-hook pattern with concrete subject-line examples (https://www.linkedin.com/top-content/writing/writing-for-public-relations-campaigns/how-to-write-a-press-pitch-for-startups/, weight 0.23, weak backing).

## Social thread structure

The source doc names a 3-post social summary thread but, unlike the other assets, ships no verbatim template (source doc). The implied structure from the rest of the skill: one post per audience story beat (technical differentiator, general outcome, link), consistent with the bifurcated-messaging rule that the same project tells 2 stories (doc 01). When authoring this asset, draft it as 3 posts, each self-contained, no hashtag stuffing, no banned words.

## Verification

The pre-launch checklist requires all 4 community posts drafted and reviewed, the press pitch drafted, and the social thread drafted before launch day (source doc). A drafted-but-unreviewed asset is not a passed gate; the checklist treats review as its own step.
