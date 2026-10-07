# 08 Related Doctrines

*What PWC shares with, and where it departs from, capability security, complete mediation, self-stabilizing systems, formal verification, and zero trust.*

## What the dig corpus backs

The weighted dig for this doc returned results for one doctrine only: Saltzer and Schroeder's design principles. Those claims carry URLs and jev weights below. The other adjacencies in this doc's scope (capability security in the Dennis and Van Horn and Levy line, self-stabilizing systems, formal verification on the seL4 line, zero trust) are treated conceptually: they are mapped against the source doc's own mechanisms, and no external fact about them is asserted, because the dig carried no weighted results for them. Under this corpus's contract, an unbacked claim is deleted, not softened. What follows for those doctrines is analysis of shape, not citation.

## Saltzer and Schroeder: the shared vocabulary

Saltzer and Schroeder's 1975 paper named 8 design principles: economy of mechanism, fail-safe defaults, complete mediation, open design, separation of privilege, least privilege, least common mechanism, and psychological acceptability [1]. The 1975 date is weakly backed at weight 0.47 [5] and carries that label. PWC sits inside this vocabulary rather than against it, and two of the 8 principles do most of the work.

**Complete mediation.** The principle: every access to every object must be checked for authority, and this check is the primary underpinning of a protection system [4][2]. PWC's control by verification at use is complete mediation taken to its limit. The source doc requires that the check and the use are the same act, so there is no gap between the check and the thing checked and therefore no TOCTOU. A watcher that mediates from a distance can claim complete mediation in the diagram while missing paths outside its vantage; the dm-verity read path achieves it in the only place it can be true, at the read. What PWC adds: complete mediation usually presupposes a mediator, a program standing at the access point. PWC asks whether that mediator can be dissolved into the access mechanism itself, and dissolves it when it can.

**Fail-safe defaults.** Deny access by default and grant on permission rather than exclusion [3][2]. The yubiOS build admission gate is this principle applied at the boundary: it refuses to let a build start on unpinned or floating inputs. That is fail-safe defaulting as a filter, not surveillance, and it is the strongest placement the principle allows.

**Economy of mechanism.** Keep the protection mechanism small and simple [1]. Dissolving a controller is economy of mechanism taken structurally: the watcher was the largest and most attack-exposed component of the mechanism, and removing it shrinks the mechanism more than any simplification inside it could.

## Capability security: authority as structure

Capability security moves authority into an unforgeable reference the program holds, so permission is something the program carries rather than a decision made about it at call time. That is the source doc's construction mechanism in another idiom: the capability was never granted, so the unsafe access does not exist to be reached. What it shares with PWC is the refusal to make authority a runtime negotiation with a policy actor. What it misses, from PWC's side: capability systems still enforce at a mediation point that decides whether a presented capability is honored, and that mediator is a program, which is attack surface. PWC's question is the one capability doctrine leaves open: can the mediation itself move into the structure, as the composefs signed catalog does, where the mount is the comparison and no process decides anything?

## Self-stabilizing systems: recovery instead of prevention

A self-stabilizing system is designed to return to correct behavior from an arbitrary starting state without an external corrector. The shared goal with PWC is exact: no standing supervisor. The mechanism is the opposite. PWC prevents the wrong state or detects it at the moment of use; stabilization accepts the wrong state and repairs it. The source doc's record mechanism is the nearer cousin, since the append-only ledger repairs nothing, it makes the damage falsifiable. Where repair is genuinely required, stabilization is the honest adjacent answer, and the source doc's evidence rule still applies: convergence must be observable, or the claim is ungoverned.

## Formal verification: construction made provable

Formal verification, on the seL4 line, is control by construction with a proof attached: instead of asserting the unsafe state was designed away, show that it is unreachable. This is the strongest form of the source doc's first mechanism, made checkable by an outsider rather than trusted from the inside. What PWC contributes is the warning the proof work needs: every proof rests on pinned assumptions, the specification, the hardware model, the toolchain, and a floor that silently shifts is a control that silently stopped. The PINNED.md discipline is the record half that verification alone does not supply.

## Zero trust: PAC hardened

Zero trust keeps the controller and multiplies it: verify every request, grant no implicit trust, check continuously. It is PAC made denser, a controller at every boundary, and each of those controllers is a program that must be patched and can be lied to or bypassed, exactly the structural costs the source doc counts. PWC does not disagree about distrust; it disagrees about placement. Admission at the boundary, as in the Rego build gate, is fine. Continuous verification of the interior is surveillance of the interior, and PWC's answer is to make the interior self-verifying so the watchers have nothing to watch.

## What PWC adds to all four

Each doctrine carries one of PWC's mechanisms and stops before the question PWC insists on: naming which structural mechanism replaced the watcher, and what evidence proves the replacement still holds. Complete mediation stops at the mediator. Capabilities stop at the enforcement point. Stabilization stops at recovery without falsifiability. Proofs stop at unpinned assumptions. Zero trust never stops multiplying controllers at all. The doctrine in one line: adopt the adjacent mechanism, then dissolve what is left of the controller, or say honestly why it stays.

## Sources

| source | url | jev weight |
| --- | --- | --- |
| Saltzer and Schroeder, The Protection of Information in Computer Systems (annotated text) | https://www.cs.virginia.edu/~evans/cs551/saltzer/ | 0.81 |
| Saltzer and Schroeder's design principles, Security Reference Architecture | https://nocomplexity.com/documents/securityarchitecture/architecture/saltzer_designprinciples.html | 0.7 |
| Saltzer's and Schroeder's Design Principles (UC Davis course notes) | https://nob.cs.ucdavis.edu/classes/ecs153-2000-04/Pdf/design.fm.pdf | 0.65 |
| The Security Principles of Saltzer and Schroeder (Shostack + Associates) | https://shostack.org/blog/the-security-principles-of-saltzer-and-schroeder | 0.51 |
| The Protection of Information in Computer Systems (Wikipedia) | https://en.wikipedia.org/wiki/The_Protection_of_Information_in_Computer_Systems | 0.47 (weak backing) |
