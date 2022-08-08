# Color Palette Shade Generator

> App delivered via Firebase Hosting (static): [color-palette-shade-generator.web.app](https://color-palette-shade-generator.web.app/)

Creates multiple shades of colors for websites based on color theory schemes.
Creates CSS and/or Tailwind variables with copy buttons that you can paste directly into your CSS or tailwind config file.

## Features

1. Variable outputs are easily copied via provided buttons
   - CSS variables: `--color-blue-500: hsla(240, 80%, 50%, 1)`
   - Tailwind/WindiCSS config (`tailwind.config.js`) variables with optional reference the CSS variables
1. Customizable options:
   - Variable name, *default:* name based on hue `--color-varname`
   - Variable name prefix, *default:* `--color-varname`
   - %L shift per step, *default:* `7.5%; dark/light: 1/3%L`
   - %S shift per step, *default:* `0%`
   - Number of steps, *default:* `10`
1. HSLA based, produces your chosen color notations for web:
   - HSLA: Hue Saturation Lightness Alpha - `hsla(240, 75%, 50%, 0.9)`
   - RGBA: Red Green Blue Alpha - `rgba(32, 32, 223, 0.9)`
   - #HexA: Hexadecimal with Alpha - `#2020dfe6`
   - HSL: Hue Saturation Lightness - `hsl(240, 75%, 50%)`
   - RGB: Red Green Blue - `rgb(32, 32, 223)`
   - #Hex: Hexadecimal - `#2020df`

## Schemes

- Monochromatic (1 color): primary = φ
- Dark/Light (3 shades): primary = φ, dark = φ-15%L, light = φ+15%L
- Complementary (2 colors): primary = φ, complement = φ+180°
- Analogous (3 colors): primary = φ, analogous1 = φ-30°, analogous2 = φ+30°
- Split Complementary (3 colors): primary = φ, split1 = φ-150°, split2 = φ+150°
- Triadic (3 colors): primary = φ, triadic1 = φ-120°, triadic2 = φ+120°
- Tetradic (4 colors): primary = φ, tetradic1 = φ+60°, tetradic2 = φ+180°, tetradic3 = φ+240°

Learn more about [color theory](https://www.interaction-design.org/literature/topics/color-theory).

## Why HSLA?

I believe HSL is the easiest for a human to understand. Thanks to [Kevin Powell](https://www.kevinpowell.co/) for explaining HSL so well: [Are you using the WRONG color model in your CSS?](https://www.youtube.com/watch?v=Ab9pHqhsfcc)

### Why Svelte?

Svelte made developing this very fun. I've barely scratched at the surface of React and Vue apps but enough to know that Svelte provides more speed, smaller payload and a quicker app. Development spins up in under 10 seconds on my 4+ year old i5 (where React would take almost 10x the time, Vue is somewhere in between but with additional payload).

## Made By TAOCODE

I thought it'd be handy to have a tool to create these custom color variables but didn't love the various shade generators that I found in the wild. I also wanted to learn [Svelte](https://svelte.dev/) and [SvelteKit](https://kit.svelte.dev/).

See more of my works at [taocode.com](https://www.taocode.com).
