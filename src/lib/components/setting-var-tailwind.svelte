<script>
  import { readableColor } from 'color2k'
  import { primaryColor, optTailwind } from '$lib/stores'

  export const varOptsTailwind = [
    ['novar', 'No CSS vars'],
    ['varonly', 'CSS vars'],
    ['both', 'CSS vars +fallback']
  ]
  export let noColor = false
  export let color = noColor ? 'white' : $primaryColor
  export let fixedColor = ''
  export let withLabel = false

  $: color = noColor ? 'white' : (fixedColor || $primaryColor)
  $: readable = readableColor(color)
</script>
<div class="settings vars">
  {#if withLabel}
  <label for="varsOpt">
    Tailwind Vars:
  </label>
  {/if}
  <select id="varsOpt"
  bind:value={$optTailwind}
  style="--color-background: {color}; --color-foreground: {readable};"
  >
    {#each varOptsTailwind as o, i}
    <option value={o[0]}>{o[1]}</option>
    {/each}
  </select>
</div>

<style lang="postcss">
</style>