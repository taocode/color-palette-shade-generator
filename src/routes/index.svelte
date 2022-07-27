<script>
	import { darken, lighten, readableColor, hsla, toHex, toHsla, parseToHsla, adjustHue } from 'color2k'
	import { EyeOffIcon, EyeIcon, CopyIcon } from 'svelte-feather-icons'
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

	import { schemes, schemeColors, updateHSLA, colorShades, hueName } from '$lib'
	import { hue, saturation, lightness, alpha, primaryColor, colorNames, scheme, steps, 
		factorLightness, factorSaturation, varOptTailwind, defaults } from '$lib/stores'
	import SettingVarCssPrefix from '$lib/components/setting-var-css-prefix.svelte'
import Tailwind from '$lib/components/svg/tailwind.svelte'

	
	export let lightnessPercent = $factorLightness*100
	export let saturationPercent = $factorSaturation*100
	
	onMount(() => {
		// console.log("onMount()",{browser})
		if (browser) {
			const searchParams = $page.url.searchParams
			if (searchParams.has('H')) hue.set(parseInt(searchParams.get('H')))
			if (searchParams.has('S')) saturation.set(0.01*parseFloat(searchParams.get('S')))
			if (searchParams.has('L')) lightness.set(0.01*parseFloat(searchParams.get('L')))
			if (searchParams.has('A')) alpha.set(parseFloat(searchParams.get('A')))
			if (searchParams.has('scheme')) scheme.set( parseInt(searchParams.get('scheme')) )
			if (searchParams.has('steps')) steps.set( parseInt(searchParams.get('steps')) )
			if (searchParams.has('pL')) factorLightness.set( 0.01 * parseFloat(searchParams.get('pL')) )
			if (searchParams.has('pS')) factorSaturation.set( 0.01 * parseFloat(searchParams.get('pS')) )
			const colorNamesSP = new Array(4).fill('c')
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
			if ($hue != defaults.hue) state.H = ($hue*1).toFixed(1)
			if ($saturation != defaults.saturation) state.S = ($saturation*100).toFixed()
			if ($lightness != defaults.lightness) state.L = ($lightness*100).toFixed()
			if ($alpha != defaults.alpha) state.A = (1*$alpha).toFixed(2)

			if ($scheme != defaults.scheme) state.scheme = $scheme.toFixed()
			if ($steps != defaults.steps) state.steps = $steps.toFixed()
			if ($factorLightness != defaults.factorLightness) state.pL = ($factorLightness*100).toFixed(1)
			if ($factorSaturation != defaults.factorSaturation) state.pS = ($factorSaturation*100).toFixed(1)

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
	$: buttonColor = adjustHue($primaryColor,90)
	let showVars = false
	let showSettings = false

	const copyVars = (type) => {
		const allVars = document.getElementById(`all-vars-${type}`)
		const varsOutput = allVars?.closest('.all-vars-output')
		const heading = varsOutput.querySelector('h2').innerText.trim()
		const text = allVars.innerText.trim()
		console.log({text,type,varsOutput})
		if (!navigator.clipboard) {
			document.execCommand('copy',false,text)
		} else {
			navigator.clipboard.writeText(text).then(
				function() {
					notice(`copied vars for: <span class="whitespace-nowrap">${heading}</span>`,varsOutput)
				}
			).catch(
				function(err) {
					notice(`failed to copy: ${err}`,event.srcElement)
				}
			)
		}
	}
</script>

<svelte:head>
	<title>Color Palette Shade Generator</title>
  <meta name="description" content="Generate a color palette using color theory with multiple shades for use with CSS, Tailwind">
</svelte:head>

<div class="pt-2 pb-6 top-controls" 
style="
	color: {readable}; 
	background-color: {$primaryColor};
	--color-C: {darken(adjustHue($primaryColor,30),0.1)};
	--color-P: {darken(adjustHue($primaryColor,120),0.1)};
	--color-S: {lighten(adjustHue($primaryColor,210),0.1)};
	--color-G: {lighten(adjustHue($primaryColor,300),0.1)};
">
	<h1><ColorPaletteShadeGenerator /></h1>
	<ColorChoose />
	<SettingsScheme />
	<div class="panel-settings" class:showing={showSettings}>
		<div class="varopts settings">
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
	<div class="allvars">
		<div>
			<button class=""
				on:click={() => showSettings = ! showSettings }
				style="background-color:{buttonColor}; color: {readableColor(buttonColor)}">
				<span class="icon">{#if showSettings}<EyeOffIcon size="1.25x" title="Hide" />{:else}<EyeIcon size="1.25x" title="Show" />{/if}</span>
				Settings
		 </button>
			<button class=""
			on:click={() => showVars = ! showVars }
			style="background-color:{buttonColor}; color: {readableColor(buttonColor)}">
		 	<span class="icon">{#if showVars}<EyeOffIcon size="1.25x" title="Hide" />{:else}<EyeIcon size="1.25x" title="Show" />{/if}</span>
			 Vars
			</button>
			<button title="Copy CSS Vars"
				on:click={() => copyVars('css') }
				style="background-color:{buttonColor}; color: {readableColor(buttonColor)}">
					<span class="icon"><CopyIcon size="1x" /></span>
					CSS
			</button>
			<button title="Copy Tailwind Vars"
				on:click={() => copyVars('tailwind') }
				style="background-color:{buttonColor}; color: {readableColor(buttonColor)}">
					<span class="icon"><CopyIcon size="1x" /></span>
					<span class="icon-tailwind">
						<Tailwind />
					</span>
			</button>
		</div>
		 <div class="allvars-outputs" class:showing={showVars}>
			<div>
				<AllVarsOutput type="CSS" {allColors} />
			</div>
			<div>
				<AllVarsOutput type="Tailwind" {allColors} />
			</div>
		</div>
	</div>
</div>
{#each allColors as {color, description, name}, i}
	<ColorPatch {color} 
	name={$colorNames[i]}
	placeholder={
		((name && $colorNames[0]) ? $colorNames[0] : hueName(parseToHsla(color)[0])) + 
		((!name) ? '' : `-${name}`)} 
	{description} schemeIndex={i}
	shades={colorShades(color,$steps, ($scheme === 1) ? $factorLightness/3 : $factorLightness, $factorSaturation)}
	on:updateColor={updateColor} />
{/each}


<About />

<style lang="postcss">
	h1 {
		@apply text-3xl text-center p-4 font-semibold;
	}
	button {
		@apply py-2 px-4 flex align-middle gap-2;
	}
	.icon {
		@apply inline-block pt-0.5;
	}
	.allvars {
		@apply max-w-max mx-auto text-center mt-6 mb-2;
		>div {
			@apply flex flex-wrap gap-2 justify-center;
		}
	}
	.allvars-outputs {
		@apply my-4 md:flex;
		>div {
			@apply mx-3;
		}
		&:not(.showing) {
			display: none;
		}
	}
	.panel-settings {
		&:not(.showing) {
			display: none;
		}
	}
</style>