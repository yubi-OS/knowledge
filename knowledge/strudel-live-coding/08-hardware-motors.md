# 08. Hardware Motors and MQTT Patterning

Scope: MQTT-driven motor patterning on hardware (Inventor 2040W) from the motors chapter.

## Beyond sound

Strudel is made for making music, but it is possible to pattern other things with it, including motors ([0.54] https://utcsheffield.github.io/makerclub-strudel/workshop/motors/). The motors chapter opens with exactly that premise and shows a `move` command patterning motor positions instead of samples ([0.72] https://strudel.cc/workshop/motors/).

## The hardware: Inventor 2040W

The workshop uses a microcontroller called the Inventor 2040W, which is a Pico W with extra ports added, including some for controlling motors ([0.54] https://utcsheffield.github.io/makerclub-strudel/workshop/motors/). The device connects to the internet wirelessly and can power from a battery or USB ([0.64] https://go.brianellissound.com/strudelSYNC/workshop/motors/).

## The transport: MQTT

The Inventor 2040W runs code that listens for messages using an Internet of Things network protocol called MQTT; when it receives a message, it moves a motor ([0.64] https://go.brianellissound.com/strudelSYNC/workshop/motors/). The device connects to a small server running software called mosquitto, which is the MQTT broker between the browser and the hardware ([0.64] https://go.brianellissound.com/strudelSYNC/workshop/motors/).

On the Strudel side, the input-output reference documents MQTT as one of three external transports: normally Strudel patterns sound using its own web-audio-based synthesiser called SuperDough, but it is also possible to pattern other things, such as software and hardware synthesisers with MIDI, other software using Open Sound Control (OSC), and devices over MQTT ([0.86] https://strudel.cc/learn/input-output/).

## The pattern syntax

The canonical example from the workshop:

```
$: move("-10 0 10 [20 30]*2").motor("0").slow(2).robot('x')
```

The move instructions are in the range from -90 to 90 ([0.72] https://strudel.cc/workshop/motors/). The workshop emphasizes that many Strudel features for playing with sound patterns work when playing with motor patterns, so the mini-notation inside `move(...)` accepts the same rhythm operators as a drum pattern ([0.72] https://strudel.cc/workshop/motors/). The chain shape is the same as the sound idiom: a pattern source (`move`), a target (`motor("0")`), and pattern transformations (`.slow(2)`), with `.robot('x')` selecting the actuation axis ([0.72] https://strudel.cc/workshop/motors/).

## Why this chapter matters for the rest

The motors chapter is the proof that the pattern layer is transport-agnostic: the same mini-notation, the same transformations, and the same REPL loop drive something other than audio ([0.72] https://strudel.cc/workshop/motors/, [0.86] https://strudel.cc/learn/input-output/). For the skill corpus, it anchors the claim that pattern authoring (docs 02, 06) is the core primitive, with sound merely the default output device ([0.86] https://strudel.cc/learn/input-output/).

## Failure modes

Hardware adds failure modes the audio path does not have: the microcontroller must be powered and on the network before the broker delivers anything ([0.64] https://go.brianellissound.com/strudelSYNC/workshop/motors/); the broker is a separate server process that must be running ([0.64] https://go.brianellissound.com/strudelSYNC/workshop/motors/); and move values outside the -90 to 90 range are out of the documented envelope ([0.72] https://strudel.cc/workshop/motors/). A community forum thread on the same board discusses motor control questions, though as a forum it carries weak backing for factual claims ([0.08] https://forums.pimoroni.com/t/inventor-2040w-and-motors/24840). The official hardware reference for the board itself is maintained in the pimoroni/inventor repository ([0.39] https://github.com/pimoroni/inventor/tree/main/boards/inventor_2040_w, weak backing for usage claims; it is the vendor's board definition source).
