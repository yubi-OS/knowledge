# 01 WLF equation fundamentals

Scope: the Williams-Landel-Ferry equation itself, the log(a_T) form, the universal constants C1 = 17.4 and C2 = 51.6 at T_ref = T_g, and what the shift factor a_T physically means.

## The equation and its constants

The Williams-Landel-Ferry equation is an empirical equation associated with time-temperature superposition (weight 0.72, https://en.wikipedia.org/wiki/Williams%E2%80%93Landel%E2%80%93Ferry_equation). It has the form log(a_T) as a function of temperature T and a reference temperature T_r, with C1 and C2 as empirical constants, and it is the standard tool for constructing compliance master curves (weight 0.72, same source).

The reference temperature is always chosen at the glass transition temperature T_g, and the universal coefficients reported by Williams, Landel and Ferry in 1955 are C1 = 17.4 and C2 = 51.6 (weight 0.73, https://www.sciencedirect.com/topics/engineering/williams-landel-ferry-equation). These two numbers are the reason the WLF equation is usable as a default: for a broad class of amorphous polymers near T_g the shift factor is already parameterized, and a measurement program does not need to fit its own constants before it can start shifting curves.

The WLF equation is not the only relation of its kind. Survey treatments of time-temperature superposition list three equations in regular use: Williams-Landel-Ferry, Vogel-Fulcher-Tammann-Hesse, and Arrhenius-type relations (weight 0.93, https://pmc.ncbi.nlm.nih.gov/articles/PMC6418538/). The relevance for any analogy built on WLF is that the constants are tied to a specific regime: the equation describes time and temperature behavior of polymers in the glass transition region, and it rests on the assumption that above the glass transition temperature the fractional free volume increases linearly with temperature (weight 0.68, https://www.tainstruments.com/pdf/literature/RN11.pdf). Outside that regime the constants stop being universal.

## What the shift factor means

The shift factor a_T is a time multiplier that adjusts the time axis of a reference curve so that measurements taken at other temperatures line up with it (weak backing, weight 0.40, https://www.sciencedirect.com/topics/engineering/temperature-shift-factor). In the WLF picture the shift factor of an amorphous polymer changes with temperature near the glass transition, and it is the mathematical engine that collapses rheology measured at many temperatures onto a single master curve (weak backing, weight 0.43, https://metricgate.com/docs/williams-landel-ferry-shift/).

Two properties of a_T matter for any system-level reading of the equation:

1. It acts on the time axis only. Shifting changes when things happen, not how they happen. The shape of the response curve is carried through unchanged (weight 0.72, https://en.wikipedia.org/wiki/Williams%E2%80%93Landel%E2%80%93Ferry_equation).
2. It is a single scalar per temperature. One number per experimental condition is what makes superposition tractable at all; if the shift needed depends on the part of the curve being moved, a single a_T is no longer a complete description (weight 0.93, https://pmc.ncbi.nlm.nih.gov/articles/PMC6418538/).

## Why the constants matter as an analogy anchor

The structure to carry over to a policy-version reading is specific and narrow. The WLF equation says: for the right class of material, in the right temperature regime, every response curve at temperature T is the reference curve translated along log time by an amount given by one closed-form expression with two fitted constants. The empirical claim behind C1 = 17.4 and C2 = 51.6 is that this translation is so regular across many polymers that the constants can be written down once, globally (weight 0.73, https://www.sciencedirect.com/topics/engineering/williams-landel-ferry-equation).

The load-bearing caveat is the regime boundary. The equation is derived for the glass transition region and its free-volume assumption is stated for above T_g (weight 0.68, https://www.tainstruments.com/pdf/literature/RN11.pdf). An analogy that imports the constants without importing the regime condition inherits a claim the source never made. For a corpus policy study, the honest version is: C1 and C2 show what a mature shift-factor law looks like when one exists, and they are the target form any policy-temperature law would have to earn through data, not assume.
