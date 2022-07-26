import { toHsla } from "color2k"
import { writable } from "svelte/store"

export const defaults = {
  hue: 240,
  saturation: 0.65,
  lightness: 0.45,
  alpha: 1,
  scheme: 0,
  steps: 10,
  factorLightness: 0.075,
  factorSaturation: 0,
  cssVarPrefix: 'color',
  varOptTailwind: 'novar',
  varOptCSS: 'HSLA',
  colorNames: []
}
export const steps = writable(defaults.steps)
export const factorLightness = writable(defaults.factorLightness)
export const factorSaturation = writable(defaults.factorSaturation)

export const scheme = writable(defaults.scheme)
export const primaryColor = writable(toHsla('hsl(240,65%,45%)'))

export const hue = writable(defaults.hue)
export const saturation = writable(defaults.saturation)
export const lightness = writable(defaults.lightness)
export const alpha = writable(defaults.alpha)

export const colorNames = writable(defaults.colorNames)
export const cssVarPrefix = writable(defaults.cssVarPrefix)

export const varOptCSS = writable(defaults.varOptCSS)
export const varOptTailwind = writable(defaults.varOptTailwind)