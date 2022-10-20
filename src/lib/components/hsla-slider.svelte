<script>
	const propNames = {
		'H':'Hue',
		'S':'Saturation',
		'L':'Lightness',
		'A':'Alpha'
	}
	export let prop = 'H'
	export let store
	export let max = 1
	export let step = 0.001
	// let thumbBg = ``
	let style = `--prop: '${prop}';`

	let propName = propNames[prop]
	import './slider.pcss'

</script>

<div class="text-center">
	<input aria-label="{propName} Slider" class="hsla-slider {prop}" {style} type="range" id="slider-{prop}" bind:value={$store} min={0} {max} {step}/>
</div>

