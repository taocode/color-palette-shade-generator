<script>
import { adjustHue, darken, readableColor, hsla, toHex, toHsla, parseToHsla } from 'color2k'

import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

import { color } from '$lib/stores'

export let h = 250
export let s = 0.65
export let l = 0.45
export let a = 1

let sP = s*100
let lP = l*100

$: color.set(hsla(h, s, l, a))
$: dispatch("updateHue",h)
$: {
	s = sP/100
	dispatch("updateSaturation",s)
}
$: {
	l = lP/100
	dispatch("updateLuminosity",l)
}
$: dispatch("updateAlpha",a)

function colorPicked({srcElement}) {
	[h,s,l,a] = parseToHsla(srcElement.value)
	dispatch("updateColor",toHsla(srcElement.value))
}
</script>


<div class="choose-color">
	<div class="flex flex-col leading-9 xs:flex-row xs:justify-center" >
		<div class="xs:justify-end">
			<input id="colorpicker"
				type="color" 
				colorpick-eyedropper-active="true"
				value={toHex($color).substring(0,7)}
				on:change={colorPicked}
				class="block w-3/4 h-8 mx-auto xs:w-16"
			>
		</div>
		<div class="xs:ml-2">
			<label for="colorpicker">hsla(
				<input id="hue"
					placeholder="Hue"
					type="number" 
					min={0} max={360}
					class="hsla" 
					style="background-color: {$color};"
					bind:value={h} 
				>,
				<input id="saturation"
					placeholder="Saturation"
					type="number" 
					min={0} max={100} step={0.5}
					class="hsla" 
					style="background-color: {$color};" 
					bind:value={sP}
				>%,
				<input id="luminosity"
					placeholder="luminosity"
					type="number" 
					min={0} max={100} step={0.5}
					class="hsla" 
					style="background-color: {$color};" 
					bind:value={lP} 
				>%,
				<input id="alpha"
					placeholder="Hue"
					type="number" 
					min={0} max={1} step={0.05}
					class="hsla" 
					style="background-color: {$color};" 
					bind:value={a}
				>
				)
			</label>
		</div>
	</div>
</div>

<style lang="postcss">
	label {
		@apply block flex items-center justify-end w-full text-[0.75em];
	}
	label input {
		@apply text-[2em];
	}
	input {
		@apply text-right border-transparent leading-tight flex-shrink;
	}
	.choose-color {
		@apply max-w-max mx-auto pb-4 leading-loose sm:text-xl;
	}
	.hsla {
		@apply font-semibold max-w-[4ch];
	}
</style>