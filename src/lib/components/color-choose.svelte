<script>
import {darken, readableColor} from 'color2k'

export let h = 0
export let s = 75
export let l = 50
export let a = 1
export let steps = 10
export let stepFactor = 0.05

const shades = (color, steps, stepFactor) => {
	let arr = [color]
	for (let i = 1; i < steps; i++) {
		if (i%2) {
			arr.unshift(darken(color,(i+1)/2*stepFactor*-1))
		} else {
			arr.push(darken(color,i/2*stepFactor))
		}
	}
	return arr
}

let color = "red"
let contrast = "white"
let complementary = "green"
let primaryShades = []
let complementaryShades = []
let scheme = "Complementary"
$: {
	color = `hsla(${h},${s}%,${l}%,${a})`
	contrast = readableColor(color)
	complementary = `hsla(${h+128},${s}%,${l}%,${a})`
	primaryShades = shades(color,steps,stepFactor)
	complementaryShades = shades(complementary,steps,stepFactor)
}
</script>

<div class="p-10 flex" style="color: {contrast}; background-color: {color};">
	<div class="text-2xl font-bold">
		hsla(
			<input class="hsla" style="background-color: {color};" 
			bind:value={h} placeholder="Hue"
			type="number">,
			<input class="hsla" style="background-color: {color};" bind:value={s} placeholder="Saturation"
			type="number">%,
			<input class="hsla" style="background-color: {color};" bind:value={l} placeholder="luminosity"
			type="number">%,
			<input class="hsla" style="background-color: {color};" bind:value={a} placeholder="Hue"
			type="number">
		)
		
	</div>
	<div class="">
		<label>
			<input style="background-color: {color};" bind:value={steps}
			type="number"
			placeholder="steps">
			Steps
		</label>
		<label>
			<input style="background-color: {color};"
			bind:value={stepFactor}
			type="number"
			min={0}
			max={1}
			step={0.01}
			placeholder="">
			Step Factor (0..1)
		</label>
		<label>
			<input style="background-color: {color};"
			class="max-w-[12ch]"
			bind:value={scheme}
			placeholder="Monochromatic, Analagous, Complementary, Split-Complementary, Triad, Tetradic">
			Color Scheme
		</label>
	</div>
</div>

<div class="shades">
	{#each primaryShades as bc}
	<div class="swatch" style="background-color: {bc}; color: {readableColor(bc)}">{bc.split(',')[2]}</div>
	{/each}
</div>
<div class="flex flex-wrap text-center">
	{#each complementaryShades as bc}
	<div class="swatch" style="background-color: {bc}; color: {readableColor(bc)}">{bc.split(',')[2]}</div>
	{/each}
</div>

<style lang="postcss">
	label {
		@apply block flex items-center;
	}
	.swatch {
		@apply p-2 min-h-16 min-w-1/11 flex flex-grow items-center justify-center;
	}
	input {
		@apply text-right  text-2xl border-transparent;
	}
	.hsla {
		@apply font-bold max-w-[4ch];
	}
	.shades {
		@apply flex flex-wrap text-center;
	}
</style>