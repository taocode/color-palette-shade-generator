<script>
import {darken} from 'color2k'

export let color = 'hsla(3,66%,33%,1)'
export let steps = 10
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
			<input class="text-red-700" bind:value={stepFactor}
			type="number"
			min={0}
			max={1}
			step="0.01"
			placeholder="">
		</label>
	</div>
</div>

<h2>Lighter</h2>
<div class="flex text-center">
	{#each lighter as c}
	<div class="p-2 min-h-7 min-w-5" style="background-color: {c};">{c}</div>
	{/each}
</div>
<h2>Darker</h2>
<div class="flex text-center">
	{#each darker as c}
	<div class="p-2 min-h-7 min-w-5" style="background-color: {c};">{c}</div>
	{/each}
</div>


<style lang="postcss">
	label {
		@apply block;
	}

</style>