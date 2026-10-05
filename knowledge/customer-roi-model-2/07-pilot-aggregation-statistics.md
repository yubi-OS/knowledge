# Pilot Aggregation Statistics

Scope: why averaging ROI across pilots needs more than one pilot, what the research literature says about pilot studies and small samples, and how the model's no-premature-aggregation boundary is grounded.

## The model's rule

A single pilot with one customer produces one data point, not a statistically validated ROI. The model forbids aggregating ROI across pilots into an average until there are enough pilots for the average to be meaningful, and it deliberately does not set a specific minimum n, leaving that statistics judgment call to whoever runs the second and third pilot (https://github.com/yubi-OS/yubiOS/blob/main/refs/customer-roi-model-2026-07-26.md).

## What the pilot-study literature says

The methodological literature on pilot studies is blunt about their role. A review in fertility and sterility research states that pilot studies, when properly designed and implemented, provide critical information for the development and potential success of a subsequent larger study (https://www.sciencedirect.com/science/article/pii/S0015028224000815, jev weight 0.76, authoritative). Sample size is identified as a critical factor in the reliability and precision of research findings, with simulation data backing the point (https://www.sciencedirect.com/science/article/pii/S2773065425001397, jev weight 0.83, authoritative).

The most directly relevant finding for ROI marketing is about how small studies get over-read: a study in the Journal of Clinical Epidemiology found that scientists' perception of pilot study quality was influenced by whether the pilot reported statistically significant results, with identical abstracts rewritten as small single-group pilot studies rated differently based on the significance framing (https://www.jclinepi.com/article/S0895-4356(23)00124-5/pdf, jev weight 0.90, authoritative). Translated to the ROI model: a single pilot that happens to show a large positive number will feel like proof, and the audience cannot be relied on to discount it, which is precisely why the boundary must be enforced by the publisher rather than left to the reader.

A general-audience statistics explainer adds the practical failure modes: a small sample size weakens validity by reducing the chance of detecting real effects, making results unstable and hard to replicate, and limiting generalizability (https://scienceinsights.org/how-does-small-sample-size-affect-validity/, jev weight 0.11, weak backing).

## Why the model does not set a minimum n

The model's choice to leave the minimum n unstated is not a gap; it is an allocation of judgment. Setting a minimum n in the model would create a magic number that pilots two and three could be shaped to satisfy regardless of their quality. The clinical literature takes the opposite of a magic-number position: pilot studies exist to justify and parameterize the larger study, not to stand in for its results (https://www.sciencedirect.com/science/article/pii/S0015028224000815, jev weight 0.76, authoritative). The model's owner at the time of the second and third pilot can make that call with the actual variance between pilots in hand, which is the information a pre-committed minimum n would have replaced.

## What aggregation may look like when it comes

If enough pilots accumulate, the model's arithmetic supports aggregation naturally: each pilot contributes its five per-line-item contributions computed the same way, so an average of pilot totals is an average of like-for-like measurements rather than an average of marketing claims. The preconditions, all drawn from the claim boundaries doc, are that each contributing pilot used the named evidence sources, that customer permission exists for any externally visible use of the underlying figures, and that the aggregate claim states how many pilots it rests on.

## Interaction with the other rules

The n=1 disclosure rule in the evidence validation doc is the per-claim version of this boundary; the four-boundaries doc is the enforcement layer; this doc is the reasoning layer. Together they mean the model's public posture starts at one named customer and expands only when the pilot count justifies it.
