Umami tracker snapshot

Source: https://umami.rainysnow.com/script.js
Retrieved: 2026-10-13
SHA-256 (original downloaded bytes):
1ad1145d19d4558c20f5469ca4a5fc50a1a46f860858c9c91bfcd56fd29a522a
Upstream: https://github.com/umami-software/umami (MIT; see LICENSE)

The tracker is published with the documentation site. analytics.ts loads it
asynchronously after the page load event and sets data-host-url explicitly,
so events still go to https://umami.rainysnow.com/api/send.

After upgrading the Umami server, download and review its script.js again,
rename the snapshot with the new SHA-256 prefix, update analytics.ts and this
record, then rebuild. No download from the analytics server is needed at build
time or when a visitor opens a page.
