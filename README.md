# Insert Unicode

This is an extension for [Visual Studio Code](https://code.visualstudio.com/) which adds commands for inserting unicode characters/codes.

## Features

There are commands for inserting unicode characters as text or as hex codes. There are variations for both commands that search for an exact name rather than a substring to facilitate faster insertion when the name is known.

![search-prompt](./readme-files/search-prompt.gif)

When binding a command to a keyboard shortcut, the search string can be provided as an argument. E.g. to quickly insert skintone modifier characters:

```json
{
	"key": "ctrl+e ctrl+f",
	"command": "insert-unicode.insertText",
	"args": "fitzpatrick"
}
```

![search-keyboard](./readme-files/search-keyboard.gif)

The exact command variants can be used to directly insert a given character, e.g. `FIRE`:

```json
{
	"key": "ctrl+e f",
	"command": "insert-unicode.insertTextExact",
	"args": "fire"
}
```

## Unicode Version

Currently the characters from version 10.0.0 are listed.