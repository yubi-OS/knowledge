# 07 - Deploy lessons and failure modes

## Scope

This doc covers the deploy lessons the source doc records, each of which cost a fix cycle, plus the general failure-mode pattern they share. Grounding spine: the source doc (yubi-OS/yubiOS skills/taste-engine/SKILL.md); the dug sources cover the external error surfaces involved.

## Lesson 1: clef choice questions take a criteria object

clef `choice` questions take a `criteria` object, mapping each option to its description, NOT a `choices` array. Sending the array form produces clef error 5012, "Extra inputs are not permitted" (source doc). The failure class is a schema mismatch between the caller's mental model and the validator's contract: the request is well-formed JSON and semantically reasonable, and it is rejected anyway because the schema forbids the extra key. The general behavior is standard for strict validation: schemas that forbid extra inputs reject unexpected keys rather than ignoring them (source: https://stackoverflow.com/questions/71837398/pydantic-validations-for-extra-fields-that-not-defined-in-schema, jev weight 0.10, weak backing, cited only as the common name of the behavior). The fix in the source doc is the right one: match the validator's contract exactly, and copy a known-working call shape rather than inventing one.

## Lesson 2: always render measured numbers with decimals

A bare integer "1" in the symmetry band question produced p 0.015 on a perfectly symmetric line. The fix was fmt(), which renders integers as "1.000" (source doc). The lesson is not about numerics but about how the decision model reads an instruction: "1" reads as a count or a boolean, "1.000" reads as a measured value on a continuous scale. The downstream effect was catastrophic at the individual-question level: a perfectly symmetric artifact was nearly certain to be judged asymmetric. The general rule, guideline 1 in the source doc, is that every noul instruction carries a measured number and no free-prose classification; this lesson adds that the measured number must be formatted like a measurement.

## Lesson 3: a module that calls askJev must import it

A module that calls askJev must import it. `node --check` is syntax-only, so the selftest passed while the live route 500'd, because extraction is pure and never touched the missing import (source doc). The source doc notes this is the same bug as the 2026-10-03 scorer deploy, meaning the failure mode repeated across deploys before being stated as a rule. The structural reason the selftest could not catch it: the selftest exercises the extraction path, which is pure and does not call askJev, so the missing import only executes on a live score request. The general class is "static checks cover syntax and types, not reachability of runtime code paths". The fix is procedural: live-verify every route after deploy.

## Lesson 4: fixture parts ship path-qualified

Fixture parts must ship path-qualified, as `fixtures/taste-fixtures.mjs` with filename matching, or Cloudflare rejects the whole upload with error 10021 (source doc). The Workers platform documents its error codes and exceptions in its observability reference (source: https://developers.cloudflare.com/workers/observability/errors/, jev weight 0.90). Community reports of 10021 during multipart uploads of worker scripts predate the taste-engine case (source: https://stackoverflow.com/questions/49394631/getting-error-10021-when-uploading-cloudflare, jev weight 0.09, weak backing, and source: https://community.cloudflare.com/t/cannot-upload-worker-script-using-multipart-upload/7709, jev weight 0.08, weak backing; both record the symptom, not the fix). The taste-engine lesson adds the actual fix: the multipart upload validates each part against its declared path, so a part whose filename does not match its declared path fails the whole upload. The all-or-nothing property is the same fail-closed shape as the matrix route in doc 03.

## Lesson 5: the selftest passing does not mean the routes work

After any deploy, live-verify every route; stale-deploy propagation is roughly 20 seconds (source doc). This is the operational summary of lessons 3 and 4 and the reason guideline 5 exists: run GET /taste/selftest after any deploy, and do not trust results while it fails (source doc, guideline 5). The sequence that works is: deploy, wait out propagation, selftest, live-verify each route with a real request, then resume.

## Lesson 6: caller actions on POST /api/jev/tasks require method and url

POST /api/jev/tasks caller actions require `method` + `url` even for the resend.send tool; copy `jev-lead.js resendSendAction()`. Extra body keys like `reply_to` ride fine, because the validator only rejects recipient/message shapes and placeholders (source doc). This lesson completes the picture: some validators reject extra keys (lesson 1) and some tolerate them but require the structurally important ones. Reading the validator's actual contract, from working code, beats assuming either direction.

## The shared pattern

All six lessons are instances of one pattern: the contract lives in the receiving system, not in the caller's intuition. The decision model's schema says which key names are legal. The instruction string's meaning depends on number formatting. The bundler's checks do not reach runtime imports. The upload validator requires path matching. The deploy propagates on its own schedule. The task validator requires the fields that make an action executable. Each fix cycle cost real time, and the source doc's remedy for the next deploy is written procedure: copy known-working call shapes, render numbers as measurements, selftest plus live-verify, and ship fixtures path-qualified. The JSON contract layer underneath all of this is deliberately language-independent and convention-based (source: https://www.json.org/json-en.html, jev weight 0.83), which is exactly why its strictness is enforceable across implementations and why the caller must match it rather than approximate it.
