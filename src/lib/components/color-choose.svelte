<script>
import {adjustHue, darken, readableColor} from 'color2k'

export let h = 0
export let s = 75
export let l = 50
export let a = 1
export let steps = 10
export let stepPercent = 5
let stepFactor = stepPercent * 0.01

const shades = (color) => {
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

let color = `hsla(${h},${s}%,${l}%,${a})`
let readable = readableColor("white")
let complementary = "green"
let primaryShades = []
let complementaryShades = []
let scheme = "Complementary"
let schemes = [
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
				name: 'analogous-1',
				shades: shades(adjustHue(color,30))
			}, {
				name: 'analogous-2',
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

	const schemeChange = (event) => {
		console.log('schemechange',event.target)
	}

$: {
	stepFactor = stepPercent * 0.01
	steps
	color = `hsla(${h},${s}%,${l}%,${a})`
	readable = readableColor(color)
	complementary = adjustHue(color,180)
	primaryShades = shades(color)
	complementaryShades = shades(complementary)
}
</script>

<div class="p-10 flex" style="color: {readable}; background-color: {color};">
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
			bind:value={stepPercent}
			type="number"
			min={0}
			max={100}
			step={0.5}
			placeholder="">
			% Step
		</label>
		<label>
			<select style="background-color: {color};"
			bind:value={scheme} on:change={schemeChange}>
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