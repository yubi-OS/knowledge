# 02. Customer baseline data collection

Scope: What pre-pilot customer baseline data to collect and how to collect it, including discovery interview discipline, per-device costs, incident history, and treating missing data as a finding rather than an error.

## Collect baselines before the pilot starts, not after

The yubiOS model requires, per pilot customer and before the pilot starts: current root-of-trust cost per device, historical incident response time for a lost or compromised credential if the customer tracks it, current device onboarding and enrollment time, current audit and compliance evidence burden in hours or a comparable unit, and the internal hourly cost rate for the relevant staff (internal reference: yubi-OS/yubiOS refs/customer-roi-model-2026-07-25.md). In the source worksheet all five baseline cells were marked customer-provided and blank. That is the correct default posture for an early-stage ROI model: the vendor does not fill in customer baseline cells with its own estimates.

Evaluation guidance for pilot programs is blunt on timing: monitoring and evaluation frameworks and related evaluation plans should be developed early and in parallel with pilot design, not retrofitted afterward (Australian Treasury, Guide to Evaluating Pilot Programs, https://evaluation.treasury.gov.au/sites/evaluation.treasury.gov.au/files/2025-07/guide-evaluating-pilot-programs.pdf, jev weight 0.85). Applied to ROI modeling, this means the baseline data specification is part of pilot design, agreed with the customer before any yubiOS device is enrolled.

## Discovery interviews are the collection instrument

Customer discovery interviews are the standard mechanism for eliciting current-state numbers. Practitioner guidance emphasizes structured capture: collecting, organizing, and analyzing interview insights in a shared spreadsheet or template so data survives the conversation and can be compared across respondents (LogRocket, https://blog.logrocket.com/product-management/managing-customer-discovery-interview-data-spreadsheet-template/, jev weight 0.36, weak backing). The Mom Test lineage of question design pushes interviewers toward concrete past behavior rather than hypothetical opinions, which is exactly the posture a baseline needs: what did the last lost credential cost you in responder hours, not what would you guess it costs.

Primary research collected by the vendor with the customer, through interviews and surveys where the vendor controls the questions and the sample, delivers insights specific to the engagement but takes more time and budget than relying on secondary sources (ZoomInfo, https://pipeline.zoominfo.com/marketing/b2b-benchmarking-market-research-guide, jev weight 0.24, weak backing). For a per-customer ROI baseline there is no secondary substitute: industry-average numbers cannot stand in for this customer's enrollment time.

## Benchmarking context, with care

Benchmarking practices define the baseline reference frame options: measuring performance against your own past results, against direct competitors, or against industry-wide averages (Qualtrics, https://www.qualtrics.com/articles/customer-experience/customer-experience-benchmarking/, jev weight 0.54). A pilot ROI model should anchor on the first option, the customer's own past results, because competitors' and industry averages are neither observable by the pilot nor comparable to the pilot's measured side. Large benchmark aggregations with tens of thousands of data points (CustomerGauge B2B NPS and CX benchmarks, https://customergauge.com/ebook/b2b-nps-and-cx-benchmarks-report, jev weight 0.62) are useful for market context and useless as a substitute for the customer's own baseline cells.

## Missing data is a finding

The yubiOS model states that when a customer does not track a baseline number, for example historical incident response time for a lost credential, the absence of that number is itself a finding, not an error to paper over (internal reference: yubi-OS/yubiOS refs/customer-roi-model-2026-07-25.md). Practically, this has three consequences. First, the model must tolerate a null baseline cell by flagging the line item as unvalidated rather than imputing a value. Second, the discovery interview should probe why the number is untracked, because an untracked incident metric is evidence about the customer's current incident maturity and can itself motivate the purchase. Third, the pilot readout should report the gap explicitly so the day-90 decision sees which line items rest on measured baselines and which cannot be scored at all.

## Who owns which cell

Baseline cells are customer-provided; the vendor's job is to specify the unit for each cell (dollars per device, hours per incident, hours per audit, dollars per hour) and to record the stated value and its source (which role stated it, in which conversation). A number without a named source does not enter the formula. This mirrors the evidence rule in the yubiOS model, where every formula input has a named evidence source in the worksheet, and a claim is valid only if the pilot-measured side comes from that named source rather than an assumption (internal reference: yubi-OS/yubiOS refs/customer-roi-model-2026-07-25.md).
