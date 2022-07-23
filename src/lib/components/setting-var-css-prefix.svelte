<script>
  import { darken, lighten, readableColor } from 'color2k'
  import { primaryColor, cssVarPrefix } from '$lib/stores'

  export let noColor = false
  export let fixedColor
  export let dashDash = false
  export let color = noColor ? 'white' : $primaryColor
  export let label = ''
  
  $: _cssVarPrefix = $cssVarPrefix
  $: cssVarPrefix.set(_cssVarPrefix)
  $: color = noColor ? 'white' : (fixedColor || $primaryColor)

</script>
<div class="flex ml-2">
  {#if dashDash}
  <label for="css-var-prefix" title="prefix" class="dash-dash" style="color: {readableColor(color)};">
    --
  </label>
  {/if}
  {#if label}
  <label for="css-var-prefix" class="label" style="color: {readableColor(color)};">
    {label}
  </label>
  {/if}

  <input id="css-var-prefix" 
    bind:value={_cssVarPrefix} 
    class="var-prefix"
    type="text"
    size={_cssVarPrefix?.length || 1}
    style="background-color: {color};
        color: {readableColor(color)};"
    >
</div>

<style lang="postcss">
  .dash-dash {
    @apply flex flex-col text-xl;
  }
</style>