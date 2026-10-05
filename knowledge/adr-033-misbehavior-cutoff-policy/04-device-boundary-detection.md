# 04. Detecting misbehavior at the device boundary

Scope: assumption A1, that an AI/ML workload's misbehavior can be detected by a host-side vfio-user observer without seeing model internals, against the research literature on VM behavioral detection and its false-positive problem.

## The claim under test

The source record states A1 as: "Misbehavior can be detected from a vfio-user-server-side observer (without seeing model internals). Test: prototype a vfio-user server that watches DMA-window patterns and flags anomalies; check false-positive rate against known-good traffic" (source one-pager, adr-033-misbehavior-cutoff-policy-2026-07-28). The record's own stress test names the un-testable bet underneath: if detection at the device boundary fails, "the entire ladder collapses to kill the VM at SEVER" (source one-pager).

## What the literature says about hypervisor-side detection

There is a mature research line on detecting misbehaving VMs from outside the guest, which supports the general architecture even though the specific device-boundary vantage point is narrower.

- A Computers & Security study on "multimodal abnormal behavior detection method in virtualization" opens from the premise that "abnormal behavior exhibited by virtual machines (VMs) running in cloud environment is one of the primary causes of" cloud incidents, and builds detection from host-side observables [1] (jev weight 0.782).
- A 2025 IEEE survey, "A Comprehensive Analysis of Secure Attack Detection on Virtual Machines," surveys the detection landscape for VM-hosted attacks [2] (jev weight 0.881).
- Work on benchmarking intrusion detection in VM environments defines "the workload type and workload characteristics for each guest VM as elements of the workload profile of the monitoring landscape," with virtual machine monitor-based lightweight introspection as the sensing point [3] (jev weight 0.552). This matters for A1 because it treats the workload profile, not the model's internals, as the detection input.
- A hypervisor anomaly detection lecture frames the indirect approach: "Indirect approach to detect hypervisor failures by monitoring VMs," using resource saturation signals across co-resident VMs [4] (jev weight 0.505).
- Deep-learning detection lines continue this direction, for example dual-attention dense architectures for "malicious behaviour detection in cloud environments" [5] (jev weight 0.692).

The common structure: detection input is a behavioral or resource signal observed outside the guest, and the guest cannot see or tamper with the observer. ADR-033's evaluator inherits this shape but moves the sensor from the hypervisor's virtualization layer to the vfio-user server's mediation layer, where the signal is DMA-window programming and DMA traffic patterns rather than CPU, memory, or network telemetry.

## The false-positive problem

The literature is consistent that behavioral detection's binding constraint is false positives, which is exactly the test A1 prescribes. Practitioner material on dynamic malware analysis lists "False Positives: Certain legitimate software generates alerts. Manual Analysis Needed: Experts are required to verify behavioral patterns" as a standing weakness (weak backing, geeksforgeeks [6], jev weight 0.107). The benchmarking work in [3] exists because detector quality varies enormously by workload profile (weight 0.552).

For GPU workloads the analog risk is concrete: training bursts, model swaps, and batch-size changes all reshape DMA patterns. A threshold tuned for inference workloads would flag legitimate training. The source record handles this by making the evaluator pluggable with a tunable threshold and by validating against known-good traffic first (source one-pager).

## What the monitoring ecosystem does and does not cover

Current GPU operational monitoring (DCGM exporters, nvidia-smi telemetry, Prometheus dashboards) observes utilization, memory, power, and thermal health (weak backing, computingforgeeks [7], weight 0.134; spheron [8], weight 0.491). That surface answers "is the GPU busy," not "is the DMA pattern consistent with the workload's declared behavior." The gap between the two is the space ADR-033's trigger evaluator occupies: it is a security-relevant signal at the device boundary, not a performance metric.

## Honest limits

Three limits should stay attached to A1 wherever it travels:

1. The cited literature validates host-outside-the-guest detection generally, not DMA-window anomaly scoring specifically. No dig source validates the specific signal; that is what the A1 prototype test is for (source one-pager).
2. Subtle misbehavior (policy-compliant but harmful outputs, slow exfiltration tuned under the anomaly threshold) is named in the record's stress test as the class the detector may miss entirely (source one-pager). Detection at the boundary is a floor, not a guarantee.
3. Threshold tuning without per-workload profiles imports the false-positive burden documented in [3] (weight 0.552) and [6] (weak, 0.107).

## Sources

1. Computers & Security, multimodal abnormal behavior detection in virtualization: https://www.sciencedirect.com/science/article/pii/S0167404824002104 (weight 0.782)
2. IEEE, comprehensive analysis of secure attack detection on VMs: https://ieeexplore.ieee.org/document/10872108 (weight 0.881)
3. arXiv, benchmarking intrusion detection systems in VM environments: https://arxiv.org/pdf/1410.1160 (weight 0.552)
4. Hypervisor anomaly detection lecture: https://jorge-cardoso.github.io/systems/aiops/2023-12-20_Hypervisor_Anomaly_Detection_Lecture.pdf (weight 0.505)
5. ScienceDirect, dual attention dense bi-LSTM malicious behavior detection: https://www.sciencedirect.com/science/article/pii/S0167404825001075 (weight 0.692)
6. GeeksforGeeks, dynamic malware analysis limitations (weak backing): https://www.geeksforgeeks.org/ethical-hacking/dynamic-malware-analysis/ (weight 0.107)
7. ComputingForGeeks, DCGM GPU monitoring (weak backing): https://computingforgeeks.com/nvidia-gpu-monitoring-dcgm-prometheus-grafana/ (weight 0.134)
8. Spheron, GPU monitoring for ML (weak backing): https://www.spheron.network/blog/gpu-monitoring-for-ml/ (weight 0.491)
