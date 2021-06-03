# Change Log

## [0.11.0] - 2021-06-03

- Add `Data Table` command for showing the Unicode data set as a big table.
- Fixes character filter box causing dialogs to scroll ([#25](https://github.com/brunnerh/insert-unicode/issues/25)).
- Headers in "Identify" view are now fixed.

## [0.10.0] - 2020-10-31

- `Identify Characters` now prompts for input if nothing is selected.
- Add `Identify` view which automatically identifies the selected characters, similar to `Identify Characters` command.
  - Located in Explorer sidebar by default; can be dragged elsewhere.
  - Has two options to optimize performance if necessary: `identifyViewUpdateDelay`, `identifyViewCharacterLimit`
- Add aliases to Unicode entries.
  - Can be turned off using the option `enableAliases`.
- Workspace settings section in `Manage Favorites` is hidden if no workspace is currently opened.

## [0.9.0] - 2020-09-30

- `Manage Favorites` is now separated into user and workspace settings.
- If favorites are stored in both user and workspace settings, a new option `favoritesScopeBehavior` controls how the settings are presented in the `Insert from Favorites` tree (merged or separated).

## [0.8.0] - 2020-04-29

- Update Unicode table to version 13 🤌.
- Add `Manage Favorites` command for visual editing of the favorites directory.

## [0.7.1] - 2019-11-27

- Add digit conversion to the fonts command. Supported are:
  - Math Bold
  - Math Double-Struck
  - Math Sans-Serif
  - Math Sans-Serif Bold
  - Math Monospace

## [0.7.0] - 2019-09-21

- Change default for `disable-pre-filtering` to `true`. Pre-filtering may be removed in the future.
- Add commands for inserting characters as decimal number.
- Prefix all command labels with `Insert Unicode`.
- Add setting `favorites` for configuring a virtual directory of favorite characters. (A UI for managing them more easily should be added later.)
- Add `Insert from Favorites` commands to insert characters from the favorites (see/edit `favorites` setting).
- Overhaul Read-Me format to explicitly list all commands.
- Add small *How To* section to Read-Me.

## [0.6.0] - 2019-03-05

- Update Unicode table to version 12 🧇.

## [0.5.0] - 2019-03-01

- Added `Identify Unicode Characters` command and option to control whether the results are always displayed as file (`show-identified-characters-in-file`).

## [0.4.1] - 2019-02-18

- Fix sequences not being found if pre-filtering is enabled (`disable-pre-filtering: false`) due to different casing.

## [0.4.0] - 2019-02-18

- Added Emoji (v.12.0) sequences such as flags 🇳🇵.
  - Whether these sequences appear as entries in the list can be controlled with the setting `insert-unicode.include-sequences`.
  - Likewise the appearance of skin tone variation entries is controlled via the setting `insert-unicode.include-skin-tone-variants`.<br/>
    These variations are not included by default as they clutter the list significantly.

## [0.3.0] - 2019-02-04

- Renamed commands to avoid potential confusion:
  - Suffix `(Text)` for insert commands was dropped.
  - Suffix `(Hex Code)` was changed to `as Hex Code`.
- Added command `Insert Unicode from Hex Code` which directly converts a code to text.

## [0.2.2] - 2019-01-23

- Updated Unicode table to version 11 🦙.

## [0.2.1] - 2018-11-17
- Added `insert-unicode.disable-pre-filtering` which can be used to skip the initial search step and disable paging.

  Due to a previous Visual Studio Code update, the dropdown is now virtualized, greatly increasing its performance when many items are available. It still can take a small amount of time to display with all Unicode entries and the live filtering can lag noticeably. Results may vary depending on processing power.

## [0.2.0] - 2018-07-15
- Added "Unicode Fonts" command.

## [0.1.0] - 2018-05-25
- Initial release.
