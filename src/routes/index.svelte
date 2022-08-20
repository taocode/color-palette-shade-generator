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

	import { colorShades, hueName, getSchemeColorShade, notice, schemes, schemeColors, updateHSLA } from '$lib'
	import { hue, saturation, lightness, alpha, primaryColor, colorNames, scheme, steps, 
		factorLightness, factorSaturation, cssVarPrefix, varOptCSS, varOptTailwind, defaults } from '$lib/stores'
	import { clickOutside } from 'svelte-use-click-outside'
	import SettingVarCssPrefix from '$lib/components/setting-var-css-prefix.svelte'
	import Tailwind from '$lib/components/svg/tailwind.svelte'
	import SchemeChooserIcons from '$lib/components/scheme-chooser-icons.svelte'
	import MakersMark from '$lib/components/makers-mark.svelte'

	let timer
	const historyDebounceMS = 50
	const debounceHistory = (state) => {
    clearTimeout(timer)
		timer = setTimeout(() => {
			const params = new URLSearchParams(state)
			const strParams = (params.toString() !== '') ? `/?${params}` : '/'
      history.replaceState(state,'',strParams)
		}, historyDebounceMS);
	}
		
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
	$: buttonColor = adjustHue($primaryColor,120)
	let showCode = false
	let showSettings = false

	const copyVars = (type) => {
		const allVars = document.getElementById(`all-vars-${type}`)
		const varsOutput = allVars?.closest('.all-vars-output')
		const heading = varsOutput.querySelector('h2').innerText.trim()
		const text = allVars.innerText.trim()
		// console.log({text,type,varsOutput})
		if (!navigator.clipboard) {
			document.execCommand('copy',false,text)
		} else {
			navigator.clipboard.writeText(text).then(
				function() {
					document.documentElement.append(notice(`copied <code class="whitespace-nowrap">${heading}</code> vars`))
				}
			).catch(
				function(err) {
					document.documentElement.append(notice(`failed to copy: ${err}`))
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
	let showShades = false

	let cpsgStyle = ""
$: _si = $scheme
$: _pc = $primaryColor

let cpsgColors = ['']
let cpsgReadables = ['']
$: {
  const _sCs = schemeColors(schemes[_si],_pc)
  cpsgColors = _sCs.map((v,i)=>getSchemeColorShade(_si, _pc, i, _sCs))
  if (_si === 0) {
    cpsgColors[0] = darken(_pc,0.3)
		cpsgColors[1] = darken(_pc,0.1)
		cpsgColors[2] = lighten(_pc,0.1)
    cpsgColors[3] = lighten(_pc,0.3)
  } else if (_si === 1) {
    cpsgColors[0] = darken(_pc,0.4)
    cpsgColors[2] = darken(_pc,0.1)
    cpsgColors[1] = lighten(_pc,0.1)
    cpsgColors[3] = lighten(_pc,0.3)
  } else if (_si === 2) {
		cpsgColors = cpsgColors.map((v,i)=>i<1?darken(v,0.2):lighten(v,0.2))
	} else {
		cpsgColors = cpsgColors.map((v,i)=>i<1?darken(v,0.2):v)
	}
  cpsgStyle = cpsgColors.reduce((p,c,i) => `${p}\n--cpsg-${i}: ${c};`,'') 
							+	cpsgColors.reduce((p,c,i) => `${p}\n--cpsg-fg-${i}: ${readableColor(c)};`,'')
}

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
	--color-glow: {toHex(readable)+'99'};
	--color-btn-bg: {buttonColor};
	--color-btn-fg: {readableColor(buttonColor)};
">
	<div class="scheme-{$scheme}" style={cpsgStyle}>
		<h1><ColorPaletteShadeGenerator /></h1>
	</div>
	<HueSlider />
	<div class="panel-scheme">
		<div class="show-toggles"
		use:clickOutside={()=>outputTogglers=false}
		on:mouseenter={()=>outputTogglers=true}
		>
			<button class="primary-toggle"
			on:click={()=>outputTogglers=true}>
				<EyeIcon size={iconEyeSize} />
			</button>
			<div class="toggles-wrap outputTogglers" class:showing={outputTogglers}>
				<div class="show-toggler">
					<button on:click={()=> showSettings = ! showSettings}>
						<span class="inline-block mr-1">{#if showSettings}<CheckSquareIcon size={iconSquareSize} />{:else}<SquareIcon size={iconSquareSize} />{/if}</span>
						Settings
					</button>
				</div>
				<div class="show-toggler">
					<button on:click={()=> showCode = ! showCode}>
						<span class="inline-block mr-1">{#if showCode}<CheckSquareIcon size={iconSquareSize} />{:else}<SquareIcon size={iconSquareSize} />{/if}</span>
						Code
					</button>
				</div>
				<div class="show-toggler">
					<button on:click={()=> showShades = ! showShades}>
						<span class="inline-block mr-1">{#if showShades}<CheckSquareIcon size={iconSquareSize} />{:else}<SquareIcon size={iconSquareSize} />{/if}</span>
						Shades
					</button>
				</div>
			</div>
		</div>
		<div>
			<SchemeChooserIcons />
		</div>
		<div class="show-toggles"
			on:mouseenter={()=>showCopiers = true}
			use:clickOutside={()=>showCopiers = false}>
			<button class="primary-toggle"
			on:click={()=>showCopiers = true}>
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
		
		 <div class="allvars-outputs" class:showing={showCode}>
			<div>
				<AllVarsOutput type="CSS" {allColors} />
			</div>
			<div>
				<AllVarsOutput type="Tailwind" {allColors} />
			</div>
		</div>
	</div>
</div>
<div class="separator" class:showing={!showShades}></div>
<div class="color-patches" class:showing={showShades}>
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
	<MakersMark />
</div>

<style lang="postcss">
	h1 {
		@apply text-2xl text-center p-4 font-semibold xs:text-3xl;
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
		@apply relative p-0;
		.toggles-wrap {
			@apply absolute py-1 px-2 z-20 top-9 text-left
			xs:(top-11 -right-12);
			background-color: var(--color-btn-bg);
			color: var(--color-btn-fg);
			&:not(.showing) {
				@apply hidden;
			}
			&.outputTogglers {
				@apply left-0 w-40;
			}
			&.copiers {
				@apply right-0 w-22;
				button {
					@apply justify-center border-1 w-9/10 rounded-md;
				}
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
		@apply flex mx-auto max-w-[60ch] justify-between relative mt-6 px-4;
		.primary-toggle {
			@apply mx-0;
		}
	}
</style>