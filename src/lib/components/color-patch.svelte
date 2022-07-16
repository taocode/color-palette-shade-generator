<script>
import { readableColor, toHsla } from 'color2k'
import { XIcon } from 'svelte-feather-icons'
import { clickOutside } from 'svelte-use-click-outside'
import Swatch from './swatch.svelte'
import VarsOutput from './vars-output.svelte'

import { dots } from '$lib'

export let name = 'color'
export let color = 'black'
export let hue = 0
export let description = 'Color'
export let shades = ['white']

let hidden = true
let includeDefault = false

$: lastShade = shades[shades.length-1]
</script>

<div class="name" style="
background: {lastShade};
color: {readableColor(lastShade)}; 
background: linear-gradient(90deg, {lastShade} 10%, {shades[0]} 90%;">
  <input bind:value={name} 
    size={name.length}
    class="varName"
    style="background:{lastShade};">
  {#if description}<em>({description} = {hue}°)</em>{/if}
  <button class="border border-transparent hover:border-current rounded p-1 text-xs"
  on:click={() => { hidden = ! hidden }}>{@html dots}</button>
  <div class="fixed hidden bg-dark-900 bg-opacity-80 inset-0 flex z-10" class:hidden>
    <div class="details"
    use:clickOutside={() => hidden = true}
    style="background-color: {color}; color: {readableColor(color)}">
    <button title="close" class="close flex lg:hidden" on:click={() => hidden = true}><XIcon size="1.5x" /></button>
    <div>
        <VarsOutput type="CSS" {name} {color} {shades} />
      </div>
      <div>
        <VarsOutput type="Tailwind+CSS" {name} {color} {shades} {includeDefault} showIncludeDefault />
      </div>
      <div>
        <button title="close" class="close hidden lg:flex" on:click={() => hidden = true}><XIcon size="1.5x" /></button>
        <VarsOutput type="Tailwind" {name} {color} {shades} />
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
    lg:(grid gap-2 grid-cols-3);
  }

</style>