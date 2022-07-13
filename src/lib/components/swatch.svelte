<script>
  import { readableColor, toRgba, toHex, toHsla } from 'color2k'
  import { createEventDispatcher } from 'svelte'
  import { CopyIcon, Edit2Icon } from 'svelte-feather-icons'
  import { clickOutside } from 'svelte-use-click-outside'

  import { dots, notice } from '$lib/lib'
  
  export let color = 'black'
  
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
  
</script>
<div class="swatch" style="background-color: {color}; color: {readableColor(color)}">
  <div class="ml-2">{color.split(',')[2]}</div>
  <div>
    <button class="border border-transparent hover:border-current rounded px-1 text-xs"
    on:click={() => { hidden = false }}>{@html dots}</button>
  </div>
  <div class="fixed hidden bg-dark-900 bg-opacity-80 inset-0 flex z-10" class:hidden>
      <div class="info"
      use:clickOutside={() => hidden = true}
      style="background-color: {color}; color: {readableColor(color)}"
      >
        <button class="btn-copy btn" on:click={copyClick}><CopyIcon class="mx-1 pointer-events-none" size="1x" /> {toHsla(color)}</button>
        <button class="btn-copy btn" on:click={copyClick}><CopyIcon class="mx-1 pointer-events-none" size="1x" /> {toRgba(color)}</button>
        <button class="btn-copy btn" on:click={copyClick}><CopyIcon class="mx-1 pointer-events-none" size="1x" /> {toHex(color)}</button>
        <button class="btn my-2" on:click={() => {dispatch('updateColor',toHsla(color)); hidden=true;}}><Edit2Icon class="mx-1 pointer-events-none" size="1x" />Make Primary</button>
      </div>
    </div>
  </div>

<style lang="postcss">
  .btn {
      @apply tracking-tight;
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
  .swatch {
    @apply p-2 min-h-16 min-w-16 flex flex-grow flex-col items-center justify-center;
  }

</style>