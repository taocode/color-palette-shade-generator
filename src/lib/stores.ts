import { hsla } from "color2k"
import { derived, writable } from "svelte/store"

export const defaults = {
  hue: 180,
  saturation: 0.75,
  lightness: 0.50,
  alpha: 1,
  scheme: 3,
  steps: 10,
  factorLightness: 0.075,
  factorSaturation: 0,
  cssVarPrefix: 'color',
  optTailwind: 'novar',
  optColorNotation: 'HSLA',
  optSass: 0,
  colorNames: []
}
export const steps = writable(defaults.steps)
export const factorLightness = writable(defaults.factorLightness)
export const factorSaturation = writable(defaults.factorSaturation)

export const scheme = writable(defaults.scheme)

export const hue = writable(defaults.hue)
export const saturation = writable(defaults.saturation)
export const lightness = writable(defaults.lightness)
export const alpha = writable(defaults.alpha)
export const primaryColor = derived([hue,saturation,lightness,alpha], 
  ([$H,$S,$L,$A], set) => {
    set(hsla($H,$S,$L,$A))
    // console.log('derived primary: ',$H,$S,$L,$A)
  }
)

export const colorNames = writable(defaults.colorNames)
export const cssVarPrefix = writable(defaults.cssVarPrefix)

export const optColorNotation = writable(defaults.optColorNotation)
export const optTailwind = writable(defaults.optTailwind)
export const optSass = writable(defaults.optSass)