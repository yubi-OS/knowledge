# 01 Designed chain thesis

**Scope:** why curve-compass-skill builds a designed quantized-atom dynamics on the measured Phi(k) potential instead of claiming thermodynamics for the historical corpus, and what that buys: a birth-death chain with detailed balance by construction, an explicit stationary distribution, and a Ginzburg-Landau free energy returned legitimately.

Ground spine: source doc, yubi-OS/yubiOS skills/curve-compass-skill/SKILL.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/curve-compass-skill/SKILL.md). Skill-specific claims below are attributed to the source doc.

## The door that was closed

The source doc states plainly that this skill does not reopen the Ginzburg-Landau door on the historical corpus; it builds a new one next to it, and is explicit about which side of the wall each number lives on. The is-this-x paper closed that door twice (source doc):

1. From the matrix side: the reported "critical point" is the null's own finite-size inflation, and the fluctuation peak, the susceptibility divergence and the critical slowing-down are all falsified or unsupported.
2. From the process side, and more decisively: the corpus's own construction dynamics has zero back-flux in 598 opportunities, so no positive stationary distribution pi makes it reversible, its unique stationary distribution is the absorbing delta at k = 9, and there is no equilibrium ensemble for a Landau free energy to be an expansion of.

A Landau expansion describes fluctuations around an equilibrium ensemble. With a unique absorbing state and no back-flux there is no ensemble to expand around, which is why the paper's closure was decisive rather than merely inconvenient (source doc).

## The thesis

Take the paper's own measured potential Phi(k) and put a designed dynamics on it: a quantized atom that moves plus or minus 1, accepted by Metropolis (source doc). The two atomic moves are:

- atomic positive: flip one MISSING primitive ON, so k moves to k + 1
- atomic negative: flip one PRESENT primitive OFF, so k moves to k - 1

Because Phi is a function of k alone (fact D3, exchangeability, source doc), the induced chain on the coverage count k is a birth-death chain. A birth-death process is the special case of a continuous-time Markov process whose transitions are of only two types, births that raise the state by 1 and deaths that lower it by 1 (https://en.wikipedia.org/wiki/Birth%E2%80%93death_process, jev weight 0.43, weak, used only for this definitional framing).

The stationary distribution is then exactly (source doc):

pi_T(k) = C(9,k) exp(-Phi(k)/T) / Z(T) = exp(-F_T(k)/T) / Z'(T)

with free energy F_T(k) = Phi(k) - T log C(9,k). The source doc calls this the Ginzburg-Landau energy-entropy competition on a bounded lattice, returned legitimately.

## Why the construction carries detailed balance for free

Detailed balance for a transition matrix T and stationary distribution pi is the condition pi(i) T(i,j) = pi(j) T(j,i) for all pairs of states, and it has been the engine of Markov chain Monte Carlo since the method's invention in 1953 (https://en.wikipedia.org/wiki/Detailed_balance, jev weight 0.50). Detailed balance is a strictly stronger condition than plain stationarity: imposing stationarity requires solving a system of N equations, while detailed balance requires N squared equations, so a general Markov chain will not satisfy it (https://personal.math.ubc.ca/~holmescerfon/teaching/asa22/handout-Lecture3_2022.pdf, jev weight 0.73).

The skill's answer to that gap is structural rather than empirical. On a birth-death chain the N squared pair conditions collapse to N local ones, and detailed balance can be used directly to read off the stationary distribution (https://data140.org/textbook/content/chapter-11/balance-and-detailed-balance/, jev weight 0.76). Since the compass chain is birth-death by construction, the detailed balance conditions hold without any statistical argument, which is what the source doc means by "detailed balance by construction" (source doc).

## The free energy is an energy-entropy competition

Landau theory formulates continuous phase transitions through a free energy written as an expansion in an order parameter (https://en.wikipedia.org/wiki/Landau_theory, jev weight 0.17, weak, background only). Ginzburg-Landau theory focuses on the free energy difference between two phases near a transition (https://ocw.mit.edu/courses/6-763-applied-superconductivity-fall-2005/5be78fdccb3cebdb858de63c268a0895_lecture18.pdf, jev weight 0.29, weak, background only).

The compass free energy reproduces exactly this shape on a bounded lattice (source doc): the energy term Phi(k) penalizes incomplete coverage, the entropy term T log C(9,k) rewards the C(9,k) configurations available at coverage k, and T tunes which term wins. Because both terms are explicit and the ensemble exists by construction, the free energy F_T is an expansion around a real equilibrium distribution pi_T, which is the thing the historical corpus never had (source doc).

## What the thesis does not claim

The source doc is emphatic on the boundary: T_x, C(T), chi(T) and Var[k](T) are properties of a designed chain on a measured ladder. The historical log is the T to 0 limit of the designed chain, nothing more (source doc, guidelines 2 and 12). A measurement on the compass is a statement about the designed dynamics; it is never a retroactive claim about the corpus that produced the ladder.

**Sources kept:** 3 results with jev weight at least 0.5 (data140.org 0.76, ubc.ca lecture 0.73, wikipedia Detailed balance 0.50), plus the source doc as primary source of record.
