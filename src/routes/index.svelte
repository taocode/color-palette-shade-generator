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
	import AllVarsOutput from '$lib/components/all-vars-output.svelte'
	import SettingVarTailwind from '$lib/components/setting-var-tailwind.svelte'
	import SettingVarCss from '$lib/components/setting-var-css.svelte'

	import { schemes, schemeColors, updateHSLA, colorShades } from '$lib'
	import { hue, saturation, lightness, alpha, primaryColor, colorNames, scheme, steps, 
		factorLightness, factorSaturation, varOptTailwind, defaults } from '$lib/stores'
import SettingVarCssPrefix from '$lib/components/setting-var-css-prefix.svelte';

	
	export let lightnessPercent = $factorLightness*100
	export let saturationPercent = $factorSaturation*100
	
	onMount(() => {
		// console.log("onMount()",{browser})
		if (browser) {
			const searchParams = $page.url.searchParams
			if (searchParams.has('h')) hue.set(parseInt(searchParams.get('h')))
			if (searchParams.has('s')) saturation.set(0.01*parseFloat(searchParams.get('s')))
			if (searchParams.has('l')) lightness.set(0.01*parseFloat(searchParams.get('l')))
			if (searchParams.has('a')) alpha.set(parseFloat(searchParams.get('a')))
			if (searchParams.has('scheme')) scheme.set( parseInt(searchParams.get('scheme')) )
			if (searchParams.has('steps')) steps.set( parseInt(searchParams.get('steps')) )
			if (searchParams.has('pL')) factorLightness.set( 0.01 * parseFloat(searchParams.get('pL')) )
			if (searchParams.has('pS')) factorSaturation.set( 0.01 * parseFloat(searchParams.get('pS')) )
			const colorNamesSP = new Array(3).fill('c')
				.map((c,i) => searchParams.has(c+i) ? searchParams.get(c+i) : '')
			// console.log('onMount(colorNamesSearchParams)',{colorNamesSP,searchParams})
			colorNames.set(colorNamesSP)
			// console.log('start color', {searchParams}, $page.url)
			allColors = schemeColors(schemes[$scheme],$primaryColor)
		}
	})

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
			const state = {}
			if ($hue != defaults.hue) state.h = $hue
			if ($saturation != defaults.saturation) state.s = $saturation*100
			if ($lightness != defaults.lightness) state.l = $lightness*100
			if ($alpha != defaults.alpha) state.a = $alpha

			if ($scheme != defaults.scheme) state.scheme = $scheme
			if ($steps != defaults.steps) state.steps = $steps
			if ($factorLightness != defaults.factorLightness) state.pL = $factorLightness*100
			if ($factorSaturation != defaults.factorSaturation) state.pS = $factorSaturation*100

			$colorNames.forEach((name,i) => {
				if (name && name !== '') {
					state[`c${i}`] = name
				}
			})
			// console.log('colornames:',{$colorNames,state})
			const params = new URLSearchParams(state)
			// console.log(params.toString(),{params})
			const strParams = (params.toString() !== '') ? `/?${params}` : '/'
			history.replaceState(state,'',strParams)
		}
	}
let showAll = false
</script>

<svelte:head>
	<title>Color Palette Shade Generator</title>
  <meta name="description" content="Generate a color palette using color theory with multiple shades for use with CSS, Tailwind">
</svelte:head>

<div class="pt-2 pb-6 top-controls" style="color: {readable}; background-color: {$primaryColor};">
	<h1><ColorPaletteShadeGenerator /></h1>
	<ColorChoose />
	<SettingsScheme />
	<div class="flex justify-center gap-4 mt-4 mx-auto">
		<div>
			<SettingVarCssPrefix label="CSS Var Prefix: " />
		</div>
		<div>
				<SettingVarCss withLabel />
		</div>
		<div>
				<SettingVarTailwind withLabel />
		</div>
	</div>
	<div class="my-3">
		<SettingsShades />
	</div>
</div>
{#each allColors as {color, description, names}, i}
	<ColorPatch {color} {names} {description} schemeIndex={i}
	shades={colorShades(color,$steps, ($scheme === 1) ? $factorLightness/3 : $factorLightness, $factorSaturation)}
	on:updateColor={updateColor} />
{/each}
<div class="text-center my-6"><button class="py-2 px-6"
	 on:click={() => showAll = ! showAll }
	 style="background-color:{$primaryColor}; color: {readableColor($primaryColor)}">
	{#if showAll}Hide{:else}Show{/if} All Vars
</button></div>
<div class="prose mx-auto hidden px-5" class:hidden={!showAll}>
	<AllVarsOutput type="CSS" {allColors} />
	<AllVarsOutput type="Tailwind" {allColors} />
</div>


<About />

<style lang="postcss">
	h1 {
		@apply text-3xl text-center p-4 font-semibold;
	}
</style>