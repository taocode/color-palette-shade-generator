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

let hidden = true
let includeDefault = false

$: lastShade = shades[shades.length-1]
$: inputColor = lighten(color,0.30)
$: placeholderColor = lighten(color,0.2)
$: hue = parseToHsla(color)[0].toFixed()
$: $colorNames[schemeIndex] = name
</script>

<div class="name" style="
background: {lastShade};
color: {readableColor(lastShade)}; 
background: linear-gradient(90deg, {lastShade} 10%, {shades[0]} 90%;">
  <input bind:value={name}
    placeholder={hueName(hue)}
    size={5}
    class="varName"
    style="background:{lastShade}; --color-placeholder:{lighten(color,0.25)};">
{#if description}<em>({description} = {hue}°)</em>{/if}
  <button class="border border-transparent hover:border-current rounded p-1 text-xs"
  on:click={() => { hidden = ! hidden }}>{@html dots}</button>
  <div class="fixed hidden bg-dark-900 bg-opacity-80 inset-0 flex z-10" class:hidden>
    <div class="details"
      use:clickOutside={() => hidden = true}
      style="--color-background: {color}; --color-foreground: {readableColor(color)}">
      <div class="var-title">
        <label class="py-1 pl-2" style="color: {color}; background-color: {readableColor(color)};">
          var:
          <input placeholder={hueName(hue)} bind:value={name} class="border-1 px-1"
          size={name.length}
          style="--color-placeholder: {darken(color,0.3)}; background-color: {inputColor}; color: {readableColor(inputColor)}; border-color: {readableColor(inputColor)};">
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
  ::placeholder {
    color: var(--color-placeholder);
  }
  .var-panels {
    @apply lg:(grid gap-2 grid-cols-3)
  }

</style>