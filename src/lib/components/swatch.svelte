<script>
  import { readableColor, toRgba, toHex, toHsla, parseToHsla } from 'color2k'
  import { createEventDispatcher } from 'svelte'
  import { CopyIcon, Edit2Icon } from 'svelte-feather-icons'
  import { clickOutside } from 'svelte-use-click-outside'

  import { hue, saturation, lightness, alpha, primaryColor, cssVarPrefix } from '$lib/stores'
  import { cssVarNum, dots, notice, updateHSLA } from '$lib'
  
  export let color = 'black'
  export let name = ''
  export let shadeIndex = -1

  const varNum = cssVarNum(shadeIndex)
  
  const dispatch = createEventDispatcher()

  function copyClick(event) {
    const text = event.srcElement.innerText.trim()
    const noteElement = event.srcElement.closest('.swatch')
    console.log({event,noteElement})
    if (!navigator.clipboard) {
      document.execCommand('copy',false,text)
    } else {
      navigator.clipboard.writeText(text).then(
        function() {
          notice(`copied: <span class="whitespace-nowrap">${text}</span>`,noteElement)
        }
      ).catch(
        function(err) {
          notice(`failed to copy: ${err}`,event.srcElement)
        }
      )
    }
  }
  let hidden = true
  $: variableName = '--' + ($cssVarPrefix ? `${$cssVarPrefix}-` : '') + `${name}-${varNum}`
</script>
<div class="swatch relative" style="background-color: {color}; color: {readableColor(color)}">
  <div>
    <button class="detail-trigger"
    on:click={() => { hidden = false }}
    tabindex={1}>
    <span>{varNum}</span>
    <span class="text-sm">{@html dots}</span>
  </button>
  </div>
  <div class="fixed hidden bg-dark-900 bg-opacity-80 inset-0 flex z-10" class:hidden>
      <div class="info"
      use:clickOutside={() => hidden = true}
      style="background-color: {color}; color: {readableColor(color)}"
      ><div class="variable-name">{variableName}</div>
        <button class="btn-copy btn" on:click={copyClick}><CopyIcon class="mt-1 mx-1 pointer-events-none" size="1x" /> {toHsla(color)}</button>
        <button class="btn-copy btn" on:click={copyClick}><CopyIcon class="mt-1 mx-1 pointer-events-none" size="1x" /> {toRgba(color)}</button>
        <button class="btn-copy btn" on:click={copyClick}><CopyIcon class="mt-1 mx-1 pointer-events-none" size="1x" /> {toHex(color)}</button>
        <button class="btn my-2 " on:click={() => {updateHSLA(color,true); hidden=true;}}><span class="text-lg inline-block -mt-1 mx-1">φ</span> Make Primary</button>
      </div>
    </div>
  </div>

<style lang="postcss">
  .btn {
      @apply tracking-tight flex;
  }
  .btn-copy {
    @apply whitespace-nowrap;
  }
  .info {
    @apply max-w-[30ch] inset-auto mx-auto my-auto p-2 border-2 z-10 transition duration-200 shadow-lg;
    .btn {
      @apply w-full;
    }
  }
  .detail-trigger {
    @apply absolute inset-0 border border-transparent leading-tight rounded p-4 hover:border-current
    w-full;
    >span {
      @apply flex flex-col ;
    }
  }
  .variable-name {
    @apply text-[1.1em] px-2 text-center mb-2 font-mono whitespace-nowrap;
  }
  .swatch {
    @apply w-full h-full flex flex-col items-center justify-center lg:min-h-20;
  }

</style>