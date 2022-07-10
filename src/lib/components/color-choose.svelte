<script>
import { adjustHue, darken, readableColor, toHex, toHsla } from 'color2k'
import { browser } from '$app/env'
import { page } from '$app/stores'
import { schemes } from '$lib/lib'
import { steps, stepFactor } from '$lib/stores'

import Swatch from './swatch.svelte'

import { onMount } from 'svelte'

export let h = 200
export let s = 75
export let l = 50
export let a = 1
export let color = `hsla(${h}, ${s}%, ${l}%, ${a})`
export let stepPercent = 10
let scheme = 0


onMount(() => {
	if (browser) {
		const searchParams = $page.url.searchParams
		if (searchParams.has('color')) updateHSLA(toHsla('#'+searchParams.get('color')))
		if (searchParams.has('scheme')) scheme = parseInt(searchParams.get('scheme'))
		console.log('start color', {searchParams}, $page.url)
	}
});

let readable = readableColor("white")
let allColors = []

$: {

	stepFactor.set( stepPercent * 0.01)

	if (h < 0) h *= -1
	if (s < 0) s *= -1
	if (l < 0) l *= -1
	if (a < 0) a *= -1
	if (h > 360) h = h % 360
	if (s > 100) s = s % 100
	if (l > 100) l = l % 100
	if (a > 1) a = 1
	color = `hsla(${h}, ${s}%, ${l}%, ${a})`
	readable = readableColor(color)
	allColors = schemes[scheme].f(color, steps, stepFactor)
	if (browser) {
		history.replaceState({'color': toHex(color),'scheme': scheme},'','?color='+toHex(color).substring(1)+'&scheme='+scheme)
	}
}
let lc = ''
function updateHSLA(hsla) {	
	const aHSLA = hsla.substring(5).split(', ')
	// console.log({hsla, aHSLA})
	h = aHSLA[0]
	s = aHSLA[1].substring(0,aHSLA[1].length-1)
	l = aHSLA[2].substring(0,aHSLA[2].length-1)
	a = aHSLA[3].substring(0,aHSLA[3].length-1)
}
const getHue = (hsla) => {
	return hsla.substring(5).split(', ')[0]
}

function updateColor(event) {
	updateHSLA( event.detail )
}

let hidden = true

function colorPicked({srcElement}) {
	updateHSLA(toHsla(srcElement.value))
}

let _steps = $steps

</script>
<div class="wrap" style="color: {readable}; background-color: {color};">
	<h1>Color Palette Shade Generator</h1>

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
					<input class="hsla" style="background-color: {color};" bind:value={s} placeholder="Saturation"
					type="number" min={0} max={100}>%,
					<input class="hsla" style="background-color: {color};" bind:value={l} placeholder="luminosity"
					type="number" min={0} max={100}>%,
					<input class="hsla" style="background-color: {color};" bind:value={a} placeholder="Hue"
					type="number" min={0} max={1} step={0.1}>
					)
				</label>
		
			</div>

		</div>
		<div class="sm:flex">
			<div class="flex">
				<label class="mx-2">
					<input id="steps"
					class="w-[2ch] mr-1"
					style="background-color: {color};"
					bind:value={_steps}
					type="number"
					min={3}
					max={20}
					placeholder="steps"
					on:change={() => steps.set(_steps)}>
					<span>Steps</span>
				</label>
				<label>
					<input id="step-percent"
					class="w-[3ch] mr-1"
					style="background-color: {color};"
					bind:value={stepPercent}
					type="number"
					min={0}
					max={100}
					step={0.5}
					placeholder="">
						<span class="whitespace-nowrap">% Step</span>
				</label>
			</div>
			<label class="m-2 px-2 max-w-min mx-auto">
				<select class="max-w-min" style="background-color: {color};" bind:value={scheme}>
					{#each schemes as s, i}
						<option value={i}>
							{s.name}
						</option>
					{/each}
				</select>
				<span class="ml-1">Scheme</span>
			</label>
		</div>		
		
		</div>
	</div>

{#each allColors as color}
	<div class="name" style="
	background: {lc = color.shades[color.shades.length-1]};
	color: {readableColor(lc)}; 
	background: linear-gradient(90deg, {lc} 10%, {color.shades[0]} 90%;">{color.name}
	<button class="border border-transparent hover:border-current rounded px-1 text-xs"
	on:click={() => { hidden = ! hidden }}>
	&bullet;&hairsp;&bullet;&hairsp;&bullet;
	</button>
	<div class="details hidden" class:hidden>
		{#each color.shades as c, i}
		<div>
			--c-primary-{i+1}00: {c};
		</div>
		{/each}
  </div>
	</div>
	<div class="shades">
	{#each color.shades as c}
		<Swatch color={c} on:updateColor={updateColor} />
	{/each}
	</div>
{/each}

<style lang="postcss">
	h1 {
		@apply text-3xl text-center p-4 font-semibold;
	}
	label {
		@apply block flex items-center justify-end w-full text-[0.75em];
		input {
			@apply text-[2em];
		}
		select {
			@apply text-[1.5em] tracking-tighter;
		}
	}
	.name {
		@apply px-4 py-2;
	}
	input,
	select {
		@apply text-right border-transparent leading-tight flex-shrink;
	}
	select option {
		@apply text-xs;
	}
	.hsla {
		@apply font-semibold max-w-[4ch];
	}
	.shades {
		@apply flex flex-wrap text-center;
	}
</style>