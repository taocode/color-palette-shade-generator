<script>
import { adjustHue, darken, readableColor, hsla, toHex, toHsla, parseToHsla } from 'color2k'
import { browser } from '$app/env'
import { page } from '$app/stores'
import { schemeColors, schemes, dots } from '$lib/lib'
import { steps, stepFactor } from '$lib/stores'
import ColorPatch from './color-patch.svelte'


import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

export let h = 250
export let s = 0.65
export let l = 0.45
export let a = 1

let color = hsla(h, s, l, a)
let sP = s*100
let lP = l*100

$: {
	if (h < 0) h *= -1
	if (s < 0) s *= -1
	if (l < 0) l *= -1
	if (a < 0) a *= -1
	if (h > 360) h = h % 360
	if (s > 100) s = s % 1
	if (l > 100) l = l % 1
	if (a > 1) a = 1
	
	color = hsla(h, s, l, a)
	dispatch("updateColor",color)
}

function colorPicked({srcElement}) {
	dispatch("updateColor",toHsla(srcElement.value))
}

</script>


<div class="max-w-max mx-auto pb-4 sm:text-xl leading-loose">
	<div class="flex flex-col leading-9 xs:flex-row xs:justify-center" >
		<div class="xs:justify-end">
			<input type="color" id="colorpicker"
			on:change={colorPicked}
			class="block w-3/4  h-8 mx-auto xs:w-16"
			value={toHex(color).substring(0,7)}
			colorpick-eyedropper-active="true">
		</div>
		<div class="xs:ml-2">
			<label for="colorpicker">hsla(

				<input class="hsla" style="background-color: {color};"
				bind:value={h} placeholder="Hue"
				type="number" min={0} max={360}>,
				<input class="hsla" style="background-color: {color};" bind:value={sP} placeholder="Saturation"
				type="number" min={0} max={100}>%,
				<input class="hsla" style="background-color: {color};" bind:value={lP} placeholder="luminosity"
				type="number" min={0} max={100}>%,
				<input class="hsla" style="background-color: {color};" bind:value={a} placeholder="Hue"
				type="number" min={0} max={1} step={0.1}>
				)
			</label>
	
		</div>

	</div>

</div>


<style lang="postcss">
	label {
		@apply block flex items-center justify-end w-full text-[0.75em];
		input {
			@apply text-[2em];
		}
	}
	input {
		@apply text-right border-transparent leading-tight flex-shrink;
	}
	.hsla {
		@apply font-semibold max-w-[4ch];
	}
</style>