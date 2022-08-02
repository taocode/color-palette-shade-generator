<script>
	import { darken, lighten, readableColor, hsla, toHex, toHsla, parseToHsla, adjustHue } from 'color2k'
	import { EyeIcon, CopyIcon, CheckSquareIcon, SquareIcon } from 'svelte-feather-icons'
	import { browser } from '$app/env'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	import ColorPaletteShadeGenerator from '$lib/components/color-palette-shade-generator.svelte'
	import About from '$lib/components/about.svelte'
	import ColorChoose from '$lib/components/color-choose.svelte'
	import ColorPatch from '$lib/components/color-patch.svelte'
	import SettingsScheme from '$lib/components/settings-scheme.svelte'
	import SettingsShades from '$lib/components/settings-shades.svelte'
	import AllVarsOutput from '$lib/components/all-vars-output.svelte'
	import SettingVarTailwind from '$lib/components/setting-var-tailwind.svelte'
	import SettingVarCss from '$lib/components/setting-var-css.svelte'
	import HueSlider from '$lib/components/hue-slider.svelte'
	import GradientDisplay from '$lib/components/gradient-display.svelte'

	import { schemes, schemeColors, updateHSLA, colorShades, hueName } from '$lib'
	import { hue, saturation, lightness, alpha, primaryColor, colorNames, scheme, steps, 
		factorLightness, factorSaturation, cssVarPrefix, varOptCSS, varOptTailwind, defaults } from '$lib/stores'
	import SettingVarCssPrefix from '$lib/components/setting-var-css-prefix.svelte'
	import Tailwind from '$lib/components/svg/tailwind.svelte'

	let timer
	const debounceHistory = (state) => {
    clearTimeout(timer)
		timer = setTimeout(() => {
			const params = new URLSearchParams(state)
			const strParams = (params.toString() !== '') ? `/?${params}` : '/'
      history.replaceState(state,'',strParams)
		}, 200);
	}
	
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

			if (searchParams.has('vp')) cssVarPrefix.set(searchParams.get('vp'))
			if (searchParams.has('vc')) varOptCSS.set(searchParams.get('vc'))
			if (searchParams.has('vt')) varOptTailwind.set(searchParams.get('vt'))

			const colorNamesSP = new Array(10).fill('c')
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

			if ($cssVarPrefix != defaults.cssVarPrefix) state.vp = $cssVarPrefix
			if ($varOptCSS != defaults.varOptCSS) state.vc = $varOptCSS
			if ($varOptTailwind != defaults.varOptTailwind) state.vt = $varOptTailwind

			$colorNames.forEach((name,i) => {
				if (name && name !== '') {
					state[`c${i}`] = name
				}
			})
			// console.log('colornames:',{$colorNames,state})
			// console.log(params.toString(),{params})
			
			debounceHistory(state)
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
	let iconEyeSize = '1.3x'
	let outputTogglers = false
	let iconSquareSize = '1.3x'
	function toggleShowOutputs(e) {
		outputTogglers = ! outputTogglers
	}
	let showCopiers = false
	function toggleCopiers(e) {
		showCopiers = ! showCopiers
	}
	let showColorPatches = false
</script>

<svelte:head>
	<title>Color Palette Shade Generator</title>
  <meta name="description" content="Use color theory to generate a color palette with multiple shades of color codes ready to paste into CSS, Tailwind.">
	<link rel='canonical' href='/' />
</svelte:head>

<div class="pt-3 pb-1 -mb-4 top-controls" 
style="
	color: {readable}; 
	background-color: {$primaryColor};
	--color-C: {darken(adjustHue($primaryColor,240),0.175)};
	--color-P: {darken(adjustHue($primaryColor,330),0.175)};
	--color-S: {lighten(adjustHue($primaryColor,180),0.12)};
	--color-G: {lighten(adjustHue($primaryColor,90),0.12)};
	--color-glow: {toHex(readable)+'99'};
	--color-btn-bg: {buttonColor};
	--color-btn-fg: {readableColor(buttonColor)};
">
	<h1><ColorPaletteShadeGenerator /></h1>
	<HueSlider />
	<div class="panel-scheme">
		<div class="show-toggles"
		on:mouseenter={()=>outputTogglers = true}
		on:mouseleave={()=>outputTogglers = false}
		>
			<button class="primary-toggle">
				<EyeIcon size={iconEyeSize} />
			</button>
			<div class="toggles-wrap outputTogglers" class:showing={outputTogglers}>
				<div class="show-toggler">
					<button on:click={()=> showColorPatches = ! showColorPatches}>
						<span class="inline-block mr-1">{#if showColorPatches}<CheckSquareIcon size={iconSquareSize} />{:else}<SquareIcon size={iconSquareSize} />{/if}</span>
						Show Shades
					</button>
				</div>
				<div class="show-toggler">
					<button on:click={()=> showSettings = ! showSettings}>
						<span class="inline-block mr-1">{#if showSettings}<CheckSquareIcon size={iconSquareSize} />{:else}<SquareIcon size={iconSquareSize} />{/if}</span>
						Show Settings
					</button>
				</div>
				<div class="show-toggler">
					<button on:click={()=> showVars = ! showVars}>
						<span class="inline-block mr-1">{#if showVars}<CheckSquareIcon size={iconSquareSize} />{:else}<SquareIcon size={iconSquareSize} />{/if}</span>
						Show Code
					</button>
				</div>
			</div>
		</div>
		<div>
			<SettingsScheme />
		</div>
		<div class="show-toggles"
			on:mouseenter={()=>showCopiers = true}
			on:mouseleave={()=>showCopiers = false}>
			<button class="primary-toggle">
				<CopyIcon size={iconEyeSize} />
			</button>
			<div class="toggles-wrap copiers" class:showing={showCopiers}>
				<div class="show-toggler">
					<div>
						<button title="Copy CSS Vars"
							on:click={() => copyVars('css') }
							>
								CSS
						</button>
						<button title="Copy Tailwind Vars"
							on:click={() => copyVars('tailwind') }
							>
								<span class="icon-tailwind">
									<Tailwind />
								</span>
							</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="panel-settings" class:showing={showSettings}>
		<ColorChoose />
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
<div class="separator" class:showing={!showColorPatches}></div>
<div class="color-patches" class:showing={showColorPatches}>
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
</div>

<div class="relative flow-root min-h-screen">
	<About />
	<GradientDisplay />
</div>

<style lang="postcss">
	h1 {
		@apply text-3xl text-center p-4 font-semibold;
	}
	button {
		@apply py-1 px-3 flex align-middle place-items-center mx-auto my-2 xs:(py-2 px-4);
		background-color: var(--color-btn-bg);
		color: var(--color-btn-fg);
	}
	.allvars {
		@apply max-w-max mx-auto text-center mt-6 mb-2;
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
	.color-patches {
		display: block;
		&:not(.showing) {
			display: none;
		}
	}
	.separator {
		@apply h-2 mt-2 bg-black;
		&:not(.showing) {
			display: none;
		}
	}
	.show-toggles {
		@apply relative;
		.toggles-wrap {
			@apply absolute py-1 px-2 z-20 top-9 text-left
			xs:(top-11 -right-12);
			background-color: var(--color-btn-bg);
			color: var(--color-btn-fg);
			&:not(.showing) {
				@apply hidden;
			}
			&.outputTogglers {
				@apply left-4 w-45;
			}
			&.copiers {
				@apply right-4 w-30;
			}
			button {
				@apply w-full;
			}
		}
		.show-toggler {
			@apply whitespace-nowrap;
		}
	}
	.panel-settings {
		&:not(.showing) {
			display: none;
		}
	}
	.panel-scheme {
		@apply flex mx-auto justify-center relative mt-6;
		.primary-toggle {
			@apply mx-4;
		}
	}
</style>