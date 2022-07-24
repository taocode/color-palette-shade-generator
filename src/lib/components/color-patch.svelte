<script>
import { lighten, darken, parseToHsla, readableColor, desaturate, toHsla, readableColorIsBlack, opacify } from 'color2k'
import { XIcon, CopyIcon } from 'svelte-feather-icons'
import { browser } from '$app/env'
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

let hidden = true

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
if (browser) {
  document.addEventListener('keydown', (event) => {
        
        if (event.key === 'Escape') {
         //if esc key was not pressed in combination with ctrl or alt or shift
            const isNotCombinedKey = !(event.ctrlKey || event.altKey || event.shiftKey);
            if (isNotCombinedKey) {
                console.log('Escape key was pressed with out any group keys')
              hidden = true
            }
        }
    });
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
--color-primary: {color};
--color-background: {lastShade};
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
      style="--color-background: {color}; 
        --color-foreground: {readableColor(color)};
        --color-desaturated: {lighten(desaturate(color,0.3),0.15)};"
      >
      <button title="close" class="close" on:click={() => hidden = true}
        style="
        --color-foreground: var(--color-light);
        --color-background: var(--color-dark);
        "><XIcon size="1.5x" /></button>
      <div class="var-title"
        style="
        --color-background: {lastShade};
        --color-foreground: {readableColor(lastShade)}">
        <div class="flex place-items-center font-mono"
        style="">
          <div class="flex place-items-center mr-1">CSS var:</div>
          <SettingVarCssPrefix dashDash fixedColor={lastShade} />
          {#if _cssVarPrefix}
          <label for="varname{schemeIndex}" title="var name" class="">
            -
          </label>
          {/if}
          <input id="varname{schemeIndex}" 
            placeholder={hueName(hue)} 
            bind:value={name} 
            class=""
            size={name?.length || 6}
            style="--color-placeholder: {desaturate(lighten(color,0.2),0.1)};
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
    @apply flex absolute top-2 right-2 rounded-sm float-right border-1;
    color: var(--color-foreground);
    background-color: var(--color-background);
    border-color: var(--color-foreground);
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
    input {
      @apply py-0.5 font-mono pl-2;
    }
  }
  .var-title {
    @apply -m-2 pl-3 py-1;
    background-color: var(--color-dark);
    color: var(--color-foreground);
  }
  .var-panels {
    @apply md:(flex gap-6 flex-cols-2);
  }
</style>