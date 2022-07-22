<script>
import { darken, lighten, parseToHsla, readableColor, toHsla } from 'color2k'
import { XIcon, CopyIcon } from 'svelte-feather-icons'
import TailwindIcon from '$lib/components/svg/tailwind.svelte'
import { clickOutside } from 'svelte-use-click-outside'
import Swatch from './swatch.svelte'
import VarsOutput from './vars-output.svelte'

import { dots, hueName } from '$lib'
import { colorNames, varOptCSS, varOptTailwind } from '$lib/stores'

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
$: {
  $varOptCSS
  $varOptTailwind
}
</script>

<div class="name" style="
--color-background: {color};
--color-foreground: {readableColor(color)};
">
  <div class="flex align-middle">
    <input bind:value={name}
      placeholder={hueName(hue)}
      size={name?.length || 6}
      class="varName"
      style="--color-background:{lastShade};
      --color-foreground: {shades[0]};
      --color-placeholder:{shades[2]};">
    {#if description}
    <em>({description} = {hue}°)</em>
    {/if}
    <button class="mx-3 mt-2 inline-flex text-xs" title="Copy CSS variables">
      <CopyIcon size="1.25x" class="mr-1" /><span class="align-bottom tracking-tighter">CSS</span>
    </button>
    <button class="border border-transparent hover:border-current rounded px-1 "
    on:click={() => { hidden = ! hidden }}>{@html dots}</button>
  </div>
  <div class="fixed hidden bg-dark-900 bg-opacity-80 inset-0 flex z-10" class:hidden>
    <div class="details"
      use:clickOutside={() => hidden = true}
      style="--color-background: {color}; --color-foreground: {readableColor(color)}">
      <div class="var-title">
        <label class="" style="color: {color}; background-color: {lastShade};">
          var:
          <input placeholder={hueName(hue)} bind:value={name} class="border-1 ml-1"
          size={name?.length || 6}
          style="--color-placeholder: {darken(color,0.175)}; --color-background: {inputColor}; --color-foreground: {darken(color,0.25)}; border-color: {readableColor(inputColor)};">
        </label>
        <button title="close" class="close flex" on:click={() => hidden = true}><XIcon size="1.5x" /></button>
      </div>
      <div class="var-panels">
        <div>
          <VarsOutput type="CSS" {name} {color} {shades} />
        </div>
        <div>
          <VarsOutput type="Tailwind" {name} {color} {shades} />
        </div>
      </div>
    </div>
  </div>
</div>
<div class="shades">
{#each shades as color}
  <Swatch {color} on:updateColor />
{/each}
</div>
<style lang="postcss">
  .name {
		@apply px-4 py-2;
    --start-percent: 75%;
    background: var(--color-background);
    color: var(--color-foreground); 
    background: linear-gradient(90deg, var(--color-background) var(--start-percent), var(--color-foreground) 100%);
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
    @apply text-xl p-1 pl-2 inline-block;
  }
  input {
    @apply font-500 max-w-30 border-0 pl-2;
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
  ::placeholder {
    @apply font-300;
    color: var(--color-placeholder);
  }
  .varName {
    @apply py-0 leading-0;
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
  }
  .var-panels {
    @apply md:(flex gap-6 flex-cols-2);
  }
</style>