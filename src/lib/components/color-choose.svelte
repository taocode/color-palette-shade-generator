<script>
import {darken, readableColor} from 'color2k'

export let h = 0
export let s = '66.6%'
export let l = '50%'
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

let darker = []
let lighter = []

$: color = `hsla(${h},${s},${l},${a})`
$: contrast = 'white'
$: {
darker = colorArray(color,steps,stepFactor)
lighter = colorArray(color,steps,stepFactor,-1)
}
</script>

<div class="p-10 flex" style="color: {contrast}; background-color: {color};">
	<div class="">
		<label>Color
			<input class=" text-center w-full font-bold text-2xl border-transparent" style="background-color: {color};" bind:value={color} placeholder="hsl() rgb() #HEX">
		</label>
	</div>
	<div class="">
		<label>
			Steps
			<input class="text-red-700" bind:value={steps}
			type="number"
			placeholder="steps">
		</label>
		<label>
			Step Factor (0..1)
			<input class="text-red-700" 
			bind:value={stepFactor}
			type="number"
			min={0}
			max={1}
			step={0.01}
			placeholder="">
		</label>
	</div>
</div>

<div class="flex flex-wrap text-center">
	{#each lighter as bc}
	<div class="swatch" style="background-color: {bc}; color: {readableColor(bc)}">{bc.split(',')[2]}</div>
	{/each}
</div>
<div class="flex flex-wrap text-center">
	{#each darker as bc}
	<div class="swatch" style="background-color: {bc}; color: {readableColor(bc)}">{bc.split(',')[2]}</div>
	{/each}
</div>


<style lang="postcss">
	label {
		@apply block;

	}
	.swatch {
		@apply p-2 min-h-16 min-w-16 flex flex-grow items-center justify-center;
	}
</style>