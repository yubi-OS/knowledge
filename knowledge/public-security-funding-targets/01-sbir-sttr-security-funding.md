# SBIR and STTR as government funding for security R&D

Scope: SBIR and STTR as the US government small-business funding route for cybersecurity R&D, including open-source deliverables, phase structure, and eligibility constraints for an open-source security project.

## What the programs are

The Small Business Innovation Research (SBIR) and Small Business Technology Transfer (STTR) programs, branded America's Seed Fund and powered by the SBA, award non-dilutive funding to develop technology and chart a path toward commercialization. The federal government "invests in your solution and gives you the freedom to run your business according to your vision" (https://www.sbir.gov/, weight 0.95). SBIR and STTR are described by SBA as major sources of early-stage funding for US technology development and commercialization (https://www.sbir.gov/topics, weight 0.83).

The defense-side variant is run by the Department of War's Office for Small Business Innovation. Its SBIR and STTR programs use "a competitive, three-phased process to solicit proposals from small business concerns (SBCs) for research/research and development (R/R&D), production, services, or any combination to meet stated agency needs or missions" (https://www.defensesbirsttr.mil/SBIR-STTR/Program/, weight 0.96). Defense applicants must review both the program BAA or CSO document and the component-specific instruction document for their topic to find eligibility requirements and submission instructions (https://www.defensesbirsttr.mil/SBIR-STTR/Opportunities/, weight 0.91). The Air Force runs its own proposal submission and management system for these programs (https://www.afsbirsttr.us/, weight 0.69).

## Phase structure

The standard structure is three phases (https://www.sbir.gov/apply, weight 0.93):

1. Phase I: feasibility work.
2. Phase II: development based on Phase I results.
3. Phase III: commercialization in the private sector and/or the federal contracting marketplace. No SBIR/STTR funding is awarded in Phase III.

NSF's Seed Fund adds a lineage constraint: only small businesses that have received an NSF SBIR/STTR Phase I award are eligible to apply for Phase II, and Phase II proposals may be submitted between six and 24 months after the start date of the preceding Phase I project (https://seedfund.nsf.gov/solicitation-eligibility/, weight 0.89).

## Eligibility: the hard gate for open-source projects

The eligibility gate is the critical fact for any open-source security project considering this route. The programs "are designed to support small, for-profit, independent, U.S. business concerns" and all awardees must certify at the time of award that the firm meets the size, ownership, and control requirements of the programs (https://www.sbir.gov/sites/default/files/elig_size_compliance_guide.pdf, weight 0.91).

Three consequences follow for a project like an open-source OS hardening effort:

1. A project without a corporate entity cannot apply. The applicant is a firm, not a repository or a maintainer collective.
2. The firm must be US-based, for-profit, and small under SBA size standards, with the ownership and control test certified at award time.
3. The funding is attached to R&D with a commercialization path, not to maintenance of a public good.

## Fit assessment for open-source security work

SBIR/STTR is a poor direct fit for a pre-entity open-source security project, and an indirect fit at best even with an entity in place. The authoritative program pages above support the following reasoning:

- The programs fund the firm's R&D toward commercialization (https://www.sbir.gov/, weight 0.95; https://www.sbir.gov/apply, weight 0.93). An open-source deliverable can appear inside an SBIR work plan, but the award's success criteria run through the business, not the public repository.
- Defense SBIR topics are driven by stated agency needs and missions (https://www.defensesbirsttr.mil/SBIR-STTR/Program/, weight 0.96), which means the roadmap is set by the solicitation, not by the project's own readiness gates. That is exactly the roadmap-distortion pattern a funding screen should catch.
- The Phase II lineage rule at NSF (https://seedfund.nsf.gov/solicitation-eligibility/, weight 0.89) means the realistic entry point is a Phase I award, which is a multi-month commitment before any security-relevant deliverable ships.

## Practical conclusion

Treat SBIR/STTR as a target only if a US small-business entity exists and a specific solicitation topic matches a deliverable the project would build anyway. Otherwise the eligibility gate (small, for-profit, US, certification at award, https://www.sbir.gov/sites/default/files/elig_size_compliance_guide.pdf, weight 0.91) excludes the project outright. For a single-founder open-source effort without a company, this program family should sit behind foundation and maintainer-fund targets, not ahead of them. Verify current solicitations and deadlines on the program's own site before any application; these programs run on rolling topic cycles (https://www.sbir.gov/topics, weight 0.83).
