# 07. Voice Narration via Kokoro

Source doc: `yubi-OS/yubiOS/skills/brag/SKILL.md` (primary source of record), plus searXNG dig results on Kokoro (jev-weighted below).

## Opt-in, single-provider, non-negotiable

Narration in `/brag` is strictly opt-in: the `--voice` flag enables it for that run only, and the source doc forbids enabling it automatically or falling back to the normal no-voice workflow when voice fails. When `--voice` is present, the implementation is fixed: "use Kokoro via Hyperframes and do not add any provider-selection logic. The voice workflow is intentionally single-provider" (source doc). There is no model menu, no fallback chain, no provider routing. This is the same minimalism the skill applies everywhere: one engine (Hyperframes), one voice provider (Kokoro), one duration window (15-25s).

Voice also affects the dispatch tier: `--voice` forces the full workflow even on Claude Opus 5.5, because the bundled brag-slim variant does not do narration (source doc, dispatch section).

## What Kokoro is (dig-grounded)

Kokoro is hexgrad's open-weight text-to-speech model, published as Kokoro-82M: an 82-million-parameter TTS model on Hugging Face (jev weight 0.76: huggingface.co/hexgrad/Kokoro-82M; weight 0.72 in a second dig result pointing at the same model card). The reference implementation lives at github.com/hexgrad/kokoro (weight 0.77). An ONNX export exists under onnx-community/Kokoro-82M-v1.0-ONNX (weight 0.45, weak), which is what makes browser-side inference practical for a tool like Hyperframes.

Ecosystem sources in the dig read weak and are used only for context, not claims: kokoroweb.app (0.21, 0.33), kokoroai.org (0.43), kokorottsai.com (0.22), and a third-party CLI wrapper (0.39, github.com/nazdridoy/kokoro-tts). None of these are the provider `/brag` targets; the single-provider rule means only the Kokoro-via-Hyperframes path counts.

## The narration guidance

When `--voice` is enabled, the source doc gives 5 qualities the narration must hit (all sourced from the source doc):

1. Complement the visuals, not simply read visible text.
2. Match scene pacing.
3. Sound natural and conversational.
4. Move smoothly between scenes.
5. Stay concise and specific to the product, so the voice feels like part of the edit rather than a separate narration track.

## Narration and the duration window

The creative laws are unchanged by voice: "Short. 15-25 seconds. Not one second more without a reason. This holds whether or not narration is on; narration does not extend the window" (source doc). Narration is written into the same storyboard beats as everything else, which is why the guidance stresses pacing match and scene transitions: a narration track that ignores the edit becomes exactly the "separate narration track" the source doc warns against.

## Sources

- `yubi-OS/yubiOS/skills/brag/SKILL.md` (source doc, primary)
- https://github.com/hexgrad/kokoro (jev 0.77)
- https://huggingface.co/hexgrad/Kokoro-82M (jev 0.76, 0.72)
- https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX (jev 0.45, weak)
