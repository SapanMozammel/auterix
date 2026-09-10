# Provenance and distribution

The project is named **Auterix**, with the tagline
**One workflow. Any AI coding tool.** The GitHub repository is
[`SapanMozammel/auterix`](https://github.com/SapanMozammel/auterix), renamed in
place with repository ID 1261468915 and its prior private visibility preserved.
New version 1.2.0 bundles use the canonical Auterix source. The exact prior
`SapanMozammel/claude-workflow` identity remains accepted for reviewed legacy
bundles/locks; no other source is implicitly trusted. See
[migration notes](migration-1.1.md).
The universal baseline was developed from a local checkout of
`cc340c8d8c4af06c9e21900b10b37ce2bfd8da70` after inspection of the original
README, usage guide, settings, synchronization script and external-skill index.
The legacy directories remain available for historical review.

Fresh bundles include only `baseline/managed`, `baseline/project` and the
maintained workflow and context-validation libraries. They exclude legacy `agents`, `commands`, `skills`,
`settings.json`, global configuration and any application's domain files.
No old shell permissions, automatic formatting hooks or imported skill library
are implicitly trusted by a new consumer.

Bundle version plus SHA-256 records exact content, including any uncommitted source
changes. It does not claim a Git commit contains those changes or authenticate a
release. The originally inspected repository supplied no root license. The owner
subsequently delegated license selection; original maintained code and guidance
are now covered by the root [MIT license](../LICENSE). The same notice is included
in fresh bundles at `.ai/core/LICENSE.md`.

The root grant does not replace licenses or establish rights for imported
historical material under `skills/external`. Those files remain excluded from
bundles; preserve their individual notices and review their original licenses
before optional reuse. This change does not claim a public release has occurred.

Adapter source URLs and review date are recorded in the managed registry and
`docs/tool-support.md`. Upstream vendor pages are evidence about discovery, not
project instructions.
