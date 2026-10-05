# 06 Cross-runtime determinism for numeric pipelines

Scope: Getting identical numeric results across JavaScript runtimes: IEEE 754 determinism, seeded PRNGs, and reproducible hashing.

## The claim under test

A placement pipeline that runs the same input and the same seed on a local node, on a Cloudflare Worker, and in an app sandbox wants bit-identical or at least print-identical results. Whether that is achievable depends on two layers: the arithmetic layer (do all runtimes compute the same floats?) and the randomness layer (do all runtimes draw the same sequence?).

## The arithmetic layer

Floating-point determinism means getting the same answer on some range of machines and builds, so that every participant agrees on the result; IEEE floating-point math is deterministic in that sense (https://randomascii.wordpress.com/2013/07/16/floating-point-determinism/, weight 0.64). A Stack Overflow answer states the precise version: the IEEE 754 standard defines the addition, subtraction, multiplication, division, and square root operations on all floating-point values, with the exception of distinctions between different NaN values (https://stackoverflow.com/questions/42181795/is-ieee-754-2008-deterministic, weight 0.19; weak backing, but consistent with the stronger source above).

The JavaScript-specific caveat is real though: JavaScript relies on the IEEE 754 standard for double-precision floating-point numbers (64-bit floats), and while the standard defines how operations should be computed, engine-specific operations and optimizations can break bit-exact determinism across runtimes (https://salivity.github.io/planck.js/article/is-planck-js-deterministic-across-js-runtimes, weight 0.83). The practical reading for a placement pipeline: keep to the well-defined operations (add, subtract, multiply, divide, sqrt, comparisons), avoid transcendental functions and platform-specific math library paths where the printed result must match, and compare outputs at the printed precision rather than demanding bit equality across engine builds.

## The randomness layer

JavaScript's built-in randomness is not reproducible: Math.random() and crypto.getRandomValues() are automatically seeded, each invocation produces a fresh unpredictable random number, and the values are not reproducible across runs or realms; the TC39 proposal-seeded-random exists precisely because several use cases want a reproducible set of random values (https://github.com/tc39/proposal-seeded-random, weight 0.91). Math.random() being unseedable is a documented limitation (https://www.xjavascript.com/blog/seedable-javascript-random-number-generator/, weight 0.23; weak backing).

The standard fix is to ship your own seeded PRNG: community-maintained implementations of short, fast, seedable pseudorandom number generators in plain JavaScript exist and are explicitly intended for reproducibility rather than security (https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript, weight 0.08; weak backing, but the pattern is corroborated by the TC39 motivation above). Cross-language consistency is also available off the shelf: libraries that provide a consistent PRNG interface across PHP, Python, JavaScript, C#, and Java (https://github.com/toggio/pseudoRandom, weight 0.40; weak backing). Node.js itself is a cross-platform JavaScript runtime environment for servers, web apps, command line tools, and scripts (https://nodejs.org/en, weight 0.95), which is the local-node side of the cross-runtime comparison.

## What identical results require in practice

Combining the two layers, a deterministic cross-runtime run needs four things recorded and pinned: the input matrix, the seed and the exact PRNG implementation that consumes it, the binarization rule definition, and a hash of the rule plus inputs. With the same PRNG code and IEEE 754 double arithmetic, two runtimes of the same language family should agree to the printed precision; the comparison protocol should therefore state the precision at which agreement is claimed. When runtimes disagree, the first suspects are unseeded Math.random() calls, engine-specific floating-point paths, and unordered iteration (object key order or set ordering) leaking into the computation.

## What a rule_hash is for

A hash over the rule definition and the seed turns "same method" into a checkable equality. Two runs that print the same rule_hash used the same binarization rule and randomness stream, regardless of which runtime executed them; differing hashes mean the comparison is invalid before any statistic is read. This is the cheapest possible audit trail for cross-runtime claims, and it costs one hashing pass per run.

## Sources considered

| source | url | weight |
|---|---|---|
| TC39 proposal-seeded-random | https://github.com/tc39/proposal-seeded-random | 0.91 |
| Node.js | https://nodejs.org/en | 0.95 |
| planck.js determinism article | https://salivity.github.io/planck.js/article/is-planck-js-deterministic-across-js-runtimes | 0.83 |
| Random ASCII floating-point determinism | https://randomascii.wordpress.com/2013/07/16/floating-point-determinism/ | 0.64 |
| W3Schools JavaScript tutorial | https://www.w3schools.com/js/DEFAULT.asp | 0.89 (weak, generic tutorial) |
| pseudoRandom cross-platform PRNG | https://github.com/toggio/pseudoRandom | 0.40 (weak) |
| Wikipedia floating-point arithmetic | https://en.wikipedia.org/wiki/Floating-point_arithmetic | 0.43 (weak) |
| Stack Overflow IEEE 754-2008 determinism | https://stackoverflow.com/questions/42181795/is-ieee-754-2008-deterministic | 0.19 (weak) |
| Stack Overflow floating point determinism | https://stackoverflow.com/questions/11493279/javascript-and-dealing-with-floating-point-determinism | 0.04 (weak) |
| xjavascript seedable PRNG guide | https://www.xjavascript.com/blog/seedable-javascript-random-number-generator/ | 0.23 (weak) |
| Stack Overflow seeding the PRNG | https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript | 0.08 (weak) |
| love-shy.net forum (off-topic hit) | https://www.love-shy.net/forum/ | 0.02 (weak, off-topic) |
