# 03 - The Charts section as a record of assets

Scope: the 4 image assets the source doc embeds, where they live, and what their hosting arrangement records. Internal-record subtopic, no dig.

## The inventory

The doc embeds 4 images, all served from the yubi-OS/assets repository (source doc, from the embedded URLs):

1. [Y_3^3/Duck-Y33-5-ai-image-2026-08-07-03-10.jpeg](https://raw.githubusercontent.com/yubi-OS/assets/refs/heads/main/Y_3%5E3/Duck-Y33-5-ai-image-2026-08-07-03-10.jpeg), the section header image, at 50% width.
2. [Learned_Latent_Curve.jpeg](https://raw.githubusercontent.com/yubi-OS/assets/refs/heads/main/Learned_Latent_Curve.jpeg), first chart in the Charts section.
3. [Latent_Space_Learning.jpeg](https://raw.githubusercontent.com/yubi-OS/assets/refs/heads/main/Latent_Space_Learning.jpeg), second chart in the Charts section.
4. [Y_3^3/image-2.jpeg](https://raw.githubusercontent.com/yubi-OS/assets/refs/heads/main/Y_3%5E3/image-2.jpeg), third chart in the Charts section.

The Charts section contains no prose at all: the images are the entire content of the section (source doc). None of the images carries alt text, a caption, or a figure number (source doc).

## What the hosting arrangement records

Every asset is a raw.githubusercontent URL into yubi-OS/assets, a separate repository from yubi-OS/yubiOS where the doc itself lives (source doc, from the embedded URLs). 2 consequences follow. First, the doc's evidentiary content lives outside the doc's own repository, so a reader of yubiOS alone sees references, not content, and asset drift is possible across the 2 repos. Second, the assets are referenced, not vendored: there is no local copy in the doc tree (source doc).

The directory layout of the assets also records project structure: the 2 Y_3^3 renders share a directory named for the harmonic, while the 2 learning charts sit at the repository root under filenames naming their subjects (source doc, from the URLs).

## What the images record

The source doc does not describe any chart in text. Filenames are the only metadata: Learned_Latent_Curve.jpeg and Latent_Space_Learning.jpeg name the 2 chart subjects, and both names correspond to concepts the diagram section operationalizes, the learned curve the model emits and the latent space in which learning happens (source doc, structural reading). The Y_3^3 directory holds 2 renders, the doc header image and image-2.jpeg (source doc).

Internal-record subtopic, no dig: this subtopic documents the doc's own asset inventory, so searXNG was skipped per the DOCS mint brief.

## What this doc contributes

A reader should take away 3 things. First, the doc's Charts section is an asset gallery, not an argument: whatever evidentiary weight the charts carry is inside the JPEGs, and the doc's text makes no claims about them. Second, the asset boundary between yubiOS and yubi-OS/assets is real and visible in every URL, which matters for anyone archiving or mirror-syncing the doc. Third, the filenames are the only machine readable description of the chart contents, and they are thin.

## Gaps

- Chart contents are not machine readable from the source doc text; this corpus cannot state what the curves show.
- No captions, alt text, or figure numbers exist in the doc.
- Whether the charts are generated artifacts with upstream sources is not recorded anywhere in the doc.
