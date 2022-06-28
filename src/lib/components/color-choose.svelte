<script>
import {adjustHue, darken, readableColor} from 'color2k'
import Swatch from './swatch.svelte'

export let h = 240
export let s = 80
export let l = 50
export let a = 0.9
export let steps = 10
export let stepPercent = 7.5
let stepFactor = stepPercent * 0.01

const shades = (color) => {
	let arr = [color]
	for (let i = 1; i < steps; i++) {
		if (i % 2) {
			arr.unshift(darken(color,(i+1)/2*stepFactor*-1))
		} else {
			arr.push(darken(color,i/2*stepFactor))
		}
	}
	return arr
}

let color = `hsla(${h}, ${s}%, ${l}%, ${a})`
let readable = readableColor("white")
let complementary = "green"
let allColors = []
let scheme = 3
let schemes = [
		{ id: 1, text: `Monochrome`, f: () => {
			return [{
				name: 'primary',
				shades: shades(color)
			}]
		} },
		{ id: 1, text: `Complementary`, f: () => {
			return [{
				name: 'primary',
				shades: shades(color)
			},{
				name: 'complementary',
				shades: shades(adjustHue(color,180))
			}]
		} },
		{ id: 2, text: `Analogous`, f: () => {
			return [{
				name: 'primary',
				shades: shades(color)
			}, {
				name: 'analogous1',
				shades: shades(adjustHue(color,30))
			}, {
				name: 'analogous2',
				shades: shades(adjustHue(color,60))
			}]
		} },
		{ id: 3, text: `Split Complementary`, f: () => {
			return [{
				name: 'primary',
				shades: shades(color)
			}, {
				name: 'split1',
				shades: shades(adjustHue(color,150))
			}, {
				name: 'split2',
				shades: shades(adjustHue(color,210))
			}]
		} },
		{ id: 4, text: `Triadic`, f: () => {
			return [{
				name: 'primary',
				shades: shades(color)
			}, {
				name: 'triad1',
				shades: shades(adjustHue(color,120))
			}, {
				name: 'triad2',
				shades: shades(adjustHue(color,240))
			}]
		} },
		{ id: 5, text: `Tetradic`, f: () => {
			return [{
				name: 'primary',
				shades: shades(color)
			}, {
				name: 'tetra1',
				shades: shades(adjustHue(color,60))
			}, {
				name: 'tetra2',
				shades: shades(adjustHue(color,180))
			}, {
				name: 'tetra3',
				shades: shades(adjustHue(color,240))
			}]
		} },
	]

$: {
	stepFactor = stepPercent * 0.01
	steps
	color = `hsla(${h}, ${s}%, ${l}%, ${a})`
	readable = readableColor(color)
	complementary = adjustHue(color,180)
	allColors = schemes[scheme].f()
}
let lc = ''
function updateColor(event) {
	console.log('updateColor:',event.detail,{event})
	const newHSLA = event.detail.substring(5)
	const aHSLA = newHSLA.split(', ')
	console.log({newHSLA, aHSLA})
	h = aHSLA[0]
	s = aHSLA[1].substring(0,aHSLA[1].length-1)
	l = aHSLA[2].substring(0,aHSLA[2].length-1)
	a = aHSLA[3].substring(0,aHSLA[3].length-1)
}
</script>
<div class="wrap" style="color: {readable}; background-color: {color};">
	<h1>Color Palette Shade Generator</h1>

<div class="p-10 flex mx-auto max-w-max" >
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
			<span class="flex-grow"> </span>
			<input id="steps"
			class="w-16"
			style="background-color: {color};" 
			bind:value={steps}
			type="number"
			min={3}
			max={20}
			placeholder="steps">
			Steps
		</label>
		<label>
			<span class="flex-grow"></span>
			<input id="step-percent"
			class="w-16"
			style="background-color: {color};"
			bind:value={stepPercent}
			type="number"
			min={0}
			max={100}
			step={0.5}
			placeholder="">
				% Step
		</label>
		<label>
			<select style="background-color: {color};" bind:value={scheme}>
				{#each schemes as s, i}
					<option value={i}>
						{s.text}
					</option>
				{/each}
			</select>

			Color Scheme
		</label>
	</div>
</div>
</div>

{#each allColors as color}
	<div class="name" style="
	background: {lc = color.shades[color.shades.length-1]};
	color: {readableColor(lc)}; 
	background: linear-gradient(90deg, {lc} 10%, {color.shades[0]} 90%;">{color.name}</div>
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
		@apply block flex items-center text-right w-full;
	}
	.name {
		@apply px-4 py-2;
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