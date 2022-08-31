# **Colorize**

![test](https://github.com/tjx666/vscode-colorize/actions/workflows/test.yml/badge.svg)

Instantly visualize css colors in your css/sass/less/postcss/stylus/XML... files.

This extension your styles files looking for colors and generate a colored background (using the color) for each of them.

![demo](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/master/assets/demo.gif)

![variables demo](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/master/assets/demo_variables.gif)

💡 [How to enable variables support](#colorize.colorized_variables)

## Modified

This project is forked from [kamikillerto.vscode-colorize](https://github.com/KamiKillertO/vscode-colorize).

My Version start from: v0.12.0

- fix issues: #417, #503, #574, #731

## Features

- Generate colored background for
  - css variables
  - preprocessor variables
  - hsl/hsla colors
  - cross browsers colors (_red, blue, green..._)
  - css hexa color
  - rgb/rgba color
  - argb color
- Color background live update

## Options (settings)

The following Visual Studio Code settings are available for the Colorize extension.
These can be set in user preferences `(cmd+,)` or workspace settings `(.vscode/settings.json)`.

### colorize.languages

Type: `Array`

Configure a list of languages that should be colorized. You can learn about languages at <https://code.visualstudio.com/docs/languages/overview>.

For example, if you want to colorize colors in `javascript` files, you just need to include it:

```javascript
  "colorize.languages": [
    "javascript",
    // ...
  ]
```

### colorize.enable_search_variables

Type: `boolean`\
Default: `true`

By default colorize read and parse all files, in your workspace, that are targeted by the settings [colorize.languages](#colorize.languages), [colorize.include](#colorize.include), and [colorize.exclude](#colorize.exclude) to extract extract all variables. Thanks to this behavior all variables will have colored background even if you never open the file containing the declaration. _⚠️ This setting can slow down vscode at opening_

### colorize.include

Type: `Array`

Configure glob patterns for including files and folders. By default Colorize is enable for files matching one the languages defined in the `colorize.languages` config, with this config you can enable colorize for other files or folders. Read more about glob patterns [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options).

### colorize.exclude

Type: `Array`

Configure glob patterns for excluding files and folders. Colorize will not colorized colors in these files and folders and it'll also not search for variables inside. Read more about glob patterns [here](https://code.visualstudio.com/docs/editor/codebasics#_advanced-search-options).

### colorize.hide_current_line_decorations

Type: `boolean`\
Default: `true`

By default, decorations for the current line are hidden. Set this setting to `false` if you want to deactivate this behavior.

### colorize.colorized.colors

Type: `Array`

This options allow you to enable/disable colorization for a type of colors.

Available colors are :

- `HEXA`: for hexadecimal colors: `#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`, `0xRGB`, `0xRGBA`, `0xRRGGBB` or `0xRRGGBBAA`
- `ARGB`: for argb colors: `#RGB`, `#ARGB`, `#RRGGBB` or `#AARRGGBB`
- `RGB`: for rgb colors: `rgb(r,g,b)` or `rgba(r,g,b,a)`
- `HSL`: for HSL colors: `hsl(h,s,l)` or `hsla(h,s,l,a)`
- `BROWSERS_COLORS`: for native browser's colors like `white`, `red`, `blue`...

For example, if you want to only colorize hexa colors (`#fff, #ffffff, 0xFFF`) in your files you can update the option like this :

```json
  "colorize.colorized_colors": [
    "HEXA"
  ]
```

### colorize.colorized_variables

Type: `Array`

This options allow you to enable/disable colorization for a type of variables.

For example if you use less in your project you setup the option like this

```json
  "colorize.colorized_variables": [
    "LESS"
  ]
```

_This way all @variables will be colorized_

## TODO

- [ ] color picker
- [ ] Command to toggle colorizer based on file #596

## Release

See [CHANGELOG](CHANGELOG.md) for more information.

## Contributing

Bugs, feature requests and more are welcome here [GitHub Issues](https://github.com/KamiKillertO/vscode-colorize/issues).
