# 01 - Project citation

Scope: the canonical project citation and BibTeX record for yubiOS, and the citation conventions that shape it. Grounded in yubi-OS/yubiOS [docs/CITATION.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/CITATION.md) (source doc); dig-sourced claims carry their URL and jev weight.

## What the source doc asks

The source doc states that if you reference yubiOS in academic or technical work, you should cite the project and, where relevant, the primary sources below that ground its design. [source doc: yubi-OS/yubiOS docs/CITATION.md]

It then gives one exact canonical citation string:

> Tchatalbachian, S. (2026). *yubiOS: A FIDO2-first immutable operating system with a hardware security key as the sole root of trust.* yubi-OS. https://github.com/yubi-OS/yubiOS

[source doc: yubi-OS/yubiOS docs/CITATION.md]

## The BibTeX record

The source doc ships a machine-readable BibTeX entry alongside the prose citation [source doc: yubi-OS/yubiOS docs/CITATION.md]:

```bibtex
@software{yubios2026,
  author  = {Tchatalbachian, Shant},
  title   = {{yubiOS}: A {FIDO2}-first immutable operating system with a
             hardware security key as the sole root of trust},
  year    = {2026},
  url     = {https://github.com/yubi-OS/yubiOS},
  note    = {YubiKey replaces the TPM at every trust boundary:
             Secure Boot signing, disk encryption, SSH, and PAM}
}
```

Three details in this entry are load-bearing for anyone citing yubiOS correctly:

1. The entry type is `@software`, not `@misc` or `@article`. The source doc deliberately uses the software entry form. [source doc: yubi-OS/yubiOS docs/CITATION.md]
2. The title protects the project name and the FIDO2 acronym with braces (`{yubiOS}`, `{FIDO2}`), so capitalization survives BibTeX case folding. [source doc: yubi-OS/yubiOS docs/CITATION.md]
3. The `note` field compresses the project thesis into one sentence: YubiKey replaces the TPM at every trust boundary, naming the 4 boundaries Secure Boot signing, disk encryption, SSH, and PAM. [source doc: yubi-OS/yubiOS docs/CITATION.md]

## How this entry maps to software-citation practice

The dig results around this subtopic are mostly weak, which is itself informative: the source doc is the authority here, and general citation how-tos online are not.

- BibTeX itself is documented as a reference file format with defined entry types and fields, including a free DOI tooling ecosystem around it (https://www.bibtex.org/, jev weight 0.39, weak backing, used only as background on the format itself).
- A dedicated biblatex style extension for software exists on CTAN, developed with feedback from an Inria working group, which shows that the software-citation niche the source doc's `@software` entry occupies is a recognized problem with dedicated tooling (https://ctan.math.illinois.edu/macros/latex/contrib/biblatex-contrib/biblatex-software/software-biblatex.pdf, jev weight 0.72).
- Software Heritage has published on citing software with style, including package documentation and an example document (https://www.softwareheritage.org/2020/05/26/citing-software-with-style/, jev weight 0.65).

Weak-backing results (labeled as such, jev weight under 0.5): Q&A threads on TeX Stack Exchange (https://tex.stackexchange.com/questions/254610/how-can-i-use-bibtex-to-cite-software, 0.18) and Super User (https://superuser.com/questions/8743/how-do-i-cite-software-in-latex, 0.13) discuss citing software in LaTeX generally; a how-to site on citing GitHub repositories (https://www.wikihow.com/Cite-a-GitHub-Repository, 0.14) and two SEO content farms (https://citationz.com/citation-center/how-to-cite-github, 0.12; https://apexgear.blog/how-to-cite-github-repository, 0.11) surfaced but carry no authoritative weight. None of these contradict the source doc; they are recorded for provenance only.

## What the citation does not claim

The citation string names the author, year, full descriptive title, publisher (yubi-OS), and repository URL, and nothing else. It does not cite a specific release tag or commit. The per-domain upstream references live in the second half of the source doc, which doc 07 of this corpus indexes. [source doc: yubi-OS/yubiOS docs/CITATION.md]

## Scope boundary for downstream readers

Everything in this doc is derived from the source doc's own "Cite this project" section plus low-stakes dig context on software citation tooling. If the upstream source doc updates the citation string or the BibTeX entry, this corpus doc is stale; the source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/CITATION.md remains the primary source of record.
