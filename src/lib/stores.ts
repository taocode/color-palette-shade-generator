import { writable } from "svelte/store"

export const steps = writable(9)
export const factorLightness = writable(0.1)
export const factorSaturation = writable(0)

export const scheme = writable(0)
export const color = writable('hsl(250,65%,45%)')