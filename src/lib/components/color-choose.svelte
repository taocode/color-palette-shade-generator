<script>
import { adjustHue, darken, readableColor, hsla, toHex, toHsla, parseToHsla } from 'color2k'

import { hue, saturation, lightness, alpha, primaryColor } from '$lib/stores'
import { updateHSLA } from '$lib';

$: h = $hue
$: lP = ($lightness*100).toFixed()
$: sP = ($saturation*100).toFixed()
$: a = ($alpha*1).toFixed(1)

$: primaryColor.set( hsla($hue, $saturation, $lightness, $alpha) )
$: hue.set( h )
$: saturation.set( sP/100 )
$: lightness.set( lP/100 )
$: alpha.set(a)

function colorPicked({srcElement}) {
	updateHSLA(srcElement.value,true)
}
</script>


<div class="choose-color">
	<div class="flex flex-col leading-9 xs:flex-row xs:justify-center" >
		<div class="xs:justify-end mt-4">
			<input id="colorpicker"
				type="color" 
				colorpick-eyedropper-active="true"
				value={toHex($primaryColor).substring(0,7)}
				on:change={colorPicked}
				class="block w-3/4 h-8 mx-auto xs:w-20"
			>
		</div>
		<div class="xs:ml-2">
			<label for="colorpicker">HSLA(
				<input id="hue"
					placeholder="Hue"
					type="number" 
					min={0} max={360}
					class="hsla" 
					style="background-color: {$primaryColor};"
					bind:value={h} 
				>,
				<input id="saturation"
					placeholder="Saturation"
					type="number" 
					min={0} max={100} step={0.5}
					class="hsla" 
					style="background-color: {$primaryColor};" 
					bind:value={sP}
				>%,
				<input id="luminosity"
					placeholder="luminosity"
					type="number" 
					min={0} max={100} step={0.5}
					class="hsla" 
					style="background-color: {$primaryColor};" 
					bind:value={lP} 
				>%,
				<input id="alpha"
					placeholder="Hue"
					type="number" 
					min={0} max={1} step={0.05}
					class="hsla" 
					style="background-color: {$primaryColor};" 
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
		@apply text-[2em] ml-2;
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