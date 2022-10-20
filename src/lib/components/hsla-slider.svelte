<script>
	import { adjustHue } from 'color2k'
	import Slider from '@bulatdashiev/svelte-slider'
	import { hue, saturation } from '$lib/stores'
	
	export let prop = 'S'
	export let store = saturation
	export let max = 1
	export let step = 0.001
	// let thumbBg = ``
	let _vals = [$store,max]
	$: _vals = [$store,max]
	$: store.set(_vals[0])
	let style = `--prop: '${prop}';`

	import './slider.pcss'

</script>

<div class="text-center">
	<input class="hsla-slider {prop}" {style} type="range" id="slider-{prop}" bind:value={$store} min={0} {max} {step}/>
</div>

