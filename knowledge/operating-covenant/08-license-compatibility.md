# 08. License compatibility

Scope: LGPL-2.1 (and copyleft generally) as the baseline guarantee beneath a covenant: commercial use, distribution, forking, and the rule that a covenant adds no restriction beyond the license.

## What LGPL-2.1 grants

The GNU Lesser General Public License version 2.1 is the license text a covenant typically sits on top of [1] (weight 0.94). Its practical effect, as summarized in third-party license explainers: you may copy, distribute, and modify the software, provided you state modifications and license them under LGPL-2.1 [2] (weight 0.34, weak backing). The license permits commercial use and distribution; what it requires in return is that the covered work and its modifications stay under the same terms.

## Copyleft is the structural guarantee

The FSF's definition: copyleft is a general method for making a program free (in the sense of freedom, not zero price) and requiring all modified and extended versions of the program to be free as well [3] (weight 0.96). This is why a covenant does not need to re-legislate fork rights: the license already makes forking and continued freedom structural. The covenant's job is to commit to not using non-license levers (trademark, channels, hosted services) against what the license protects.

## No additional restrictions

The FSF explicitly campaigns on protecting free software against confusing additional restrictions: the GNU licenses were designed with care so copyright holders have a tool to release programs as free software in a way that stands up downstream [4] (weight 0.87). The covenant principle that follows: every covenant clause must be written so it cannot be read as an added legal restriction on the licensed work. Clauses about the project's own conduct (what the project will sell, publish, or collect) are fine; clauses restricting what *users or forks* may do would be additional restrictions.

The FSF's recommended copyleft list positions licenses for projects and their documentation [5] (weight 0.87); the presence of a maintained license family gives a covenant a stable floor to reference.

## Contrast with permissive licensing

Apache-2.0, by contrast, is a permissive license whose main conditions are preservation of copyright and license notices, with an express patent grant from contributors and permission to distribute larger works under different terms [6] (weight 0.61). A covenant layered on a permissive license has to carry more weight itself, because the license does not enforce downstream freedom. On a copyleft base like LGPL-2.1, the covenant and the license reinforce each other: the license guarantees the code stays free, the covenant guarantees the steward's conduct.

## The compatibility checklist for covenant drafting

1. **Commercial use stays permitted.** Any clause that conditions commercial use of the free artifact on payment or permission is a license violation, not a covenant clause.
2. **Forks stay free.** Covenant language binds the project and its commercial layer, never the fork.
3. **No field-of-use limits.** Restricting who may use the trust chain (e.g. "non-commercial security use only") is an additional restriction.
4. **Conduct commitments live outside the license.** The covenant is a promise about the steward's behavior, enforceable socially and reputationally; it must not be drafted as a license extension.

## Caveats

The license text itself and the FSF positions are strongly backed. The practical-effects summary is weakly backed (license explainer site) and labeled as such; verify against the license text [1] (weight 0.94) before relying on it legally. Community forum answers on LGPL use in commercial apps are weakly backed (0.07) and are not relied on here.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html | 0.94 |
| 2 | https://www.tldrlegal.com/license/gnu-lesser-general-public-license-v2-1-lgpl-2-1 | 0.34 |
| 3 | https://www.gnu.org/licenses/copyleft.html | 0.96 |
| 4 | https://www.fsf.org/blogs/licensing/protecting-free-software-against-confusing-additional-restrictions | 0.87 |
| 5 | https://www.gnu.org/licenses/recommended-copylefts.html | 0.87 |
| 6 | https://choosealicense.com/licenses/apache-2.0/ | 0.61 |
| 7 | https://softwareengineering.stackexchange.com/questions/47323/can-i-use-an-lgpl-licenced-library-in-my-commercial-app | 0.07 |
| 8 | https://handwiki.org/wiki/Software:BSD_licenses | 0.12 |
| 9 | https://handwiki.org/wiki/Software_license | 0.19 |
| 10 | https://www.imdb.com/title/tt0120338/ | 0.04 |
| 11 | https://retailwire.com/discussion/krogers-one-stop-digital-coupon-center/ | 0.03 |
| 12 | https://github.com/MHSanaei/sponsors | 0.08 |
