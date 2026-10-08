# 03 - Generating the clip with ElevenLabs sound generation

Scope: Sauna-side clip generation with the ElevenLabs sound-generation endpoint: raw PCM S16LE mono output format pcm_22050, duration_seconds, and why raw PCM avoids MP3 decoding on both sides.

## The generation call

The source doc (yubi-OS/yubiOS skills/play-audio-on-rock1/SKILL.md) generates the clip on the Sauna side with a single fetch:

```typescript
const res = await fetch(
  "https://sauna.local/v1/elevenlabs/v1/sound-generation?output_format=pcm_22050",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "a short futuristic sonar ping with a soft descending tail",
      duration_seconds: 2,
    }),
  }
);
const buf = Buffer.from(await res.arrayBuffer());
fs.writeFileSync("session/rock1-clip.pcm", buf);
```

The response body is raw PCM (S16LE mono), written straight to disk; no MP3 decode is needed on either side of the bridge (source doc). The example uses duration_seconds 2, which is in the sweet spot for the transfer limits described in doc 04.

## What the endpoint is

ElevenLabs documents this surface as its sound effects API, which turns text descriptions into audio effects with control over timing, style and complexity; the model understands both natural language and audio terminology (weight 0.71, https://elevenlabs.io/docs/overview/capabilities/sound-effects). The convert endpoint behind it is documented as "turn text into sound effects for your videos, voice-overs or video games" (weight 0.84, https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert).

## Output format grammar

The output_format parameter is formatted as codec_sample_rate_bitrate; an mp3 at 22.05kHz sample rate and 32kbps is mp3_22050_32 (weight 0.82, https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert). For PCM the bitrate segment drops out and the sample rate carries the meaning. ElevenLabs introduced the PCM output format with 4 sampling rate options: 16kHz, 22.05kHz, 24kHz and 44.1kHz (weight 0.60, https://elevenlabs.io/blog/pcm-output-format). pcm_22050, the value this skill pins, is 16-bit PCM at 22.05 kHz (weak backing, weight 0.43, https://composite-voice.com/docs/api/types/elevenlabsoutputformat).

Third-party mirrors of the API confirm the same parameter set, including the optional duration_seconds field (weight 0.61, https://skmtc.net/elevenlabs/apis/elevenlabs-api-documentation/docs/v1/sound-generation/post; weak backing, weight 0.44, https://runapi.ai/docs/api/elevenlabs/text-to-sound).

## Why raw PCM beats MP3 here

Two reasons, both from the source doc:

1. The playback path is a hand-rolled ctypes player, not a media framework. Feeding it S16LE frames means the player opens ALSA, sets the sample format once, and streams the bytes with no decoder step.
2. The transfer path is base64 over a shell bridge. A decoded 4s clip is about 176KB raw and about 235KB base64; an MP3 would need decoding on rock1 before playback, which means either a pip install or an apt install, both of which the skill exists to avoid (source doc; see doc 01).

## Sauna proxy note

The URL in the quick start goes through the Sauna proxy at https://sauna.local/v1/elevenlabs/..., which injects the user's ElevenLabs credentials for the elevenlabs connection; you never handle an API key in the script (source doc). Request the pcm_22050 output format in the query string, not the body.
