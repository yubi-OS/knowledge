# 04. Detection-extension maintenance failure

Scope: The Mozilla Deep Fake Detector retirement as the documented case of a detection extension dying of maintenance rather than accuracy, and the broader record on why detection-based browser add-ons rot.

## The Mozilla Deep Fake Detector retirement

Mozilla shut down its Deep Fake Detector Firefox add-on on June 26, 2025. The retirement was covered as the removal of one of two AI-related Firefox add-ons Mozilla dropped in the same action; PCWorld reported that Mozilla scrapped the Deep Fake Detector add-on along with its AI chatbot sidebar sibling [w=0.615] (https://www.pcworld.com/article/2811459/mozilla-scraps-two-more-firefox-add-ons-deep-fake-detector-a). Secondary coverage attributed the shutdown to low adoption combined with the maintenance burden of keeping detection models current as generative models evolve [w=0.149, weak] (https://www.omgubuntu.co.uk/2025/06/mozilla-deepfake-ai-detector-closing-down) and [w=0.280, weak] (https://serverhost.com/blog/mozilla-discontinues-deepfake-ai-detector-add-on-what-you-need-to-know/).

Note on provenance of this record: the yubiOS prior-art note flagged the original Mozilla post-mortem host as dead at mint time, so the shutdown claim here rests on secondary reporting plus the note's own record. The two strong secondary sources above carry it.

## Why detection extensions rot faster than they fail

The mechanism is specific: a detection extension embeds or calls detection models, and the population of generative models it must detect changes under it continuously. Each new model generation shifts the input distribution, so the extension's effective accuracy decays silently between updates, and each update is an engineering sprint across multiple vendors' model releases. Mozilla's decision is the observed outcome of that treadmill: the extension was retired not because it stopped working abruptly, but because keeping it current cost more than its adoption justified.

A second maintenance axis is documented in the adjacent security literature: the extension layer itself is an attack surface. Microsoft's security blog documented malicious AI assistant extensions harvesting LLM chat histories in 2026 [w=0.752] (https://www.microsoft.com/en-us/security/blog/2026/03/05/malicious-ai-assistant-extensions-harvest-llm-chat-histories/), and a Cloud Security Alliance research note framed AI browser extensions as shadow AI's hidden attack surface [w=0.860] (https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-browser-extension-attack-surface/). A detection extension that ships models and update channels adds another supply-chain surface to an already-suspect layer.

## Contrast with provenance

A provenance-based gate does not rot the same way. The property that differs:

1. Detection depends on the current generation of generative models; provenance depends on the manifest's signature, fixed at content creation time.
2. Detection accuracy is a hidden, decaying quantity; a manifest either validates or it does not, and the failure is observable.
3. Detection needs continuous updates; a C2PA validator needs updates when the C2PA specification moves (slowly, and with a public change record, see doc 06).

The Mozilla retirement therefore functions as prior-art evidence for the yubiOS design's central bet: hard evidence (signed provenance) over learned evidence (detectors), with detectors demoted to flagging signals. It also supports the architectural choice to implement the gate in-engine rather than as another add-on: the same retirement would have hit any engine-layer detection system with the same model-treadmill problem, which is why the provenance layer, not the detection layer, is what the engine-layer design is built around.

## Sources

- https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-browser-extension-attack-surface/ [w=0.860]
- https://www.microsoft.com/en-us/security/blog/2026/03/05/malicious-ai-assistant-extensions-harvest-llm-chat-histories/ [w=0.752]
- https://www.pcworld.com/article/2811459/mozilla-scraps-two-more-firefox-add-ons-deep-fake-detector-a [w=0.615]
- https://serverhost.com/blog/mozilla-discontinues-deepfake-ai-detector-add-on-what-you-need-to-know/ [w=0.280, weak]
- https://www.omgubuntu.co.uk/2025/06/mozilla-deepfake-ai-detector-closing-down [w=0.149, weak]
