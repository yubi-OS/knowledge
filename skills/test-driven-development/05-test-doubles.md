Scope: test doubles in preference order real implementation > fake > stub > mock, when mocks are justified, and the over-mocking failure mode.

# 05: Test Doubles

Grounding spine: the source doc "yubi-OS/yubiOS skills/test-driven-development/SKILL.md", "Prefer Real Implementations Over Mocks" and the anti-pattern row "Mocking everything".

## The preference order

The source doc ranks test doubles from most to least preferred:

1. Real implementation: highest confidence, catches real bugs.
2. Fake: an in-memory version of a dependency, for example a fake database.
3. Stub: returns canned data, no behavior.
4. Mock (interaction): verifies method calls, use sparingly.

The rule is to use the simplest test double that gets the job done, because the more real code a test executes, the more confidence it provides. The escape hatch is explicit: use mocks only when the real implementation is too slow, non-deterministic, or has side effects you cannot control, such as external APIs or email sending. Over-mocking creates tests that pass while production breaks.

## Primary external backing

The dig's strongest results come from the Google Testing Blog, which independently endorses the same gradient. "Increase Test Fidelity By Avoiding Mocks" (https://testing.googleblog.com/2024/02/increase-test-fidelity-by-avoiding-mocks.html, jev weight 0.83) argues that a fake gives a test high fidelity at the cost of writing and maintaining the fake (the fake itself needs tests to conform to the real implementation's behavior), and that fidelity loss is the price of mocking. "Testing on the Toilet: Don't Overuse Mocks" (https://testing.googleblog.com/2013/05/testing-on-toilet-dont-overuse-mocks.html, jev weight 0.78) states the matching rule: sometimes you cannot use a real dependency because it is too slow or talks over the network, but there are better options than mocks, such as a hermetic local server. Both predate and independently justify the source doc's ordering, which is strong convergence: two primary sources, 11 years apart, land on the same principle.

The definitional taxonomy also has primary backing. Martin Fowler's "Mocks Aren't Stubs" (https://www.martinfowler.com/articles/mocksArentStubs.html, jev weight 0.90, cited in doc 04) distinguishes stubs (canned responses) from mocks (expectation-verified interaction records) and separates the classical and mockist styles; the gmock cookbook maintained by Google (https://github.com/google/googletest/blob/main/docs/gmock_cook_book.md, jev weight 0.88) adds a concrete warning that "if your mocks have different behaviors than the real objects by mistake", the test lies to you, and the GoogleTest project docs (https://google.github.io/googletest/, jev weight 0.86) are the reference implementation of the mock side of the taxonomy.

## The taxonomy in one line each

Corroborating weak sources (all below 0.5) agree on the vocabulary: a dummy is passed but never used, a stub returns predefined responses, a spy records calls made to it, a mock asserts interactions, a fake is a working lightweight implementation. See for example https://blog.nimblepros.com/blogs/understanding-test-doubles/ (jev weight 0.26, weak) and https://ig-gems.readthedocs.io/en/latest/python/testing/010-dummies-fakes-spies-stubs-mocks.html (jev weight 0.21, weak). The source doc compresses this taxonomy to the four-level preference order, which is the operationally useful form: it tells you what to reach for first, not just what each thing is called.

## When mocking is correct

The source doc's justifying conditions (too slow, non-deterministic, uncontrolled side effects) are also the conditions the Google Testing on the Toilet piece lists (slow, network). The practical corollary: mock at the boundary, not in the middle. Unit tests of pure logic need no doubles at all; tests at API boundaries may fake the database or stub an HTTP client; anything that can run against a real in-memory implementation should.

## Tie-in to the anti-pattern table

The source doc's anti-pattern "Mocking everything" is the failure mode of ignoring the preference order, with the observed symptom "tests pass but production breaks" and the fix "prefer real implementations > fakes > stubs > mocks, mock only at boundaries where real deps are slow or non-deterministic." Doc 06 covers that table in full; this doc supplies the reasoning behind its most-cited row.
