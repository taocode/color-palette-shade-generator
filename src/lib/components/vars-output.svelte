<script>
  import { parseToHsla, readableColor, toHsla } from 'color2k'
  import { CopyIcon, PlusIcon } from 'svelte-feather-icons'

  import { colorShades, hueName, notice, shadesAsCSS, shadesAsTailwind } from '$lib'
  import { varOptTailwind, varOptCSS, cssVarPrefix, steps, factorLightness, factorSaturation } from '$lib/stores'

  import SettingVarTailwind from './setting-var-tailwind.svelte'
  import SettingVarCss from './setting-var-css.svelte'
  // import SettingVarCssPrefix from './setting-var-css-prefix.svelte'

  export let type = 'CSS'
  export let name = ''
  export let color = 'black'
  export let shades = colorShades(color,$steps,$factorLightness,$factorSaturation)

  $: hue = parseToHsla(color)[0]
  $: hName = hueName(hue)
  $: _varOptCSS = $varOptCSS
  $: _varOptTailwind = $varOptTailwind
  $: _cssVarPrefix = $cssVarPrefix

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
  <div class="heading">
    <button title={`Copy ${type} vars`} on:click={copyClick} class="inline-block">
      <h2 class="mr-2">{type}</h2>
      <div class="pt-4">
        <CopyIcon size="1x" />
      </div>
    </button>
    <div class="setting-control">
      {#if type === 'CSS'}
      <SettingVarCss fixedColor={color} />
      {/if}
      {#if type === 'Tailwind'}
      <SettingVarTailwind fixedColor={color} />
      {/if}
    </div>
  </div>
  <div class="vars">
    {#if type === "Tailwind"}
    <div class="muted">colors: &lbrace;</div>
    <div class="copyTarget">
      <div class="pl-3">
        '{name || hName}': &lbrace;
        {@html shadesAsTailwind( name, color, shades, _cssVarPrefix, _varOptCSS, _varOptTailwind )}
          &rbrace;,
      </div>
    </div>
    <div class="muted">&rbrace;,</div>
    {:else}
    <div class="muted">::root &lbrace;</div>
    <div class="copyTarget">
      {@html shadesAsCSS( name, color, shades, _cssVarPrefix, _varOptCSS )}
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