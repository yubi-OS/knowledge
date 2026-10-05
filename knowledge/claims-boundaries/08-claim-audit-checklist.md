# 08 - The claim audit: a pre-publication review process

Scope: Operationalizing the boundary: a pre-publication claim review process mapping each marketing claim to a bounded control or evidence artifact.

## The regulatory floor: prove before you publish

The process starts from the substantiation duty documented in doc 03, restated here as the operating rule. The FTC's substantiation material requires that before disseminating an advertisement, the advertiser must substantiate all claims, express and implied, that the ad conveys to reasonable consumers [1] (jev weight 0.92, archived under this doc's dig queries). The FTC Policy Statement frames the review question the same way an internal audit should: assess the adequacy of the substantiation the advertiser possessed before the claim was made [2] (jev weight 0.97, archived under this doc's dig queries). A weakly weighted legal handbook adds a refinement that matters for technical claims: the proof must exist before dissemination, not after a challenge arrives, and a claim that names its own evidence is held to exactly the evidence it named [3] (jev weight 0.24, weak backing). That last clause is directly useful for security marketing: if the campaign cites "our threat model", the audit holds the claim to the threat model's actual scope.

## The institutional model: prepublication review

Two government sources anchor the review-step pattern. The Department of Defense runs the Defense Office of Prepublication and Security Review, which manages the security review program for written materials intended for public and controlled release, including materials submitted by cleared or formerly cleared individuals [4] (jev weight 0.88, archived under this doc's dig queries). A DoD description of the security and policy review states its function: information proposed for public release is examined to ensure compliance with policy and to determine that it contains no classified, controlled unclassified, or export-controlled information [5] (jev weight 0.47, weak backing). The transferable structure is not the classification regime; it is the gate. Public release of security-relevant text passes a review whose checklist comes from a different document than the text being released.

## Cross-functional composition

Weakly weighted legal-practice material describes who staffs such a review on the commercial side: the marketing department, the research and development team, and the legal department work together to determine the appropriate claims to make and how to substantiate them [6] (jev weight 0.28, weak backing). For a security product this maps to marketing, the threat-model owners, and whoever owns external communications. The R&D seat is the one that can say "the threat model does not bound that sentence".

## Templates and evidence records

Weakly weighted workflow resources show the record structure such a review produces: marketing claims organized with product claims, evidence records, reviewer decisions, approval conditions, and approved wording before publication [7] (jev weight 0.37, weak backing); a readiness checklist for teams making claims about security posture, spanning product marketing, security, legal, compliance, and founders [8] (jev weight 0.18, weak backing); and general marketing-compliance checklists that examine all materials with attention to claims, disclosures, and visuals, verifying statements are true [9] (jev weight 0.28, weak backing). A weakly weighted review-guide source lists the concrete review steps: classify claims, test substantiation, research the applicable standard, verify citations, and route the memo to approvers [10] (jev weight 0.10, weak backing).

## The claim-to-bound mapping table

Assembling the sources into the operating artifact, each campaign sentence gets a row:

| Column | Filled from | Backing |
|---|---|---|
| Claim text | the campaign surface | [1] (0.92): express and implied claims both listed |
| Claim type | express or implied | [1] (0.92) |
| Bounding document | threat model scope + architecture | doc 04 sources (0.84 to 0.90) |
| Evidence artifact | architecture doc, certificate, SECURITY.md row | doc 05 sources (0.53 to 0.95) |
| Status label | README badge + SECURITY.md table | doc 06 sources (0.65 to 0.92) |
| Reviewer decision | marketing + R&D + legal jointly | [6] (0.28, weak) |
| Approved wording | exact sentence that may ship | [7] (0.37, weak) |

The row with the weakest source weight is the review composition, and the rows with the strongest are the ones that bind the claim to a document. That weighting mirrors the risk: mapping a claim to its bound is the step that fails silently, while the cross-functional meeting fails loudly.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | FTC, advertising substantiation PDF: https://www.ftc.gov/sites/default/files/attachments/training-materials/substantiation.pdf | 0.92 |
| 2 | FTC Policy Statement Regarding Advertising Substantiation: https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation | 0.97 |
| 3 | Lawwise, substantiation before a claim is made: https://lawwisegroup.com/handbook/substantiation-before-a-claim-is-made/ | 0.24 (weak) |
| 4 | DoD Publication Security Review: https://www.war.gov/Contact/Help-Center/Article/Article/2762947/publication-security-review/ | 0.88 |
| 5 | DoD security and policy review: https://www.dami.army.pentagon.mil/site/InfoSec/TP-SecRev.aspx | 0.47 (weak) |
| 6 | KTS Law, advertising claims substantiation: https://ktslaw.com/-/media/Feature/Advertising-Claims/Advertising-Claims-Substantiation.pdf | 0.28 (weak) |
| 7 | Veridat, marketing claims templates and approved claims library: https://www.getveridat.com/resources/evidence-backed-marketing-claims-template | 0.37 (weak) |
| 8 | Veridat, cybersecurity claims readiness checklist: https://www.getveridat.com/resources/cybersecurity-claims-readiness-checklist | 0.18 (weak) |
| 9 | Process Street, marketing compliance checklist: https://www.process.st/templates/marketing-compliance-checklist/ | 0.28 (weak) |
| 10 | Task Machine, how to review marketing claims: https://taskmachine.io/guides/review-marketing-claims | 0.10 (weak) |
