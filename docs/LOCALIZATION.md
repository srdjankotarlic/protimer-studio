# Localization status

English is the default language.

## Release coverage

- `FULL`: English (`en`) and Serbian (`sr`). The operator workspace, Output Routing, Lower Third controls, Lower Third Studio, remote, backstage and output labels are covered by the maintained product dictionaries.
- `CORE`: 35 additional languages. The primary timer, rundown, message, output, remote and lower-third controls are localized. Advanced production surfaces use the English source string when a reviewed translation is not available.

The language selector exposes this distinction. Marketing and store copy must not describe the 35 `CORE` packs as complete translations.

## Supported language codes

`en`, `es`, `zh`, `hi`, `ar`, `pt`, `bn`, `ru`, `ja`, `pa`, `de`, `jv`, `ko`, `fr`, `tr`, `vi`, `te`, `mr`, `ta`, `ur`, `it`, `fa`, `gu`, `pl`, `uk`, `ml`, `kn`, `or`, `my`, `th`, `id`, `nl`, `ro`, `el`, `cs`, `sv`, `sr`.

Arabic, Urdu and Persian use RTL document direction. All packs inherit missing keys from English so switching language never makes a control disappear or become unusable.

## Verification

`npm run smoke:philips` switches through all 37 packs, checks document language/direction, verifies complete runtime dictionaries, confirms English restoration, and opens Lower Third Studio in Serbian to verify its static controls and inspector.

Native-language editorial review is still required before promoting any `CORE` pack to `FULL`.
