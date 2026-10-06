# 03 - Row 0: YAML parse failures masquerading as instant failures

Scope: the decision-tree row for runs that fail in about 0 seconds because the workflow YAML never parsed, the unquoted-colon cause, and the PyYAML 1.1 quirks to expect.

## The symptom and the probe

Row 0 is `conclusion=failure` in about 0 seconds. That is not a step failure; it is a YAML parse failure, and no step ran (source doc). The playbook's probe is two commands:

```bash
curl -sS ".../actions/runs/${RUN}/jobs" | jq '.total_count'   # 0 => parse error
python3 -c "import yaml;print(list(yaml.safe_load(open('.github/workflows/ci_test_sealed-uki-vm.yml'))['jobs']))"
```

`total_count: 0` means GitHub could not build any job out of the file, which means the file did not parse (source doc). The PyYAML line is the local reproduction: parse the workflow with `yaml.safe_load` and inspect the top-level keys (source doc).

## The cause seen twice: unquoted colon inside a step name

The parse failure the lane actually hit, twice, was an unquoted colon inside a step name: YAML 1.1 reads the text after `:` as a flow-mapping key (source doc). The diff that fixes it is one line: quote the step name.

```diff
-      - name: Generate PKI as plain files (V38: cert + PKCS#8 PEM on host)
+      - name: "Generate PKI as plain files (V38: cert + PKCS#8 PEM on host)"
```

(source doc). Runs #48 (V37) and #49 (V38) both failed with 0 jobs for this class (source doc, doc 08). Any step name that embeds a version tag or a scheme-like prefix with a colon needs quoting.

## The quirk to expect and not fix

After the fix, PyYAML should return top-level keys `['name', True, 'permissions', 'jobs']` (source doc). The `True` where `on:` should be is a YAML 1.1 quirk: PyYAML parses the key `on` as the boolean `true`. The playbook's instruction is explicit: GitHub handles this quirk, so do not "fix" it (source doc).

The dig backs the mechanism: PyYAML implements YAML 1.1, and in YAML 1.1 `on` is a boolean, so `"on: true"` parses to the mapping `{True: True}` (https://github.com/yaml/pyyaml/issues/807, weight 0.14, weak backing). The same boolean-coercion behavior of YAML 1.1 parsers is corroborated in a long-running Stack Overflow thread on PyYAML converting certain keys to booleans (https://stackoverflow.com/questions/36463531/pyyaml-automatically-converting-certain-keys-to-boolean-values, weight 0.07, weak backing). The spec-level backdrop is that YAML 1.1 defines the boolean value set that includes these words (https://yaml.org/, weight 0.07, weak backing).

## Why the parse gate belongs in dispatch

The playbook's closing gap note says a `yaml.safe_load` pre-dispatch gate would have caught V37 and V38 for free (source doc). The gate is cheap: parse the workflow with PyYAML before dispatching and assert the expected top-level keys. Because row 0 costs a whole run (dispatch, wait, failure) while the gate costs one local parse, the gate is the highest-value check in the whole debug loop. Doc 09 records it as a standing proposal.

## Where row 0 sits in the tree

Row 0 is first in the decision tree because it is the cheapest discriminator: it costs one API call and one local parse, and it cleanly separates two failure worlds (source doc). In the parse-failure world there are no jobs, no step logs, and no artifact; in the step world every later row applies. The playbook's ordering of rows 1 through 8 assumes that separation has already been made (source doc). This is also why row 0 is the row the playbook ties to the sibling `dispatch-chain-verification` playbook: the parse-state check is that playbook's verification pattern applied to the workflow file itself (source doc, doc 09).

Note also what row 0 is not: it is not the `0 jobs` reading of a healthy but empty matrix. The probe is the pair of facts together, `conclusion=failure` in about 0 seconds plus `total_count: 0`; both must hold before declaring a parse failure (source doc).

## Generic parse-error triage, and its limits

Generic GitHub Actions YAML parse-error guides exist and describe the symptom class (https://www.erroratlas.net/errors/github-actions-invalid-workflow-yaml-parse-error, weight 0.10, weak backing; https://www.techeia.com/blog/fix-yaml-parsing-error-github-actions, weight 0.08, weak backing). They are useful for vocabulary, but the playbook's own probe is stronger: it distinguishes parse failure from step failure with a number (`total_count`), which is the distinction every generic guide blurs. Trust the probe.
