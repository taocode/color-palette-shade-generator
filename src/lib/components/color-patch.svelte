<script>
import { darken, lighten, parseToHsla, readableColor, toHsla } from 'color2k'
import { XIcon } from 'svelte-feather-icons'
import { clickOutside } from 'svelte-use-click-outside'
import Swatch from './swatch.svelte'
import VarsOutput from './vars-output.svelte'

import { dots, hueName } from '$lib'
import { colorNames } from '$lib/stores'

export let name = ''
export let color = 'black'
export let description = 'Color'
export let shades = ['white']
export let schemeIndex = 0

let hidden = false
let includeDefault = false

$: lastShade = shades[shades.length-1]
$: inputColor = lighten(color,0.30)
$: hue = parseToHsla(color)[0].toFixed()
$: $colorNames[schemeIndex] = name
</script>

<div class="name" style="
background: {lastShade};
color: {shades[0]}; 
background: linear-gradient(90deg, {lastShade} 10%, {shades[0]} 90%;">
  <input bind:value={name}
    placeholder={hueName(hue)}
    size={5}
    class="varName"
    style="--color-background:{lastShade}; 
    --color-foreground: {shades[0]}; 
    --color-placeholder:{shades[1]};">
{#if description}<em>({description} = {hue}°)</em>{/if}
  <button class="border border-transparent hover:border-current rounded p-1 text-xs"
  on:click={() => { hidden = ! hidden }}>{@html dots}</button>
  <div class="fixed hidden bg-dark-900 bg-opacity-80 inset-0 flex z-10" class:hidden>
    <div class="details"
      use:clickOutside={() => hidden = true}
      style="--color-background: {color}; --color-foreground: {shades[0]}">
      <div class="var-title">
        <label class="" style="color: {color}; background-color: {lastShade};">
          var:
          <input placeholder={hueName(hue)} bind:value={name} class="border-1 ml-1"
          size={name.length}
          style="--color-placeholder: {darken(color,0.175)}; --color-background: {inputColor}; --color-foreground: {darken(color,0.25)}; border-color: {readableColor(inputColor)};">
        </label>
        <button title="close" class="close flex" on:click={() => hidden = true}><XIcon size="1.5x" /></button>
      </div>
      <div class="var-panels">
        <div>
          <VarsOutput type="CSS" {name} {color} {shades} />
        </div>
        <div>
          <VarsOutput type="Tailwind+CSS" {name} {color} {shades} {includeDefault} showIncludeDefault />
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
	}
  .close {
    @apply bg-white text-dark-300 rounded-sm float-right;
  }
  label {
    @apply text-xl p-1 pl-2 inline-block;
  }
  input {
    background-color: var(--color-background);
    color: var(--color-foreground);
    @apply font-500 max-w-30 border-0 pl-2;
  }
  ::placeholder {
    color: var(--color-placeholder);
    font-weight: 300;
  }
  .varName {
    /* @apply w-max-w-16; */
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
    @apply lg:(grid gap-2 grid-cols-3)
  }

</style>