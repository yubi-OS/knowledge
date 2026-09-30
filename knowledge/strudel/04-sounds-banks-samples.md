# Playing Sounds: sound(), Drum Letters, Banks, and Sample Selection

This doc covers how Strudel triggers audio: the `sound()` and `s()` functions, the standard unpitched sounds, drum letters, drum machine banks via `.bank()`, sample selection with `:x` and `n()`, and the documented paths for loading custom samples. It does not cover synths, notes, or sampler effects beyond naming them.

## sound() and s()

The `sound` function plays the sound of the given name: `sound("bd sd")` [primary, https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-sounds.mdx]. The same page also introduces the shorter alias `s`, and the official Samples doc uses `s("bd sd [~ bd] sd,hh*16, misc")` as its default-samples example, so `s` is the canonical shorthand used throughout the docs [primary, https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/learn/samples.mdx]. The workshop recap lists `sound` as the function that "plays the sound of the given name" and `s` implicitly in every later example [primary, https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/recap.mdx].

## The standard unpitched sounds

`casio` is one of many standard sounds, and the workshop offers this starter set to try: `insect wind jazz metal east crow casio space numbers` [primary, first-sounds.mdx]. You might hear a little pause while the sound loads; the docs attribute this to lazy loading: sample maps are loaded initially but the audio itself is only fetched when played, and this first-trigger silence is a known issue being tracked in issue 187 [primary, learn-samples.mdx].

## Drum letters

By default Strudel ships a wide selection of drum sounds: `sound("bd hh sd oh")` [primary, first-sounds.mdx]. The letters abbreviate drum kit parts, with the full list given in both the workshop and the Samples doc:

- `bd` bass drum (kick drum)
- `sd` snare drum
- `rim` rimshot
- `hh` closed hi-hat
- `oh` open hi-hat
- `cr` crash
- `rd` ride
- `ht` high tom
- `mt` medium tom
- `lt` low tom

[primary, first-sounds.mdx and learn-samples.mdx]

The Samples doc adds more percussive names: `sh` (shakers, maracas, cabasas), `cb` (cowbell), `tb` (tambourine), `perc` (other percussions), `misc` (miscellaneous), and `fx` (effects). It also documents `cp` (clap), which the workshop examples use in patterns like `sound("bd rim bd cp")` even though the workshop letter list omits it [primary, learn-samples.mdx; primary, recap.mdx].

## Banks

`.bank()` changes the drum machine behind the drum letters. `sound("bd hh sd oh").bank("RolandTR909")` swaps in a machine the docs call famous for house and techno beats; other banks named in the workshop are `AkaiLinn`, `RhythmAce`, `RolandTR808`, `RolandTR707`, and `ViscoSpaceDrum`, with "a lot more" hinted but not enumerated [primary, first-sounds.mdx].

Mechanically, `bank` just prepends the drum machine name to the sample name with an underscore: `s("bd sd,hh*16").bank("RolandTR808")` is short for `s("RolandTR808_bd RolandTR808_sd,RolandTR808_hh*16")`. This works only because the suffix after `_` is standardized, and not every bank has samples for every letter [primary, learn-samples.mdx; dig, jev=0.61, https://strudel.cc/learn/samples/].

Banks are also patternable: `s("bd sd,hh*16").bank("<RolandTR808 RolandTR909>")` switches machines per cycle [primary, learn-samples.mdx]. The full bank inventory comes from the tidal-drum-machines library, which the docs cite as the source of the drum samples [primary, learn-samples.mdx; dig, jev=0.62, https://urswilke.github.io/strudel/learn/samples/]. Note: bank names such as RolandTR505, RolandCompurhythm1000, and CasioRZ1 could not be verified in the sources fetched for this doc; treat any bank not named above as unverified until checked against the REPL `sounds` tab or the tidal-drum-machines repo.

## Sample selection: :x and n()

One sound name can contain multiple samples. Append `:` plus a number to pick one: `sound("casio:1")`. Omitting a number is equivalent to `:0` [primary, first-sounds.mdx]. Selection also works inside mini notation: `s("bd*4,hh:0 hh:1 hh:2 hh:3 hh:4 hh:5 hh:6 hh:7").bank("RolandTR909")` [primary, learn-samples.mdx].

To write sample numbers separately from the pattern, use `n()`. Instead of `sound("jazz:0 jazz:1 [jazz:4 jazz:2] jazz:3*2")`, write `n("0 1 [4 2] 3*2").sound("jazz")` [primary, first-sounds.mdx]. The recap summarizes `n` as "select sample number" [primary, recap.mdx].

The sounds tab in the REPL shows a count per name, for example `RolandTR909_hh(4)` means 4 hihat samples. `s` plays sample 0 by default; higher numbers wrap around: with only 4 TR909 hihat samples, `s("hh*8").bank("RolandTR909").n("0 1 2 3 4 5 6 7")` plays 4 through 7 identically to 0 through 3 [primary, learn-samples.mdx].

For pitched material, `note` sets pitch and `.sound("piano")` picks the instrument; `n("6 4 2 0").scale("C:minor").sound("piano")` plays scale degrees [primary, recap.mdx].

## Loading custom samples

The `samples` function registers a custom sample map. Two forms are documented:

1. Inline map plus base URL: `samples({ bassdrum: 'bd/BT0AADA.wav', hihat: 'hh27/000_hh27closedhh.wav', snaredrum: ['sd/rytm-01-classic.wav', 'sd/rytm-00-hard.wav'] }, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/')`. Names are free-form, a value may be one file or an array, defaults can be overridden, and the base URL plus sample path must concatenate into a valid URL. Registered names appear in the REPL under `sounds` then `user` [primary, learn-samples.mdx].
2. A URL to a `strudel.json` file: `samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')`. The JSON defines the same map, with an optional `_base` key for the base path. Browsers cache `strudel.json` aggressively; bumping a URL query such as `?version=2` forces a refresh [primary, learn-samples.mdx].

Shortcut for GitHub: `samples('github:tidalcycles/dirt-samples')` with format `samples('github:<user>/<repo>/<branch>')`; branch defaults to `main`, and the repo root must contain a `strudel.json` [primary, learn-samples.mdx].

From local disk: the REPL `sounds` tab has an `import-sounds` tab with an "import sounds folder" button. Subfolders become sound names, samples index from 0 in alphabetical order, so a folder with `swoop` and `smash` subfolders yields `s("swoop:0 swoop:1 smash:2")` [primary, learn-samples.mdx]. Alternatively, `npx @strudel/sampler` serves the current folder on `http://localhost:5432` with `LOG=1` for logging and `PORT=5555` to change the port; load it with `samples('http://localhost:5432')`, or run `npx --yes @strudel/sampler --json > strudel.json` to generate the map file instead of serving it [primary, https://codeberg.org/uzu/strudel/raw/branch/main/packages/sampler/README.md; primary, learn-samples.mdx].

Pitched sample maps use a key per region: `samples({ 'gtr': 'gtr/0001_cleanC.wav', 'moog': { 'g3': 'moog/005_Mighty%20Moog%20G3.wav' } }, 'github:tidalcycles/dirt-samples')`. The sampler always picks the closest matching sample for the current note, and this notation also works inside `strudel.json` [primary, learn-samples.mdx]. Finally, `samples('shabda:bass:4,hihat:4,rimshot:2')` queries freesound.org via the shabda tool, and `soundAlias('RolandTR808_bd', 'kick')` creates custom aliases for existing sounds [primary, learn-samples.mdx].

## Gaps

The exact list of available banks beyond the 6 named in the workshop was not verifiable from fetched sources; the REPL `sounds` tab and the tidal-drum-machines library are the authoritative sources. The `packages/sampler/README.mjs` path named in the research brief does not exist; the package README lives at `README.md` and is cited accordingly.

## Sources considered

| URL | Tag | jev |
| --- | --- | --- |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/first-sounds.mdx | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/recap.mdx | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/learn/samples.mdx | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/packages/sampler/README.md | primary | n/a |
| https://strudel.cc/workshop/first-sounds/ | dig | 0.62 |
| https://urswilke.github.io/strudel/learn/samples/ | dig | 0.62 |
| https://strudel.cc/learn/samples/ | dig | 0.61 |
| https://patterns.slab.org/learn/samples/ | dig | 0.6 |
| https://strudel.cc/learn/sounds/ | dig | 0.58 |
