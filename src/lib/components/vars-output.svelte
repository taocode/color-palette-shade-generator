<script>
  import { parseToHsla, readableColor, toHsla } from 'color2k'
  import { CopyIcon, PlusIcon } from 'svelte-feather-icons'

  import { colorShadesDefault, hueName, notice, shadesAsCSS, shadesAsTailwind, shadesAsTheme } from '$lib'
  import { optTailwind, optColorNotation, optSass, cssVarPrefix } from '$lib/stores'

  import SettingVarTailwind from './setting-var-tailwind.svelte'
  import SettingVarCss from './setting-var-css.svelte'
  // import SettingVarCssPrefix from './setting-var-css-prefix.svelte'

  export let type = 'CSS'
  export let name = ''
  export let placeholder = ''
  export let color = 'gray'
  export let shades = colorShadesDefault(color)

  $: _optColorNotation = $optColorNotation
  $: _optTailwind = $optTailwind
  $: _cssVarPrefix = $cssVarPrefix
  $: _optSass = $optSass
  $: isTheme = type === 'Theme'
  $: isTailwind = type === 'Tailwind'
  $: isCss = type === 'CSS'
  $: _scss = isCss && _optSass > 0 ? 'S' : ''
  $: headingLabel = isTheme ? 'Tailwind v4 Theme' : isTailwind ? 'Legacy Tailwind' : `${_scss}${type}`
  $: formatHint = isTheme ? 'oklch (Tailwind v4)' : isTailwind ? 'hex (Tailwind v3)' : ''

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
<div class="vars-output {type.toLocaleLowerCase()}">
  <div class="heading">
    <button title={`Copy ${headingLabel} vars`} on:click={copyClick} class="inline-block">
      <h2 class="mr-2">{headingLabel}</h2>
      <div class="pt-4">
        <CopyIcon size="1x" />
      </div>
    </button>
    <div class="setting-control">
      {#if isCss}
      <SettingVarCss fixedColor={color} />
      {:else if isTailwind}
      <SettingVarTailwind fixedColor={color} />
      {:else if formatHint}
      <span class="format-hint muted">{formatHint}</span>
      {/if}
    </div>
  </div>
  <div class="vars">
    {#if isTheme}
    <div class="muted">@theme &lbrace;</div>
    <div class="copyTarget">
      {@html shadesAsTheme( name, placeholder, color, shades )}
    </div>
    <div class="muted">&rbrace;</div>
    {:else if isTailwind}
    <div class="muted">colors: &lbrace;</div>
    <div class="copyTarget">
      <div class="pl-3">
        {name || placeholder}: &lbrace;
        {@html shadesAsTailwind( name, placeholder, color, shades )}
          &rbrace;,
      </div>
    </div>
    <div class="muted">&rbrace;,</div>
    {:else}
    <div class="muted">:root &lbrace;</div>
    <div class="copyTarget">
      {@html shadesAsCSS( name, placeholder, color, shades )}
    </div>
    <div class="muted">&rbrace;</div>
    {/if}
  </div>
</div>

<style lang="postcss">
  @reference "../../app.css";
  h2 {
    @apply inline-block my-2 text-xl font-semibold sm:text-2xl;
  }
  .vars {
    @apply font-mono text-xs;
  }
  .muted {
    @apply opacity-50 italic;
  }
  .format-hint {
    @apply mt-2 text-xs;
  }
</style>