<script>
import Swatch from './swatch.svelte';
import { readableColor } from 'color2k'

import { dots } from '$lib/lib'

export let name = 'color'
export let color = 'black'
export let hue = 0
export let description = 'Color'
export let shades = ['white']

let hidden = false

$: lastShade = shades[shades.length-1]
</script>

<div class="name" style="
background: {lastShade};
color: {readableColor(lastShade)}; 
background: linear-gradient(90deg, {lastShade} 10%, {shades[0]} 90%;">{name} {#if description}<em>({description} = {hue}°)</em>{/if}
<button class="border border-transparent hover:border-current rounded p-1 text-xs"
on:click={() => { hidden = ! hidden }}>{@html dots}</button>
<div class="details hidden" class:hidden>
  <div>
    --color-{name}: {color};
  </div>
  {#each shades as c, i}
  <div>
    --color-{name}-{i+1}00: {c};
  </div>
  {/each}
  <div class="tailwind">
    <div>
      colors: &lbrace;
      <div>
        {name}: &lbrace;
          <div>DEFAULT: 'var(--color-{name})',</div>
          {#each shades as c, i}
            <div>'{i+1}00': 'var(--color-{name}-{i+1}00)',</div>
          {/each}
          &rbrace;,
      </div>
      &rbrace;,
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
  .shades {
		@apply flex flex-wrap text-center;
	}
  .tailwind div div {
    padding-left: 2ch;
  }

</style>