# Strudel: Overview and Ecosystem

This doc covers what Strudel is, what it is used for, where its canonical source lives, and the ecosystem of curated resources and song collections around it.

## What Strudel is

Strudel is a music live coding environment for the browser. It is an official port of the TidalCycles pattern language to JavaScript, letting you "expressively write dynamic music pieces" without needing to know JavaScript or TidalCycles beforehand [primary: https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/getting-started.mdx]. The project describes itself as a "web-based environment for live coding algorithmic patterns, incorporating a faithful port of TidalCycles to JavaScript" [primary: https://codeberg.org/uzu/strudel/raw/branch/main/README.md]. It is free and open source [primary: README.md, licensing section].

The canonical REPL lives at https://strudel.cc/ and the docs at https://strudel.cc/learn [primary: README.md]. An interactive tutorial at strudel.cc/learn/getting-started walks users through editing text and pressing refresh to "live code your first Strudel pattern" [dig, jev=0.64: https://strudel.cc/learn/getting-started/].

Strudel was initiated by Alex McLean and Felix Roos in 2022 [dig, jev=0.64: https://strudel.cc/learn/getting-started/]. It belongs to the family of environments inspired by TidalCycles that adopt its model of patterns of time, known as Uzulangs, where Strudel is the web-based member [dig, jev=0.62: https://tidalcycles.org/]. TidalCycles itself uses SuperCollider for synthesis and MIDI; Strudel brings the pattern model into the browser instead [dig, jev=0.62: https://tidalcycles.org/].

## What it is used for

The official docs name 4 use cases [primary: getting-started.mdx]:

- Live coded music: make music with code in real time.
- Algorithmic composition: compose using Tidal's unique approach to pattern manipulation.
- Teaching: a low barrier of entry makes it a good fit for teaching music and code at the same time.
- Sequencer integration: via MIDI or OSC, Strudel acts as a flexible sequencer inside an existing music setup.

Live algorave-style use is documented in the wild: a 2025 session built a full track live in Strudel.js in the browser [dig, jev=0.63: https://www.youtube.com/watch?v=dFOstvsQcHI]. A third-party comparison positions Strudel as "Tidal Cycles reimagined for the browser" among live coding systems [dig, jev=0.64: https://www.soniare.net/blog/live-coding-systems-comparison]. The algorave community scene context is at https://algorave.com [dig, jev=0.61: https://algorave.com/].

For seeing the range of what people build, the docs point to the showcase page of videos at /intro/showcase/ [primary: getting-started.mdx]. A separate examples domain exists at https://live.strudel.cc/examples/ [dig, jev=0.64: https://live.strudel.cc/examples/].

## Where the source lives

Development happens on Codeberg at https://codeberg.org/uzu/strudel. The README states the project moved from GitHub "for ethical reasons" and explicitly asks people not to fork it back to GitHub [primary: README.md]. The old GitHub repository tidalcycles/strudel is marked "MOVED TO CODEBERG" and points development to Codeberg [dig, jev=0.63: https://github.com/tidalcycles/strudel].

The codebase is organized into many packages under packages/, also published on npm under the @strudel scope, reusable in your own project per the technical manual [primary: README.md]. The license is GNU Affero General Public License v3: Strudel code can only be shared within free/open source projects under the same license [primary: README.md]. Default sound bank licensing is tracked in the dough-samples repository [primary: README.md]. Running the REPL locally needs Node.js 18 or newer and pnpm [primary: README.md].

Development is active on a roughly monthly cadence: the CHANGELOG groups merged pull requests by month, with a January 2026 section containing PRs up to number 1911, including recent features such as Kabelsalat integration and a MIDI Keyboard feature [primary: https://codeberg.org/uzu/strudel/raw/branch/main/CHANGELOG.md]. Project history blog posts exist at the loophole-letters blog (the technical post and the "1 Year of Strudel" post) plus a "2 Years of Strudel" post on strudel.cc/blog [primary: README.md].

## The surrounding ecosystem

- awesome-strudel (https://github.com/terryds/awesome-strudel): a curated collection of Strudel resources including standout tracks and covers from Strudel artists, tutorials, and useful repositories related to strudel.cc. Its featured tracks table lists covers by artists such as KAIXI, eefano, tzwaan/Swan, and santi.codes, each with a direct strudel.cc link that encodes the full song source in the URL hash [primary: https://raw.githubusercontent.com/terryds/awesome-strudel/main/README.md].
- strudel-songs-collection (https://github.com/eefano/strudel-songs-collection): a library of songs created with Strudel; the workflow is to open strudel.cc, paste a song into the editor, and press update [primary: https://raw.githubusercontent.com/eefano/strudel-songs-collection/main/README.md]. Several of its songs are cross-listed in awesome-strudel [primary: awesome-strudel README].
- Community: a #strudel channel on the TidalCycles Discord, the tidal club forum, and a Mastodon account at social.toplap.org/@strudel. The Discord and forum are shared with the Haskell (tidal) and Python (vortex) siblings of the project [primary: README.md].

## Gap

No primary source in this set gives a total package count, contributor count, or a release version number. The README links contributor listing to Codeberg activity but this doc does not quote a count. Editor integrations beyond the browser REPL (e.g. third-party editor plugins) are named only inside the awesome-strudel repository list and were not individually verified here.

## Sources considered

| Source | Type | jev |
|---|---|---|
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/getting-started.mdx | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/README.md | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/CHANGELOG.md | primary | n/a |
| https://raw.githubusercontent.com/terryds/awesome-strudel/main/README.md | primary | n/a |
| https://raw.githubusercontent.com/eefano/strudel-songs-collection/main/README.md | primary | n/a |
| https://strudel.cc/learn/getting-started/ | dig | 0.64 |
| https://live.strudel.cc/examples/ | dig | 0.64 |
| https://www.soniare.net/blog/live-coding-systems-comparison | dig | 0.64 |
| https://github.com/tidalcycles/strudel | dig | 0.63 |
| https://www.youtube.com/watch?v=dFOstvsQcHI | dig | 0.63 |
| https://strudel.cc/ | dig | 0.63 |
| https://tidalcycles.org/ | dig | 0.62 |
| https://algorave.com/ | dig | 0.61 |
| https://codeberg.org/uzu/strudel | dig | 0.61 |
