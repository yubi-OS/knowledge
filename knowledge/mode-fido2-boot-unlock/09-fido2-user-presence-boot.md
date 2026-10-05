# 09. User presence and timeout under FIDO2 at early boot

Scope: user presence and verification checks plus authenticator timeouts under FIDO2 at early boot, and how libfido2 and systemd surface them.

## The protocol level: user presence is a signed property

In CTAP2, the user presence check is a first-class requirement: the FIDO Alliance specification describes user presence checks as required for CTAP2 authenticators before the relying party is told the token is registered, as part of the protocol's compatibility behavior with CTAP1/U2F authenticators (source: https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html, jev weight 0.93). Yubico's CTAP developer guide covers how to integrate FIDO2 security keys over the Client To Authenticator Protocol, including versions and implementation strategies (source: https://developers.yubico.com/CTAP/index.html, jev weight 0.95). For disk unlock, the operative form of this is the assertion request: the authenticator will not return the hmac-secret until presence is proven, which is exactly the interactive property the boot chain relies on.

## The library level: how libfido2 surfaces presence

libfido2's assertion API exposes presence and verification as explicit attributes. The fido_dev_get_assert function asks the FIDO2 device for an assertion, and the returned assertion carries user presence and user verification attributes; the manual page documents that these values are set as part of assertion handling, and that a PIN is not needed if the request does not require one (source: https://developers.yubico.com/libfido2/Manuals/fido_dev_get_assert.html, jev weight 0.90; mirrored in the openSUSE package manual pages, source: https://manpages.opensuse.org/Tumbleweed/libfido2-devel/fido_dev_get_assert.3.en.html, jev weight 0.86). The command line tool makes the same property visible: with -p, obtaining an assertion requests user presence, and verifying an assertion checks whether the user presence bit was signed by the authenticator (source: https://developers.yubico.com/libfido2/Manuals/fido2-assert.html, jev weight 0.88).

The signed presence bit is what makes the boot unlock trustworthy: the initrd code does not just see that an exchange happened, it sees a bit the authenticator's own firmware signed.

## The device level: touch or timeout, no cancel

On a YubiKey the interaction is minimal and one-directional: the user can either touch the key to select it or wait for the operation to time out, because there is no separate deny or cancel control on the security key itself; when the user does not complete the user presence step, the client will usually see CTAP2_ERR_USER_ACTION_TIMEOUT (source: https://docs.yubico.com/yesdk/users-manual/application-fido2/apdu/authenticator-selection.html, jev weight 0.65). A companion document in the Yubico .NET SDK documentation states the same behavior, adding that CTAP2_ERR_OPERATION_DENIED may appear in some situations (source: https://github.com/Yubico/Yubico.NET.SDK/blob/develop/docs/users-manual/application-fido2/apdu/authenticator-selection.md/, jev weight 0.36, weak backing).

This is the timeout semantics of the touch at boot: the device bounds the wait on its own side. The boot side then decides what to do with the failure, which is where the retry-then-passphrase behavior of doc 01 and the indefinite-wait policy of doc 04 live.

## Known library-level timeout quirks

Two reports describe edge behavior worth knowing when building automation on top of libfido2:

1. When a timeout is set for a U2F device and the device times out during a call to fido_dev_get_assert, subsequent calls to fido_dev_get_assert were reported to fail (source: https://github.com/Yubico/libfido2/issues/917, jev weight 0.39, weak backing).
2. Calls to fido_dev_make_cred and fido_dev_get_assert were reported to sometimes block until the timeout expires even when the transaction itself succeeds quickly (source: https://github.com/Yubico/libfido2/discussions/757, jev weight 0.17, weak backing).

Both are device- and version-specific reports rather than documented contracts, so they are labeled as weak backing. For a boot-mode design the takeaway is the same either way: the timeout behavior lives in the authenticator and the library, and the caller should treat a timed-out exchange as a failed method in the enrolled-method sequence rather than a fatal condition.

## Why this matters for the boot mode axis

The FIDO2 touch is the one interactive step in the boot chain (docs 01, 08). Its bounds are: presence is mandatory and cryptographically signed, the device enforces its own timeout with CTAP2_ERR_USER_ACTION_TIMEOUT as the usual signal, there is no cancel gesture on the key, and the library exposes all of it as attributes the unlock code can branch on. Those bounds are what make the documented modes real: the initrd can retry, fall back to the passphrase keyslot, and report a non-zero exit only when the whole method list fails, because each authenticator interaction is a bounded, attributable event.

## Mode summary

1. Presence: mandatory and signed by the authenticator firmware (sources above).
2. Timeout: device-bounded; the canonical signal is CTAP2_ERR_USER_ACTION_TIMEOUT.
3. Cancel: no cancel control on the key itself; the user either touches or times out.
4. Automation: the software leg (doc 05) answers without presence, which is why CI can be non-interactive at all.
