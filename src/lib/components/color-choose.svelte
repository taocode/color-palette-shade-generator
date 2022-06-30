<script>
import { adjustHue, darken, readableColor, toHex, toHsla } from 'color2k'
import Swatch from './swatch.svelte'

export let h = 210
export let s = 75
export let l = 35
export let a = 1
export let steps = 9
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
let allColors = []
let scheme = 0
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
	if (h < 0 || h > 360) h = 0
	if (s < 0 || s > 100) s = 75
	if (l < 0 || l > 100) l = 50
	if (a < 0 || a > 1) a = 1
	color = `hsla(${h}, ${s}%, ${l}%, ${a})`
	readable = readableColor(color)
	allColors = schemes[scheme].f()
}
let lc = ''
function updateColorFromHSLA(hsla) {	
	const aHSLA = hsla.substring(5).split(', ')
	console.log({hsla, aHSLA})
	h = aHSLA[0]
	s = aHSLA[1].substring(0,aHSLA[1].length-1)
	l = aHSLA[2].substring(0,aHSLA[2].length-1)
	a = aHSLA[3].substring(0,aHSLA[3].length-1)
}
function updateColor(event) {
	console.log('updateColor:',event.detail,{event})
	updateColorFromHSLA( event.detail )
}

let hidden = true

function colorPicked({srcElement}) {
	updateColorFromHSLA(toHsla(srcElement.value))
}

</script>
<div class="wrap" style="color: {readable}; background-color: {color};">
	<h1>Color Palette Shade Generator</h1>

	<div class="max-w-max mx-auto pb-4 sm:text-2xl leading-loose">
		<div class="flex basis-1/2 items-center justify-center">
			<div class="w-full text-right flex-grow grow"><label for="colorpicker">Pick/Set Color:</label></div>
			<div class="w-full">
				<input type="color" id="colorpicker"
				on:change={colorPicked}
				class="w-full"
				value={toHex(color)}
				colorpick-eyedropper-active="true">
			</div>
		</div>
		<div class="md:flex" >
			<div class="font-bold">
				hsla(
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
		
			</div>
			<div class="">
				<div class="flex">
					<label class="mx-2">
						<input id="steps"
						class="w-16 mr-1"
						style="background-color: {color};"
						bind:value={steps}
						type="number"
						min={3}
						max={20}
						placeholder="steps">
						<span>Steps</span>
					</label>
					<label>
						<span class="flex-grow"></span>
						<input id="step-percent"
						class="w-16 mr-1"
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
			</div>
		</div>
		<label class="my-2 max-w-min mx-auto">
			<select class="max-w-min" style="background-color: {color};" bind:value={scheme}>
				{#each schemes as s, i}
					<option value={i}>
						{s.text}
					</option>
				{/each}
			</select>
			<span class="ml-1">Scheme</span>
		</label>
		
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
		@apply block flex items-center text-right w-full;
	}
	.name {
		@apply px-4 py-2;
	}
	input,
	select {
		@apply text-right  text-[1.2em] border-transparent leading-tight;
	}
	select option {
		@apply text-xs;
	}
	.hsla {
		@apply font-bold max-w-[4ch];
	}
	.shades {
		@apply flex flex-wrap text-center;
	}
</style>