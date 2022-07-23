<script>
import { lighten, darken, parseToHsla, readableColor, desaturate, toHsla } from 'color2k'
import { XIcon, CopyIcon } from 'svelte-feather-icons'
import TailwindIcon from '$lib/components/svg/tailwind.svelte'
import { clickOutside } from 'svelte-use-click-outside'
import Swatch from './swatch.svelte'
import VarsOutput from './vars-output.svelte'
// import 

import { dots, hueName, notice } from '$lib'
import { colorNames, varOptCSS, varOptTailwind, cssVarPrefix } from '$lib/stores'
import SettingVarCss from './setting-var-css.svelte'
import SettingVarCssPrefix from './setting-var-css-prefix.svelte'

export let color = 'black'
export let description = 'Color'
export let shades = ['white']
export let schemeIndex = 0
export let name = $colorNames[schemeIndex]

let hidden = false

$: lastShade = shades[shades.length-1]
$: inputColor = lighten(color,0.30)
$: hue = parseToHsla(color)[0].toFixed()
$: $colorNames[schemeIndex] = name
$: _cssVarPrefix = $cssVarPrefix
$: cssVarPrefix.set(_cssVarPrefix)
$: {
  $varOptCSS
  $varOptTailwind
}
function copyClick(event,chosen) {
    const varsOutput = event.srcElement.closest('.color-patch').querySelector('.var-panels .'+chosen)
    console.log({varsOutput,event},event.srcElement)
    const text = varsOutput.querySelector('.copyTarget').innerText.trim()
    const heading = varsOutput.querySelector('h2').innerText.trim()
    console.log({heading,text,event,varsOutput})
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

<div class="color-patch name" style="
--color-background: {color};
--color-foreground: {readableColor(lastShade)};
--color-dark: {lastShade};
--color-light: {shades[0]};
">
  <div class="flex align-middle">
    <input id="varName" 
      bind:value={name}
      placeholder={hueName(hue)}
      size={name?.length || 6}
      class="varName"
      >
    <button 
      on:click={(event)=>copyClick(event,'css')}
      title="Copy CSS variables"
      class="mx-3 mt-2 inline-flex text-xs" 
    >
      <CopyIcon size="1.25x" class="mr-1" /><span class="align-bottom tracking-tighter">CSS</span>
    </button>
    <button 
      on:click={(event)=>copyClick(event,'tailwind')}
      class="mx-3 mt-2 inline-flex text-xs" 
      title="Copy Tailwind variables"
    >
      <CopyIcon size="1.25x" class="mr-1" /><span class="align-bottom tracking-tighter -mt-0.4 inline-block transform scale-60"><TailwindIcon /></span>
    </button>
    {#if description}
    <em>({description} = {hue}°)</em>
    {/if}
    <button class="border border-transparent hover:border-current rounded px-1 "
    on:click={() => { hidden = ! hidden }}>{@html dots}</button>
  </div>
  <div class="fixed hidden bg-dark-900 bg-opacity-80 inset-0 flex z-10" class:hidden>
    <div class="details relative"
      use:clickOutside={() => hidden = true}
      style="--color-background: {color}; --color-foreground: {readableColor(color)}">
      <button title="close" class="close flex absolute top-1 right-1" on:click={() => hidden = true}><XIcon size="1.5x" /></button>
      <div class="var-title">
        <div class="pl-2 flex place-items-center"
        style="">
          <div class="flex place-items-center mr-1">CSS var:</div>
          <SettingVarCssPrefix dashDash fixedColor={color} />
          {#if _cssVarPrefix}
          <label for="varname{schemeIndex}" title="var name" class="">
            -
          </label>
          {/if}
          <input id="varname{schemeIndex}" 
            placeholder={hueName(hue)} 
            bind:value={name} 
            class="border-1 ml-1"
            size={name?.length || 6}
            style="--color-placeholder: {darken(color,0.3)};
                  border-color: var(--color-dark);"
            >
        </div>
      </div>
      <div class="var-panels">
        <div class="css">
          <VarsOutput type="CSS" {name} {color} {shades} />
        </div>
        <div class="tailwind">
          <VarsOutput type="Tailwind" {name} {color} {shades} />
        </div>
      </div>
    </div>
  </div>
</div>
<div class="shades">
{#each shades as color, shadeIndex}
  <Swatch {color} {shadeIndex} on:updateColor />
{/each}
</div>
<style lang="postcss">
  .name {
		@apply px-4 py-2;
    --start-percent: 75%;
    background: var(--color-dark);
    color: var(--color-foreground); 
    background: linear-gradient(90deg, var(--color-dark) var(--start-percent), var(--color-light) 100%);
    @screen xs {
      --start-percent: 66%;
    }
    @screen sm {
      --start-percent: 40%;
    }
	}
  .close {
    @apply bg-white text-dark-300 rounded-sm float-right;
  }
  label {
    @apply text-xl p-1 pl-2 flex flex-col;
  }
  input {
    @apply font-500 max-w-30 border-0 pl-2;
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
  input::placeholder {
    @apply font-100 italic;
    color: var(--color-placeholder);
    filter: saturate(0.25);
  }
  .varName {
    @apply py-0 leading-0 max-w-20 focus:max-w-none;
  }
  .shades {
		@apply flex flex-wrap text-center;
	}
  .details {
    @apply inset-auto m-auto p-2 border-2 z-10 
    transition duration-200 shadow-lg 
    max-h-[90vh] max-w-[95vw] overflow-auto
    ;
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
  .var-panels {
    @apply md:(flex gap-6 flex-cols-2);
  }
</style>