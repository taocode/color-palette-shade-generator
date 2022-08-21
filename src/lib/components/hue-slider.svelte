<script>
	import { adjustHue } from 'color2k'
	import Slider from '@bulatdashiev/svelte-slider'
	import {hue} from '$lib/stores'
	
	$: _hue = [$hue,360]
	$: hue.set(_hue[0])
</script>

<div class="hue-slider" style="
--track-bg: linear-gradient(
	90deg,
	hsl(0, 100%, 50%) 0%,
	hsl(36, 100%, 50%) 10%,
	hsl(72, 100%, 50%) 20%,
	hsl(108, 100%, 50%) 30%,
	hsl(144, 100%, 50%) 40%,
	hsl(180, 100%, 50%) 50%,
	hsl(216, 100%, 50%) 60%,
	hsl(252, 100%, 50%) 70%,
	hsl(288, 100%, 50%) 80%,
	hsl(324, 100%, 50%) 90%,
	hsl(0, 100%, 50%) 100%
);
--progress-bg: transparent;
--thumb-bg: {adjustHue(`hsl(${_hue[0]}, 100%, 50%)`,180)};
" on:click={(event) => {
		const onThumb = event.target.classList.contains('thumb-content')
		if (onThumb) return
		const { layerX, target } = event
		const hs = target.closest('.hue-slider')
		const factorTarget = (layerX / parseFloat(hs.offsetWidth))
		const hueTarget = factorTarget * 360
		// console.log('clicked',{onThumb},`${factorTarget}, ${hueTarget}`,layerX,we.offsetWidth,{target,event})
		hue.set(hueTarget)
	}
}>
	<Slider min={0} max={360} step={0.1} bind:value={_hue}
	/>
</div>

<style lang="postcss">
	.hue-slider {
		@apply max-w-[60ch] mx-auto;
	}
</style>