# 06. Where PAC Stays

*Scope: the boundary of PWC. PWC dissolves the controller only where the controller would be a program. Physical presence, irreversible operations, recovery paths, and the firmware below the OS stay PAC with the owner as controller, on purpose.*

## The boundary rule

PWC is a claim about controllers that are themselves programs, not about control in the abstract. The doctrine dissolves the controller only where the controller would be a program: a watcher that runs on something, must be patched, and can be subverted or bypassed. It never dissolves the owner. This is stated in one line in PWC.md and it is the load-bearing line: a structure can carry control where control is a matter of structure and verification, but a human cannot be replaced by a structure where control requires judgment.

The inverse test from the source doc: where staying safe requires judgment about the physical world, about irreversibility, or about intent, a controller is the honest choice. Where staying safe is a matter of structure and verification, a controller is overhead and a target, and it should be dissolved. Everything in this doc is an application of that test.

## Physical presence

Disk unlock, login, and administrative identity on yubiOS require the YubiKey, its PIN, or its touch (ADR-003). The touch is the clearest case. It is a controller that no software can impersonate, and it is deliberately kept out of the program. No construction, no verification-at-use mechanism, and no ledger can substitute for a finger: the property being enforced is that a human body is present and intends this action, and that property is not reachable by code. Automating it away would dissolve the wrong controller.

## Irreversible operations

Fuse burns, RPMB key writes, and Secure Boot key enrollment are PAC with a human as the controller, on purpose. The doctrine names the discipline: these operations are documented, rehearsed on sacrificial hardware, and never automated past a human gate. The reason is the judgment clause. A burned fuse cannot be un-burned; no structural mechanism can make an irreversible act reversible, so the only control that remains is intent, and intent lives in a person. This is the strongest statement in the source doc that PAC is not a transitional state waiting to be engineered away.

## Recovery

The recovery path is the designed exception to every controller-free mechanism. It is held offline and separated from the credentials it recovers. A controller-free mechanism has one structural weakness the source doc names plainly: when a load-bearing assumption breaks, no one is watching, because there is no one. Recovery is where that weakness is paid for. The path stays outside every dissolved-watcher mechanism precisely so that it survives the failure of any one of them.

## The firmware below the OS

On x86-64, and today on most of ARM64, the lower firmware layers remain OEM-controlled. This is PAC that yubiOS does not own and cannot dissolve. MITIGATE.md names this honestly rather than pretending otherwise. The boundary rule cuts both ways here: the doctrine obligates you to dissolve controllers you own and obligates you to admit controllers you do not. Pretending the lower firmware is under structural control would be a PWC claim without a named mechanism, which the source doc classifies as ungoverned.

## PAC is not a failure word

The non-negotiables close the loop. Where control requires judgment, PAC with a human controller is the correct and final answer, and dissolving it would be a regression. Three further constraints bind any doc that claims a PWC mechanism: no controller-free mechanism ships without naming the structural mechanism that replaces the watcher (construction, verification at use, or record); evidence is the second half of the claim, not an optional extra, because the append-only record is the alarm that stands in for the watcher that no longer exists; and the owner is never the component PWC dissolves.

## Where each model applies

The source doc compresses the boundary into a decision table. The unsafe state can be made unreachable: PWC by construction, because there is no runtime dependency on anyone behaving. The state is reachable but foreign: PWC by verification at use, because there is no gap between check and use and therefore no TOCTOU. The state is legitimate but must not pass silently: PWC by record, because falsifiability works without a gatekeeper. The act is irreversible, physical, or requires intent: PAC, and the controller is the owner, because judgment is not a property of structure. Doc 06 is the last row, written out.
