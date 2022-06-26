<script>
import {darken, readableColor} from 'color2k'

export let h = 0
export let s = 75
export let l = 50
export let a = 1
export let steps = 5
export let stepFactor = 0.05

const colorArray = (color, steps, stepFactor, invert = 1) => {
	let arr = []
	for (let i = 1; i <= steps; i++) {
		arr.push(darken(color,i*stepFactor*(invert)))
	}
	return arr
}

let color = "red"
let contrast = "white"
let complimentary = "green"
let lighter = []
let darker = []
let compLight = []
let compDark = []
let scheme = "Complementary"
$: {
	color = `hsla(${h},${s}%,${l}%,${a})`
	contrast = readableColor(color)
	complimentary = `hsla(${h+128},${s}%,${l}%,${a})`
	lighter = colorArray(color,steps,stepFactor,-1).reverse()
	darker = colorArray(color,steps,stepFactor)
	compLight = colorArray(complimentary,steps,stepFactor,-1).reverse()
	compDark = colorArray(complimentary,steps,stepFactor)
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
	{#each lighter as bc}
	<div class="swatch" style="background-color: {bc}; color: {readableColor(bc)}">{bc.split(',')[2]}</div>
	{/each}
	{#each darker as bc}
	<div class="swatch" style="background-color: {bc}; color: {readableColor(bc)}">{bc.split(',')[2]}</div>
	{/each}
</div>
<div class="flex flex-wrap text-center">
	{#each compLight as bc}
	<div class="swatch" style="background-color: {bc}; color: {readableColor(bc)}">{bc.split(',')[2]}</div>
	{/each}
	{#each compDark as bc}
	<div class="swatch" style="background-color: {bc}; color: {readableColor(bc)}">{bc.split(',')[2]}</div>
	{/each}
</div>

<style lang="postcss">
	label {
		@apply block flex items-center;
	}
	.swatch {
		@apply p-2 min-h-16 min-w-16 flex flex-grow items-center justify-center;
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