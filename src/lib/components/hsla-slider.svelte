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
</script>

<div class="hsla-slider {prop}" style={style} on:click={(event) => {
		const onThumb = event.target.classList.contains('thumb-content')
		if (onThumb) return
		const { layerX, target } = event
		const hs = target.closest('.hsla-slider')
		const factorTarget = (layerX / parseFloat(hs.offsetWidth))
		const targetValue = factorTarget * max
		// console.log('clicked',{onThumb},`${factorTarget}, ${targetValue}`,layerX,hs.offsetWidth,{target,event})
		store.set(targetValue)
	}
}>
	<Slider min={0} {max} {step} bind:value={_vals}
	/>
</div>