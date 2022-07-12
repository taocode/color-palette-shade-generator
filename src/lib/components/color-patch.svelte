<script>
import Swatch from './swatch.svelte';
import { readableColor, toHsla } from 'color2k'

import { dots } from '$lib/lib'

export let name = 'color'
export let color = 'black'
export let hue = 0
export let description = 'Color'
export let shades = ['white']

let hidden = true

$: lastShade = shades[shades.length-1]
</script>

<div class="name" style="
background: {lastShade};
color: {readableColor(lastShade)}; 
background: linear-gradient(90deg, {lastShade} 10%, {shades[0]} 90%;">{name} {#if description}<em>({description} = {hue}°)</em>{/if}
<button class="border border-transparent hover:border-current rounded p-1 text-xs"
on:click={() => { hidden = ! hidden }}>{@html dots}</button>
<div class="hidden" class:hidden>
  <div class="details">
    <div class="css">
      <h2>CSS</h2>
      <div class="vars">
        <div>
          ::root &lbrace;
          <div>
            --color-{name}: {toHsla(color)};
          </div>
          {#each shades as c, i}
          <div>
            --color-{name}-{i+1}00: {c};
          </div>
          {/each}
          &rbrace;
        </div>
      </div>
    </div>
    <div class="tailwind">
      <h2>Tailwind/WindiCSS</h2>
      <div class="vars">
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
</div>
</div>
<div class="shades">
{#each shades as color}
  <Swatch {color} on:updateColor />
{/each}
</div>

<style lang="postcss">
  h2 {
    @apply mt-4 mb-2 text-xl font-semibold sm:text-2xl;
  }
  .name {
		@apply px-4 py-2;
	}
  .shades {
		@apply flex flex-wrap text-center;
	}
  .details {
    @apply md:(grid gap-2 grid-cols-2);
    >:last-child {
      @apply md:text-black;
    }
  }
  .vars div div {
    padding-left: 2ch;
  }

</style>