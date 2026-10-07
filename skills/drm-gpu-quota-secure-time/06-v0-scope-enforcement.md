Scope: what a hard cutoff can actually bottom out in, and the v0 ordering that ships value without firmware changes.

## Enforcement must bottom out in a real primitive

"Revoke IOMMU mappings", "fence GPU context", and "reset GPU" are Linux DRM/IOMMU-API operations: drm_sched_stop()-family fencing, IOMMU domain detach/invalidate, and driver-specific reset ("source doc"). They are not something a secure monitor can do to a normal-world GPU driver's live state without cooperation. The secure world can cut power and clocks; it cannot walk the normal world's job queue, fences, and mappings, because those are normal-world data structures.

The dig gives the map of the Linux-side surface: the kernel's GPU documentation index (https://docs.kernel.org/gpu/index.html, weight 0.54), the memory-management portion of the DRM docs (https://docs.kernel.org/gpu/drm-mm.html, weight 0.48 weak), the scheduler source where the stop/fence machinery lives (https://github.com/torvalds/linux/blob/master/drivers/gpu/drm/scheduler/sched_main.c, weight 0.45 weak), and the user-space API face of IOMMU operations (https://www.kernel.org/doc/html/latest/userspace-api/iommufd.html, weight 0.34 weak). These are corroborations of where the primitives live, not claims the source doc lacks.

## The realistic v0 architecture

The realistic v0 is: Linux enforces, meaning deny, kill, or reset, and the SMC path is only useful for cutting power or clocks at a level Linux cannot be trusted to self-police, such as compromised-userspace scenarios ("source doc"). Do not build the SMC mailbox before the Linux-side accounting and enforcement are working and proven necessary. The SMC tier is the second escalation tier, not the first thing to ship.

## The recommended v0 scope, in order

The source doc gives an ordered scope:

1. Panfrost BO create/submit accounting per cgroup-id, with soft and hard in-kernel limits: deny allocation and deny submit. This ships value with zero firmware changes. It is the composition of the hook points in doc 03 and the identity scheme in doc 04.

2. Only if self-policing of the normal world is insufficient for the threat model, design the SiP SMC call plus TF-A dispatch as a second PR with its own ADR. That is the proposal in doc 05, gated behind demonstrated need rather than architectural enthusiasm.

The ordering is the point. Tier 1 is a driver patch against a verified surface. Tier 2 is firmware surgery with its own supply-chain and rollback properties, and it is only reachable once tier 1 exists to be escalated from. A design that starts at tier 2 has no accounting to escalate and no evidence the escalation is needed.

## What failure looks like without this ordering

Two failure modes are worth naming. First, the invented-symbol failure: tier 1 built on hallucinated cgroup or Panfrost names compiles against nothing. Second, the misplaced-enforcement failure: tier 2 built as if the secure monitor could revoke mappings or fence contexts directly, which it cannot ("source doc"). Both are the specific errors the source doc was written to correct, and both are avoided by the same discipline: verify symbols against the real tree, and let the kernel do the enforcing until it demonstrably cannot.

## What tier 1 actually enforces, concretely

Tier 1's enforcement actions are the two denials from doc 03: fail the create-BO ioctl with -EDQUOT or -ENOMEM when the cgroup is over limit, and reject the submission when the submitting context is already over quota ("source doc"). Both are ordinary kernel-side decisions: no state is torn down, no GPU work is interrupted mid-job, and no firmware participates. The soft/hard split the source doc describes ("source doc") maps cleanly onto this: a soft limit can warn or throttle while a hard limit denies, and both are in-kernel policy knobs over the same two hooks.

That is what "ships value with zero firmware changes" means in practice ("source doc"): a Rockchip board running the tier-1 kernel gets per-cgroup GPU memory containment with the firmware stack untouched, no TF-A rebuild, no re-signing, no boot-chain consequence. Everything the immutability stack protects (doc 08) stays byte-identical.

## What tier 2 adds, and why it needs cooperation

The second tier's value is the scenario the source doc names: a compromised normal world that will not honor the kernel's own denials ("source doc"). In that scenario the kernel is the untrusted enforcer, so the cutoff has to happen below it: power and clocks, which are secure-world-controlled resources. The SMC proposal (doc 05) is the transport for that. But note what even tier 2 does not claim: it does not revoke IOMMU mappings or fence contexts from secure world, because those operations are Linux data-structure manipulations ("source doc"). The secure world's lever is coarser, and that is by design; the finer-grained containment still has to happen in the kernel, tier 2 just guarantees the kernel's decisions about power cannot be undone.

## Reading the scope ordering as a threat-model gate

The conditional in the source doc's step 2 is doing real work: "only if self-policing normal world is insufficient for the threat model" ("source doc"). That makes tier 2 a threat-model decision, not an architectural preference. If the board's threat model stops at compromised userspace, tier 1 plus kernel-level containment may be sufficient, because the kernel is trusted relative to userspace and the denials bind. Tier 2 earns its cost only when the compromise model extends to the kernel itself. Recording that reasoning in the ADR the source doc requires ("source doc") is what keeps a future reader from re-litigating the ordering, or worse, shipping tier 2 because it looks more impressive.

The two failure modes this ordering prevents are the ones the whole skill was written against: proposed mechanisms quoted as upstream fact, and enforcement credited to a layer that cannot perform it ("source doc").
