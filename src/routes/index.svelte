<script>
	import { adjustHue, darken, readableColor, hsla, toHex, toHsla, parseToHsla } from 'color2k'
	import { browser } from '$app/env'
	import { page } from '$app/stores'

	import ColorPaletteShadeGenerator from '$lib/components/color-palette-shade-generator.svelte'
	import About from "$lib/components/about.svelte"
	import ColorChoose from "$lib/components/color-choose.svelte"
	import ColorPatch from '$lib/components/color-patch.svelte'
	import SettingsScheme from '$lib/components/settings-scheme.svelte'
	import SettingsShades from "$lib/components/settings-shades.svelte"

	import { schemes, schemeColors } from '$lib'
	import { scheme, steps, factorLightness, factorSaturation } from '$lib/stores'

	export let h = 250
	export let s = 0.65
	export let l = 0.45
	export let a = 1
	export let color = hsla(h, s, l, a)
	export let lightnessPercent = 8
	export let _scheme = 1
	export let saturationPercent = -2
	
	onMount(() => {
		// console.log("onMount()",{browser})
		if (browser) {
			const searchParams = $page.url.searchParams
			if (searchParams.has('color')) updateHSLA(toHsla('#'+searchParams.get('color')),true)
			if (searchParams.has('scheme')) _scheme = parseInt(searchParams.get('scheme'))
			if (searchParams.has('steps')) _steps = parseInt(searchParams.get('steps'))
			if (searchParams.has('fL')) lightnessPercent = 100 * parseFloat(searchParams.get('fL'))
			// console.log('start color', {searchParams}, $page.url)
		}
	})

	let readable = readableColor("white")
	let allColors = []
	let _steps = 9

	function updateColor(event) {
		console.log('updateColor(event)',event.detail,{event})
		updateHSLA( event.detail )
	}
	function updateHue(event) {
		// console.log('updateHue(event)',event.detail,{event})
		h = event.detail
	}
	function updateSaturation(event) {
		// console.log('updateSaturation(event)',event.detail,{event})
		s = event.detail
	}
	function updateLuminosity(event) {
		// console.log('updateLuminosity(event)',event.detail,{event})
		l = event.detail
	}
	function updateAlpha(event) {
		// console.log('updateAlpha(event)',event.detail,{event})
		a = event.detail
	}

	function updateHSLA(hsla,fix=false) {	
		let [h,s,l,a] = parseToHsla(hsla)
		if (fix) {
			h = h.toFixed()
			s = s.toFixed(3)
			l = l.toFixed(3)
			a = a.toFixed(2)
		}
	}
	$: {
		steps.set( _steps )
		factorLightness.set( lightnessPercent * 0.01 )
		factorSaturation.set( saturationPercent * 0.01 )

		color = hsla(h, s, l, a)
		readable = readableColor(color)
		allColors = schemeColors(schemes[$scheme],color)
		// console.log('colors vs',{allColors},schemeColors(schemes[scheme],color))
		if (browser) {
			let params = new URLSearchParams()
			params.append('color', toHex(color).substring(1))
			params.append('scheme', _scheme)
			params.append('steps', _steps)
			params.append('fL', $factorLightness)
			params.append('fS', $factorSaturation)
			// console.log(params.toString(),{params})
			history.replaceState({'color': toHex(color),'scheme': _scheme},'',`?${params}`)
		}
	}

</script>

<svelte:head>
	<title>Color Palette Shade Generator</title>
  <meta name="description" content="Generate a color palette using color theory with multiple shades for use with CSS, Tailwind">
</svelte:head>

<div class="pt-2 pb-6" style="color: {readable}; background-color: {color};">
	<h1><ColorPaletteShadeGenerator /></h1>
	<ColorChoose {h} {s} {l} {a} 
		on:updateHue={updateHue}
		on:updateSaturation={updateSaturation}
		on:updateLuminosity={updateLuminosity}
		on:updateAlpha={updateAlpha}
		on:updateColor={updateColor}
	/>
	<SettingsScheme />
	<SettingsShades  />
</div>
{#each allColors as {color, name, shades, hue, description}}
	<ColorPatch {color} {description} {name} {shades} {hue} 
	on:updateColor={updateColor} />
{/each}

<About />

<style lang="postcss">
	h1 {
		@apply text-3xl text-center p-4 font-semibold;
	}
</style>