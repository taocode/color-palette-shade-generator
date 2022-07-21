<script>
  import { parseToHsla, readableColor, toHsla } from 'color2k'
  import { CopyIcon, PlusIcon } from 'svelte-feather-icons'

  import { hueName, notice, shadesAsCSS, shadesAsTailwind, tailwindVarOpts } from '$lib'
  import { tailwindVarOpt } from '$lib/stores'

  export let type = 'CSS'
  export let name = ''
  export let color = 'black'
  export let shades = ['white']
  let showVarOpt = type === 'Tailwind'
  $: hue = parseToHsla(color)[0]
  $: hName = hueName(hue)
  let _tailwindVarOpt = $tailwindVarOpt
  $: tailwindVarOpt.set(_tailwindVarOpt)

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
<div class="vars-output {type.toLocaleLowerCase()}">
  <button title="Copy" on:click={copyClick} class="inline-block">
    <h2 class="mr-1">{type}</h2>
    <CopyIcon size="1x" />
  </button>
  {#if showVarOpt}
<select bind:value={_tailwindVarOpt}
  style="--color-background: {color}; --color-foreground: {readableColor(color)};">
    {#each tailwindVarOpts as o, i}
    <option value={o[0]}>{o[1]}</option>
    {/each}
  </select>

  {/if}
  <div class="vars">
    {#if type === "Tailwind"}
    <div class="muted">colors: &lbrace;</div>
    <div class="copyTarget">
      <div class="pl-3">
        '{name || hName}': &lbrace;
        {@html shadesAsTailwind( name, color, shades, _tailwindVarOpt )}
          &rbrace;,
      </div>
    </div>
    <div class="muted">&rbrace;,</div>
    {:else}
    <div class="muted">::root &lbrace;</div>
    <div class="copyTarget">
      {@html shadesAsCSS( name, color, shades )}
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
  select {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
</style>