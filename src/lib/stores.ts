import { toHsla } from "color2k"
import { writable } from "svelte/store"

export const steps = writable(10)
export const factorLightness = writable(0.075)
export const factorSaturation = writable(0)

export const scheme = writable(0)
export const primaryColor = writable(toHsla('hsl(250,65%,45%)'))

export const hue = writable(250)
export const saturation = writable(0.65)
export const lightness = writable(0.45)
export const alpha = writable(1)

export const colorNames = writable([])
export const cssVarPrefix = writable('color')

export const varOptTailwind = writable('novar')
export const varOptCSS = writable('HSLA')