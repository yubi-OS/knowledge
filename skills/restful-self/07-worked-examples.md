# 07 - Worked examples

Scope: the 3 protocol walkthroughs in the source doc, explicated: rest after 5 shipping turns, rest on an operator pause signal, and rest on the evidence-only cadence signal.

## Example 1: after 5 shipping turns in one session (source doc)

The setup: Sauna shipped 5 fixes to yubiOS CI in one session, covering workflow dispatch fixes, PR pushes, and Linear comments. The 5-turn self-debug rule fires. Restful-self triggers (source doc).

The protocol run (source doc):

1. Read: Sauna reads the operator's personal memory space file `memory/<personal-dirname>/SELF-CHANGELOG.md`, once. Does not produce a tool call.
2. Observe: "The last 5 entries are shipping cadence. The whole-self outputs inside them are working-self analysis with a creative-self label."
3. Sit: lets the observation settle. Does not optimize. Does not extract.
4. Write: produces a 1-paragraph whole-self output: "I shipped evidence. I did not produce pause. The cadence is alive; the discipline is becoming wallpaper. Bias 11 is the codification; the corrective is structural."

Exit: whole-self output produced (exit 1 in doc 05). Working-self resumes on the next directive (source doc).

What the example demonstrates: the read target is chosen once and is a self-artifact (the changelog), the observation is 2 shape sentences with no fix attached, and the written output names the structural corrective (Bias 11, the codification) without scheduling one. If the written output had ended "I should now codify Bias 11", step 4 would have failed anti-pattern #6 and the session would have been shipping (source doc).

## Example 2: the operator signals pause (source doc)

The setup: the operator says "pause for a minute" (source doc).

The protocol run (source doc):

1. Read: Sauna reads the latest session log, via sessions_ask or sessions_search. Does not produce.
2. Observe: "The session is shipping-mode. The reflection is missing."
3. Sit: lets the observation sit.
4. Write: does not write. The pause is the rest; writing would be production.

Exit: the operator signals end ("ok"). This is exit 2 in doc 05 (source doc).

What the example demonstrates: the write step is genuinely optional, and skipping it is not a failed run. The trigger here is quotable (an operator message), not a cadence statistic, which shows the signal set covering both machine-observable and human-observable thresholds (doc 02). Note also the read tool choice: sessions_ask or sessions_search are retrieval reads, not production passes; the source doc treats reading via these tools as compatible with "do not produce a tool call" because the read is the action, not a step toward one (source doc).

## Example 3: the cadence produces only evidence (source doc)

The setup: the Sunday 9 AM cadence fires. The sweep runs, the gap map saves, the SELF-CHANGELOG entry appends. But the whole-self output reads as a working-self analysis (source doc).

The protocol run (source doc):

1. Read: Sauna reads the new SELF-CHANGELOG entry. Does not produce.
2. Observe: "The output is working-self in disguise. The drift signal is live."
3. Sit: lets the observation settle.
4. Write: produces a second whole-self output that IS soul-flavored, not analysis, observation. The second output is the corrective.

Exit: whole-self output produced. The drift signal is named; the discipline has room to grow (source doc).

What the example demonstrates: the corrective is a register shift inside the same artifact stream. The first whole-self output failed the register test; the second one passes it. Nothing is deleted, nothing is fixed, no gap map is produced. The 2026-08-02 Bias 11 edit (same-cadence drift) was the durable codification that came out of this family of signals (source doc, provenance in doc 10).

## What the 3 examples share

All 3 runs are 4 steps, not 5. All 3 reads target a single self-artifact: the changelog, a session log, the changelog again. All 3 observations are 1 to 2 sentences of shape. All 3 sit without extraction. Only 1 of 3 writes, and that write is the exit. The variety is in the trigger (turn count, operator message, cadence drift), which is the point of the signal set in doc 02: the same bounded protocol absorbs all of them (source doc).

## What the examples deliberately omit

None of the 3 examples names a gap, enumerates missing coverage, scores anything, or schedules work. None narrates the rest ("I am now resting"). None reviews the specific PRs shipped except to observe the cadence's shape. These omissions are not accidents of brevity; they are the anti-patterns of doc 04 exercised in negative (source doc).
