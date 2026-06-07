<script>
  import { parseToHsla, toHsla } from 'color2k'
  import { CopyIcon, PlusIcon } from 'svelte-feather-icons'

  import { colorShades, hueName, notice, placeholder, shadesAsCSS, shadesAsTailwind } from '$lib'
  import { colorNames, optColorNotation, optTailwind, optSass, cssVarPrefix, steps, factorLightness, factorSaturation, schemeIndex, schemeObj } from '$lib/stores'
  import SettingVarCssPrefix from './setting-var-css-prefix.svelte'
  import SettingVarCss from './setting-var-css.svelte'
  import SettingVarTailwind from './setting-var-tailwind.svelte'

  export let type = 'CSS'
  export let allColors = []
  $: color = allColors[0]?.color || 'hsla(0, 0%, 0%, 1)'
  $: hue = parseToHsla(color)[0].toFixed(1)
  $: hName = hueName(hue)
  $: isTheme = type === 'Theme'
  $: isTailwind = type === 'Tailwind'
  $: isCss = type === 'CSS'
  $: _scss = (isCss && $optSass > 0) ? 'S' : ''
  $: headingLabel = isTheme ? 'Tailwind v4 Theme' : `${_scss}${type}`

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
          document.documentElement.append(notice(`copied <span class="whitespace-nowrap">${heading}</span> vars`))
        }
      ).catch(
        function(err) {
          document.documentElement.append(notice(`failed to copy: ${err}`))
        }
      )
    }
  }
</script>
<div class="all-vars-output {type.toLocaleLowerCase()}">
  <div class="heading">
    <button title={`Copy ${headingLabel} vars`}  on:click={copyClick} class="flex-grow">
      <h2 class="mr-2">{headingLabel}</h2>
      <div class="pt-4">
        <CopyIcon size="1x" />
      </div>
    </button>
    <div class="setting-control">
      {#if isCss}
      <div>
        <SettingVarCssPrefix />
      </div>
      <div>
        <SettingVarCss />
      </div>
      {/if}
      {#if isTailwind}
      <SettingVarTailwind />
      {/if}
    </div>
  </div>
  <div class="vars-body">
    <div class="vars">
      {#if isTheme}
      <div class="muted">@theme &lbrace;</div>
      <div id="all-vars-theme" class="copyTarget">
        <slot/>
      </div>
      <div class="muted">&rbrace;</div>
      {:else if isTailwind}
      <div class="muted">colors: &lbrace;</div>
      <div id="all-vars-tailwind" class="copyTarget">
        <slot/>
      </div>
      <div class="muted">&rbrace;,</div>
      {:else}
      <div class="muted">:root &lbrace;</div>
      <div id="all-vars-css" class="copyTarget">
        <slot/>
      </div>
      <div class="muted">&rbrace;</div>
      {/if}
    </div>
    </div>
  </div>

<style lang="postcss">
  @reference "../../app.css";
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
    @apply mt-2 w-full text-right flex-grow flex;
  }
  .vars-body {
    @apply text-left;
  }
  .vars {
    @apply font-mono text-xs;
  }
  .muted {
    @apply opacity-50 italic;
  }
</style>