import { toHsla } from "color2k"
import { writable } from "svelte/store"

export const steps = writable(9)
export const factorLightness = writable(0.085)
export const factorSaturation = writable(0)

export const scheme = writable(0)
export const primaryColor = writable(toHsla('hsl(250,65%,45%)'))