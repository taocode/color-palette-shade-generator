import { writable } from "svelte/store"

export const steps = writable(9)
export const stepFactor = writable(0.1)