# 04. Jobs to be done for security

Scope: Jobs-to-be-done applied to security products: customers hire products to do security jobs, JTBD statement structure, why feature-list positioning loses to job framing.

## The core idea

Jobs-to-be-done holds that customers "hire" products to make progress in a circumstance, so design targets the underlying job rather than the product itself (source: https://userpilot.com/blog/jtbd-product-management/, jev weight 0.39, weak backing). The framework reframes the customer's relationship to their problem: user needs are viewed as a "job" the customer is trying to accomplish, which helps teams avoid costly product-development missteps by anchoring on the job instead of feature requests (source: https://www.productboard.com/wp-content/uploads/2023/12/Jobs-to-be-Done-Product-Framework-Guide.pdf, jev weight 0.35, weak backing). The theory originates with Clayton Christensen's work at Harvard Business School (source: https://online.hbs.edu/blog/post/jobs-to-be-done-examples, jev weight 0.36, weak backing).

## Job versus outcome: the Ulwick refinement

Tony Ulwick's outcome-driven innovation variant adds a precision that matters for security positioning: while a job describes the overall task the customer is trying to execute, an outcome is a metric the customer uses to measure success and value while executing that job (source: https://anthonyulwick.com/jobs-to-be-done/, jev weight 0.71, authoritative backing). Strategyn, Ulwick's firm, frames the shift as moving focus from products to customer needs to make innovation predictable (source: https://strategyn.com/jobs-to-be-done-template/, jev weight 0.45, weak backing). UX research practice adopts the same structure, treating JTBD as an outcome-driven approach with templates for extracting jobs from interviews (source: https://www.userinterviews.com/ux-research-field-guide-chapter/jobs-to-be-done-jtbd-framework, jev weight 0.54, authoritative backing).

Practitioner guides decompose a job into functional, emotional, and social dimensions, as in worked examples mapping real companies' products to all 3 (source: https://frameworklist.com/academy/jobs-to-be-done-examples, jev weight 0.15, weak backing).

## Why security products need job framing

Security is a domain where feature-list positioning systematically fails, because the feature list is the competitor's menu too. Every disk-encryption vendor lists the same features: strong ciphers, secure boot, key management. The job framing differentiates by asking what circumstance the customer is trying to make progress in. A job statement has a circumstance, a motivation, and an outcome; for a hardware root of trust product, the individual-developer job reads as a circumstance (owning my own machine's root of trust), a motivation (not trusting a vendor's TPM or cloud enclave), and an outcome (verifiable control on hardware I already own).

The practical test of a well-formed job is that the next-best alternative is inferable from it. If the job is "make progress on owning my root of trust," the alternatives are the built-in TPM, passphrase-only encryption, or doing nothing, and each alternative's weakness points at the product's value claim. Feature-list positioning cannot produce that comparison because features do not name the circumstance.

## Writing job statements for distinct segments

Per-segment job statements differ in circumstance even when the product is identical:

- The individual writes the job around personal control and hardware already owned.
- The team writes it around fleet operations: enroll, rotate, and audit credentials across devices, without joining an enterprise security vendor's platform.
- The budget-constrained organization writes it around visibility and affordability: run real hardware-backed security on a budget that does not assume enterprise procurement, and be able to see and verify what is protecting them.
- The device builder writes it around the firmware trust chain: own the secure boot and measured boot chain without being locked into an OEM's closed implementation.

The same underlying product serves all 4, but the job statements are not paraphrases; each names a different circumstance and therefore a different next-best alternative to beat. That is the operational value of the framework for segmentation: the job statement is the segment boundary drawn in the customer's language rather than the vendor's.

## Jobs and the economic buyer

The job statement is written in the user's language, but the purchase decision belongs to the economic buyer, so mature JTBD practice pairs the job with the buying context. A job the champion loves and the budget holder cannot defend produces interest without revenue. Security jobs map unusually well onto buyer-side metrics (risk reduction, auditability, cost of the alternative) because the outcome metrics Ulwick defines are precisely the measures a budget holder needs to justify spend (source: https://anthonyulwick.com/jobs-to-be-done/, jev weight 0.71, authoritative backing).
