<script>
  import { parseToHsla, toHsla } from 'color2k'
  import { CopyIcon, PlusIcon } from 'svelte-feather-icons'

  import { colorShades, hueName, notice, schemes, shadesAsCSS, shadesAsTailwind } from '$lib'
  import { colorNames, varOptCSS, varOptTailwind, cssVarPrefix, steps, factorLightness, factorSaturation, scheme } from '$lib/stores'
  import SettingVarCssPrefix from './setting-var-css-prefix.svelte'
  import SettingVarCss from './setting-var-css.svelte'
  import SettingVarTailwind from './setting-var-tailwind.svelte'

  export let type = 'CSS'
  export let allColors = []
  export let _varOptCSS = $varOptCSS
  export let _varOptTailwind = $varOptTailwind
  $: color = allColors[0]?.color || 'black'
  $: hue = parseToHsla(color)[0].toFixed()
  $: hName = hueName(hue)
  $: _varOptTailwind = $varOptTailwind
  $: _varOptCSS = $varOptCSS
  $: _cssVarPrefix = $cssVarPrefix

  $: _scheme = schemes[$scheme]
  
  const placeholder = (i, currentColor) => {
    return Array.isArray(_scheme.names) && _scheme.names.length >= i 
            ? ($colorNames[0] || hName) + '-'+ _scheme.names[i-1] 
            : hueName(parseToHsla(currentColor)[0])
  }
  function copyClick(event) {
    const varsOutput = event.srcElement.closest('.all-vars-output')
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
<div class="all-vars-output {type.toLocaleLowerCase()}">
  <div class="heading">
    <button title={`Copy ${type} vars`}  on:click={copyClick} class="flex-grow">
      <h2 class="mr-2">{type}</h2>
      <div class="pt-4">
        <CopyIcon size="1x" />
      </div>
    </button>
    <div class="setting-control">
      {#if type === "CSS"}
      <div class="border-1">
        <SettingVarCssPrefix noColor />
      </div>
      <div>
        <SettingVarCss noColor />
      </div>
      {/if}
      {#if type === "Tailwind"}
      <SettingVarTailwind noColor />
      {/if}
    </div>
  </div>
  <div class="vars">
    {#if type === "Tailwind"}
    <div class="muted">colors: &lbrace;</div>
    <div id="all-vars-tailwind" class="copyTarget">
      <div class="pl-3">
        <div class="pl-3">
{#each allColors as {color, name}, i}
<div>{$colorNames[i] || placeholder(i,color)}: &lbrace;</div>
{@html shadesAsTailwind($colorNames[i], placeholder(i,color), color, colorShades(color,$steps,($scheme === 1) ? $factorLightness / 3 : $factorLightness, $factorSaturation), _cssVarPrefix, _varOptCSS, _varOptTailwind)}
<div>&rbrace;,</div>
{/each}
        </div>
      </div>
    </div>
    <div class="muted">&rbrace;,</div>
    {:else}
    <div class="muted">::root &lbrace;</div>
    <div id="all-vars-css" class="copyTarget">
      <div class="pl-3">
        {#each allColors as {color, name, shades}, i}
          {@html shadesAsCSS($colorNames[i], placeholder(i,color), color, 
            colorShades(color,$steps,($scheme === 1) ? $factorLightness / 3 : $factorLightness,$factorSaturation), _cssVarPrefix, _varOptCSS)}
        {/each}
      </div>
    </div>
    <div class="muted">&rbrace;</div>
    {/if}
  </div>
</div>

<style lang="postcss">
  h2 {
    @apply inline-block my-2 text-xl font-semibold sm:text-2xl;
  }
  button {
    @apply flex mr-4;
  }
  .heading {
    @apply flex;
  }
  .setting-control {
    @apply mt-2 w-w-full text-right flex-grow flex;
  }
  .vars {
    @apply font-mono text-xs;
  }
  .muted {
    @apply opacity-50 italic;
  }
</style>