<script>
  import { parseToHsla, toHsla } from 'color2k'
  import { CopyIcon, PlusIcon } from 'svelte-feather-icons'

  import { hueName, notice, shadesAsCSS, shadesAsTailwind } from '$lib'
  import { colorNames } from '$lib/stores'

  export let type = 'CSS'
  export let name = ''
  export let allColors = []
  export let showIncludeDefault = false
  export let includeDefault = false
  $: color = allColors[0]?.color || 'black'
  $: hue = parseToHsla(color)[0].toFixed()
  $: hName = hueName(hue)

  function copyClick(event) {
    const varsOutput = event.srcElement.closest('.vars-output')
    const text = varsOutput.querySelector('.copyTarget').innerText.trim()
    const heading = varsOutput.querySelector('h2').innerText.trim()
    console.log({text,event,varsOutput})
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
ALLVARS
<div class="all-vars-output {type.toLocaleLowerCase()}">
  <button title="Copy" on:click={copyClick} class="inline-block">
    <h2 class="mr-1">{type}</h2>
    <CopyIcon size="1x" />
  </button>
  {#if showIncludeDefault}
  <label><input type="checkbox" bind:checked={includeDefault} ><PlusIcon size="1x" />default</label>
  {/if}
  <div class="vars">
    {#if type === "Tailwind"}
    <div class="muted">colors: &lbrace;</div>
    <div class="copyTarget">
      <div class="pl-3">
        <div class="pl-3">
          {#each allColors as {color, name, shades}, i}
            <div>{$colorNames[i] || name}: &lbrace;</div>
            {@html shadesAsTailwind($colorNames[i] || name,color,shades)}
            <div>&rbrace;,</div>
          {/each}
        </div>
        &rbrace;,
      </div>
    </div>
    <div class="muted">&rbrace;,</div>
    {:else}
    <div class="muted">::root &lbrace;</div>
    <div class="copyTarget">
      <div class="pl-3">
        {#each allColors as {color, name, shades}, i}
          {@html shadesAsCSS($colorNames[i] || name,color,shades)}
        {/each}
      </div>
      &rbrace;,
  </div>
    <div class="muted">&rbrace;</div>
    {/if}
  </div>
</div>

<style lang="postcss">
  h2 {
    @apply inline-block my-2 text-xl font-semibold sm:text-2xl;
  }
  .vars {
    @apply font-mono text-xs;
  }
  .muted {
    @apply opacity-50 italic;
  }
</style>