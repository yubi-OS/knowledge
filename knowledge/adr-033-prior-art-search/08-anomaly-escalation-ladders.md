# 08 - Anomaly detection and escalation ladders in adjacent systems

Scope: behavioral anomaly detection on device and workload signals, and escalation-ladder designs in adjacent systems: systemd failure escalation, OPA/Rego policy expression, and misbehavior-detection taxonomies.

## A taxonomy for misbehavior detection

The reviewed misbehavior-detection literature for embedded IoT devices in a medical cyber-physical system distinguishes three technique classes: signature-based, anomaly-based, and specification-based misbehavior detection (https://people.cs.vt.edu/~irchen/ps/You-TNSM20.pdf, weight 0.83). The paper argues distributed misbehavior detection is feasible at scale for such systems. This taxonomy maps directly onto ADR-033's trigger-evaluator design space: a DMA-window anomaly score is an anomaly-based detector; a protocol-conformance check is a specification-based one.

NIST's Device-level Anomaly fRamEwork (DARE) offers a set of assessment tools for critical communications infrastructure, building a new level of trust and reliability into telecommunication systems; it is described as a non-invasive, physical metrology approach to device-level anomaly assessment (https://www.nist.gov/programs-projects/device-level-anomaly-framework-dare, weight 0.91). The salient prior-art signal is institutional: an standards body treats device-level behavioral anomaly assessment as a distinct discipline worth a named framework.

## Workload-aware anomaly detection

Workload-aware anomaly detection for web applications proposes an online approach: an incremental clustering algorithm trains workload patterns online and applies the local outlier factor over the recognized workload patterns (https://www.sciencedirect.com/science/article/pii/S0164121213000721, weight 0.88). The pattern is transferable: baseline the normal shape of a workload's I/O stream, score deviations incrementally, act on the score. Product-layer analogues exist: IBM Storage Insights identifies suspicious conditions at node and volume level using compression formulas and entropy analysis for early warning (https://www.ibm.com/docs/en/storage-insights?topic=pro-alerts-workload-anomaly-detection, weight 0.41, weak backing).

## Escalation ladders at the service lifecycle layer

systemd implements a real, shipped escalation ladder, but at the service lifecycle layer, not the device I/O layer. The documented pattern: StartLimitBurst=2 and StartLimitIntervalSec=30 settings tell systemd that if the service unsuccessfully tries to restart itself twice within 30 seconds, it should enter a failed state and no longer try to restart (https://www.redhat.com/en/blog/systemd-automate-recovery, weight 0.78). The OnFailure directive activates one or more units when the unit enters the failed state, which composes automatic action with a human-checkpoint hook (https://serverfault.com/questions/786590/systemd-execute-command-after-start-limit-reached, weight 0.05, weak backing for the exact semantics; the primary systemd manual carries this definition).

Community writeups confirm the operational shape: systemctl reports start-limit-hit when crash-loop protection trips, and clearing the rate limit is a distinct step after fixing the real cause (https://danielcosenza.com/posts/lx-fix-systemd-start-limit-hit/, weight 0.23, weak). Restart policy tuning guides document RestartSec and related directives (https://linuxeries.org/post/2026-07-04-taming-systemds-restart-policy-when-and-how-t/, weight 0.17, weak).

The structural lesson for ADR-033: escalation ladders with automatic action plus a human checkpoint are an accepted, shipped pattern, but the reviewed instance operates on unit lifecycle events, not on device I/O behavior.

## Policy expression: OPA/Rego

OPA decouples policy decision-making from policy enforcement, and policies are expressed in a high-level declarative language called Rego, purpose-built for expressing policies over complex hierarchical data structures (https://www.openpolicyagent.org/docs, weight 0.36, weak backing from this dig result, consistent with the primary OPA documentation). For ADR-033's trigger model, Rego is the natural expression language for evaluators that consume structured observation streams (DMA window records, device state transitions) and emit tier decisions.

## What is absent against ADR-033

1. Detection taxonomies exist; device-I/O trigger evaluators do not. Signature, anomaly, and specification-based detection are established classes, but no reviewed source applies them to vfio-user-visible DMA streams.
2. Escalation ladders exist only at the service layer. systemd's start-limit plus OnFailure chain is the reviewed exemplar of automatic-action-plus-human-checkpoint, and it never touches device state.
3. No source combines detection with forensic state capture at each tier. The reviewed escalation mechanisms act; they do not preserve.
4. Rego as expression language is a design fit, not prior art for the trigger model itself.

## Sources considered

| source | weight |
|---|---|
| https://www.nist.gov/programs-projects/device-level-anomaly-framework-dare | 0.91 |
| https://www.sciencedirect.com/science/article/pii/S0164121213000721 | 0.88 |
| https://people.cs.vt.edu/~irchen/ps/You-TNSM20.pdf | 0.83 |
| https://www.redhat.com/en/blog/systemd-automate-recovery | 0.78 |
| https://www.openpolicyagent.org/docs | 0.36 (weak) |
| https://www.mathworks.com/help/visual-inspection/ref/fastflowanomalydetector.html | 0.44 (weak) |
| https://www.ibm.com/docs/en/storage-insights?topic=pro-alerts-workload-anomaly-detection | 0.41 (weak) |
| https://danielcosenza.com/posts/lx-fix-systemd-start-limit-hit/ | 0.23 (weak) |
| https://networkthreatdetection.com/identifying-anomalous-iot-device-behavior/ | 0.16 (weak) |
| https://linuxeries.org/post/2026-07-04-taming-systemds-restart-policy-when-and-how-t/ | 0.17 (weak) |
| https://serverfault.com/questions/786590/systemd-execute-command-after-start-limit-reached | 0.05 (weak) |
| https://serverfault.com/questions/736624/systemd-service-automatic-restart-after-startlimitinterval | 0.05 (weak) |
