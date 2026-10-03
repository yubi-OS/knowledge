# Time-Temperature Superposition

**Scope:** For thermorheologically simple materials, temperature shifts the log-time viscoelastic response curve horizontally without reshaping it; the shift factor, the WLF and Arrhenius forms, master curves, and effective time extend viscoelastic analysis to arbitrary temperature histories.

## Thermorheologically simple materials

In simple materials such as polyisobutylene and other amorphous thermoplastics with few complicating microstructural features, the time-temperature relation is described by simple models; such materials are termed thermorheologically simple (Roylance, Engineering Viscoelasticity, MIT, 2001, sec. 4.5, primary, verified from the attached PDF). Lowering the temperature shifts the viscoelastic response plotted against log time to the right without change in shape, equivalent to increasing the relaxation time tau while leaving the glassy and rubbery moduli or compliances unchanged. Bohrium's reference entry restates the same definition: viscoelastic properties at different temperatures interrelate by a simple time shift (https://www.bohrium.com/en/sciencepedia/feynman/keyword/thermorheologically_simple_materials, jev 0.42). With multiple relaxation times, thermorheological simplicity demands all share the same shift factor, or the curve would change shape as well as position (Roylance 2001, primary).

## The shift factor

The time-temperature shift factor aT(T) is the horizontal shift applied to a response curve measured at temperature T to move it onto the curve at reference temperature Tref (Roylance 2001, Eqn. 47, primary):

$$\log a_T = \log \tau(T) - \log \tau(T_{ref})$$

Wikipedia's time-temperature superposition article states the same principle: master curves at a reference temperature predict curves at other temperatures via a shift operation (https://en.wikipedia.org/wiki/Time%E2%80%93temperature_superposition, jev 0.41).

## Arrhenius form

If the relaxation time obeys tau(T) = tau0 exp(E-dagger / RT), the shift factor follows:

$$\log a_T = \frac{E^\dagger}{2.303R}\left(\frac{1}{T} - \frac{1}{T_{ref}}\right)$$

where 2.303 = ln 10 converts natural to base 10 logarithms (Roylance 2001, Eqn. 48, primary). The Arrhenius treatment usually applies to secondary polymer transitions; the glass-rubber primary transition is governed by other principles (Roylance 2001, primary). The bitumen rheology literature traces the shift factor to Doolittle's free-volume formulation (http://hdl.handle.net/10204/9762, jev 0.41).

## The WLF equation

Near or above the glass temperature, the Williams-Landel-Ferry equation applies (Roylance 2001, Eqn. 49, primary):

$$\log a_T = \frac{-C_1 (T - T_{ref})}{C_2 + (T - T_{ref})}$$

C1 and C2 depend on material and reference temperature. When Tref is the glass temperature Tg, the constants often assume universal values (Roylance 2001, Eqn. 50, primary):

$$\log a_T = \frac{-17.4 (T - T_g)}{51.6 + (T - T_g)}$$

with T in Celsius; C1 = 17.4 and C2 = 51.6. The Wikipedia WLF article gives the same form with C1, C2 as empirical constants (https://en.wikipedia.org/wiki/Williams%E2%80%93Landel%E2%80%93Ferry_equation, jev 0.41). The original paper: M.L. Williams, R.F. Landel, J.D. Ferry, J. Am. Chem. Soc., Vol. 77, No. 14, pp. 3701-3707, 1955; it developed the relation empirically and rationalized it via free-volume concepts (citation verified from Roylance footnote 4, primary).

## Master curves

Creep or relaxation data over a range of temperatures converts to a single master curve by horizontal shifting: one curve is the reference, the others shift onto it, each yields its own aT so the shift factor becomes a tabulated function of temperature. Curves below the reference temperature sit at longer times and shift left, a positive shift under this sign convention. The master curve is valid only at the reference temperature but serves other temperatures after shifting by the appropriate log aT (Roylance 2001, primary). A practical guide describes the identical workflow: compute WLF shift factors relative to a reference temperature, then build the master curve from frequency-dependent data (https://www.polymerhubofindia.com/lessons/time-temperature-superposition-wlf-shifts-and-rheological-master-curves, jev 0.40). A Journal of Sound and Vibration paper on thermorheologically simple materials confirms master curves plus temperature-dependent shift factors as the standard basis for simulating response under arbitrary thermal histories (https://www.sciencedirect.com/science/article/pii/S0022460X17303772, jev 0.42).

## Effective time under varying temperature

For a sequence of temperature steps, each step's real time divides by its shift factor: t' = sum of t_j / aT(T_j). Worked example (Roylance 2001, Example 10, primary): 10 hours at 20 C followed by 5 minutes at 50 C, log shift factor for 50 C relative to 20 C equal to -2.2. The equivalent time at 20 C is t2' = 5 min / 10^-2.2 = 792 min = 13.2 h, so 5 minutes at 50 C equals over 13 h at 20 C; total effective time t' = 10 + 13.2 = 23.2 h. For continuous histories T(t) the effective time generalizes to (Roylance 2001, Eqn. 51, primary):

$$t' = \int_0^t \frac{d\xi}{a_T(\xi)}$$

Roylance's Example 11 evaluates this integral numerically for a sinusoidal temperature varying plus or minus 5 C around 20 C, using the WLF form offset so the shift is zero at the mean temperature (primary).

## Generalization to other accelerating factors

The effective-time structure is not limited to temperature: damage due to applied stress or environmental exposure accelerates or retards response rates and is described by a time-expansion factor like aT but dependent on other variables (Roylance 2001, primary). This is why accelerated testing protocols for polymers build on TTS machinery (https://www.academia.edu/33503436/Thermorheologically_simple_materials_A_bayesian_framework_for_model_calibration_and_validation, jev 0.42).

## Sources considered

| Source | Type | jev weight | Use |
|---|---|---|---|
| Roylance, Engineering Viscoelasticity, MIT 2001, sec. 4.5 (session/visco-extract.txt) | Course notes, primary | direct verification | Main anchor: Eqns. 47-51, Examples 10-11 |
| Williams, Landel, Ferry, JACS 77:3701-3707, 1955 | Journal paper, primary | direct verification via Roylance footnote | Original WLF citation |
| en.wikipedia.org/wiki/Time%E2%80%93temperature_superposition | Encyclopedia | 0.41 | TTS principle corroboration |
| en.wikipedia.org/wiki/Williams%E2%80%93Landel%E2%80%93Ferry_equation | Encyclopedia | 0.41 | WLF form corroboration |
| handwiki.org/wiki/Physics:Time–temperature_superposition | Encyclopedia mirror | 0.41, 0.42 | Duplicate content, not used |
| sciencedirect.com/science/article/pii/S0022460X17303772 | Journal paper | 0.42 | TTS in model calibration |
| academia.edu/33503436/ | Aggregator copy | 0.42 | Accelerated testing context |
| bohrium.com/.../thermorheologically_simple_materials | Reference site | 0.42 | Definition restatement |
| hdl.handle.net/10204/9762 | Institutional repository | 0.41 | Doolittle free-volume lineage |
| polymerhubofindia.com/lessons/time-temperature-superposition-wlf-shifts-and-rheological-master-curves | Educational site | 0.40 | Workflow corroboration |
| fractan.net/guides/time-temperature-superposition-wlf-equation | Blog guide | 0.41 | Not used, low authority |
| time.is/ | Unrelated result | 0.41 | Rejected, off-topic |
