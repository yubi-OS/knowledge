# Hardware Integrations

Strudel is a browser music environment, but it is not locked to browser audio. The workshop lists a fourth use case on its getting started page: "integrate into your existing music setup: either via MIDI or OSC, you can use Strudel as a really flexible sequencer" [primary, https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/getting-started.mdx]. Beyond MIDI and OSC, Strudel can also pattern hardware directly over the MQTT internet of things protocol. This doc covers both paths: driving an existing music setup through MIDI or OSC, and patterning servo motors on a microcontroller over MQTT.

## MIDI and OSC as the integration layer

The default Strudel output uses the Web Audio API, and the input-output docs position MIDI and OSC as alternatives rather than extensions: "It is also possible to use Strudel with MIDI and OSC / SuperDirt instead" [dig, jev=0.8, https://urswilke.github.io/strudel/learn/input-output/]. In practice that means Strudel stays the pattern brain and your existing gear, hardware synthesisers or other software, becomes the sound. The FAQ confirms the contract in one line: "Strudel can send MIDI and OSC, which are protocols for communicating musical information" [dig, jev=0.79, https://strudel.cc/learn/faq/].

The input-output docs also document receiving, not just sending: Strudel can receive MIDI control change messages, with output provided as "a function that accepts a midi cc value to query as well as (optionally) a midi channel" [dig, jev=0.8, https://strudel.cc/learn/input-output/]. This doc deliberately does not name specific MIDI or OSC API functions beyond what these pages state; the package level README for the MIDI package was not retrievable (the fetch of packages/midi/README.mjs returned Not found), so that gap is left open rather than filled with invented API names [primary gap, https://codeberg.org/uzu/strudel/raw/branch/main/packages/midi/README.mjs].

For OSC specifically, the same input-output page notes sending each hap as an OSC message picked up by SuperCollider, which is how the SuperDirt synthesiser commonly used with Strudel's sibling TidalCycles joins the setup [dig, jev=0.8, https://strudel.cc/learn/input-output/]. The project blog adds that the desktop app has its own rust based MIDI and OSC integrations which do not depend on browser APIs [dig, jev=0.55, https://strudel.patternclub.org/blog/].

## Patterning servo motors over MQTT

The motors chapter of the workshop takes the sequencer idea off musical gear entirely: "Strudel is mainly made for making music, but it's possible to pattern other things with it, including motors" [primary, https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/motors.mdx]. The hardware is a Pimoroni Inventor 2040W, described as a Pico W with extra ports added including some for controlling motors [primary, motors.mdx].

The architecture is three parts. The microcontroller connects to the internet wirelessly and runs student code from the patternclub alpacalab repo that listens for messages using MQTT; when it receives a message, it moves a motor [primary, motors.mdx]. The broker is a small server running mosquitto software [primary, motors.mdx]. Strudel sends those messages instead of triggering sounds, which is how movement gets patterned. The student code confirms the receive side: a callback checks for topics like "/move/all" or "/move/" plus the board's name, then reads "motor" and "move" fields from a JSON message and calls servos[motor].value(move) [primary, https://github.com/patternclub/alpacalab/blob/main/course/main.py].

On the Strudel side, the core command chain is move(...).motor("0").robot('x'), where the robot argument is the letter labeled on the back of your microcontroller. A first movement looks like `$: move("-60 80").motor("0").robot('x')`. Move instructions are in the range from -90 to 90. Motors are counted from 0 in code, so motor 1 on the board is motor 0 in the code [primary, motors.mdx]. If motors stop working and the code looks right, try the reset button on the microcontroller [primary, motors.mdx].

The full mininotation applies to movement patterns: `move("-10 0 10 [20 30]*2").motor("0").slow(2).robot('x')` works exactly like a sound pattern [primary, motors.mdx].

For smooth movement, use waveforms instead of discrete values, for example `$: move(sine.range(-30, 30).segment(16)).motor("0").slow(2).robot('x')`. Segment takes a number of positions from the waveform; 16 is jerky, so try 32 or 64. It is best not to go much higher, as the microcontroller might get overwhelmed with a backlog of instructions [primary, motors.mdx]. Other waveforms that work: saw (sawtooth), tri (triangular), rand (random), and perlin (smoothed out randomness) [primary, motors.mdx].

Multiple motors can be patterned two ways: pattern the motor command itself, as in `.motor("0 1")`, or give each motor its own pattern line with different speeds, for example one at .slow(2) and another at .slow(3) [primary, motors.mdx].

## Sources considered

| URL | Type | Weight |
| --- | --- | --- |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/getting-started.mdx | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/website/src/pages/workshop/motors.mdx | primary | n/a |
| https://github.com/patternclub/alpacalab/blob/main/course/main.py | primary | n/a |
| https://codeberg.org/uzu/strudel/raw/branch/main/packages/midi/README.mjs | primary gap | 404, Not found |
| https://strudel.cc/learn/input-output/ | dig | jev=0.8 |
| https://urswilke.github.io/strudel/learn/input-output/ | dig | jev=0.8 |
| https://strudel.cc/learn/faq/ | dig | jev=0.79 |
| https://strudel.cc/learn/csound/ | dig | jev=0.79 |
| https://strudel.patternclub.org/blog/ | dig | jev=0.55 |
| https://strudel.patternclub.org/workshop/motors/ | dig | jev=0.54 |
| https://utcsheffield.github.io/makerclub-strudel/workshop/motors/ | dig | jev=0.54 |
