<script>
	import { readableColor, hsla, toHex, toHsla, parseToHsla } from 'color2k'
	import { browser } from '$app/env'
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'

	import ColorPaletteShadeGenerator from '$lib/components/color-palette-shade-generator.svelte'
	import About from '$lib/components/about.svelte'
	import ColorChoose from '$lib/components/color-choose.svelte'
	import ColorPatch from '$lib/components/color-patch.svelte'
	import SettingsScheme from '$lib/components/settings-scheme.svelte'
	import SettingsShades from '$lib/components/settings-shades.svelte'
	import VarsOutput from '$lib/components/vars-output.svelte'

	import { schemes, schemeColors, unsubs, updateHSLA, shadesAsCSS } from '$lib'
	import { hue, saturation, lightness, alpha, primaryColor, colorNames, scheme, steps, factorLightness, factorSaturation } from '$lib/stores'

	
	export let lightnessPercent = $factorLightness*100
	export let saturationPercent = $factorSaturation*100
	
	onMount(() => {
		// console.log("onMount()",{browser})
		if (browser) {
			const searchParams = $page.url.searchParams
			if (searchParams.has('color')) updateHSLA(toHsla('#'+searchParams.get('color')),true)
			if (searchParams.has('scheme')) scheme.set( parseInt(searchParams.get('scheme')) )
			if (searchParams.has('steps')) steps.set( parseInt(searchParams.get('steps')) )
			if (searchParams.has('pL')) factorLightness.set( 0.01 * parseFloat(searchParams.get('pL')) )
			if (searchParams.has('pS')) factorSaturation.set( 0.01 * parseFloat(searchParams.get('pS')) )
			// console.log('start color', {searchParams}, $page.url)
			allColors = schemeColors(schemes[$scheme],$primaryColor)
		}
	})
	// onDestroy(() => {
	// 	console.log('lib:onDestroy()',unsubs)
	// 	unsubs.forEach((unsub) => {unsub()})
	// })

	$: primaryColor.set($hue, $saturation, $lightness, $alpha)
	
	let readable = readableColor("white")
	let allColors = []
	
	function updateColor(event) {
		console.log('updateColor(event)',event.detail,{event})
		updateHSLA( event.detail )
	}

	$: {
		$steps
		lightnessPercent = $factorLightness*100
		saturationPercent = $factorSaturation*100

		primaryColor.set( hsla($hue, $saturation, $lightness, $alpha) )

		readable = readableColor($primaryColor)
		allColors = schemeColors(schemes[$scheme],$primaryColor)
		// console.log('colors vs',{allColors},schemeColors(schemes[scheme],color))
		if (browser) {
			const state = {
				color: toHex($primaryColor).substring(1),
				scheme: $scheme,
				steps: $steps,
				pL: $factorLightness*100,
				pS: $factorSaturation*100,
			}
			const params = new URLSearchParams(state)
			// console.log(params.toString(),{params})
			history.replaceState(state,'',`?${params}`)
		}
	}

</script>

<svelte:head>
	<title>Color Palette Shade Generator</title>
  <meta name="description" content="Generate a color palette using color theory with multiple shades for use with CSS, Tailwind">
</svelte:head>

<div class="pt-2 pb-6" style="color: {readable}; background-color: {$primaryColor};">
	<h1><ColorPaletteShadeGenerator /></h1>
	<ColorChoose />
	<SettingsScheme />
	<SettingsShades />
</div>
{#each allColors as {color, shades, description}, i}
	<ColorPatch {color} {description} {shades} schemeIndex={i}
	on:updateColor={updateColor} />
{/each}

<div class="prose">
	<h2>All Vars CSS</h2>
	{#each allColors as {color, name, shades}, i}
		{@html shadesAsCSS(($colorNames[i]) ? $colorNames[i] : name,color,shades)}
	{/each}
</div>


<About />

<style lang="postcss">
	h1 {
		@apply text-3xl text-center p-4 font-semibold;
	}
</style>