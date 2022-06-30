<script>
  import { readableColor, toRgba, toHex, toHsla } from 'color2k'
  import { createEventDispatcher } from 'svelte';
  import { CopyIcon, Edit2Icon, XIcon } from 'svelte-feather-icons'
  export let color = 'black'

  const dispatch = createEventDispatcher()
    /**
   * @param {String} HTML representing a single element
   * @return {Element}
   */
  function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }


  function notice(text,addTo) {
    const note = htmlToElement(`<div class="absolute top-0 bottom-auto px-4 py-1 z-100 border-yellow-300 border-4 bg-yellow-200 text-dark-100 transition duration-50 duration-300 ease-out opacity-90 opacity-0">${text}</div>`)
    note.classList.remove('opacity-90','duration-300')
    addTo.prepend(note)
    setTimeout(function() {
      note.classList.remove('opacity-0')
    },50)
    setTimeout(function() {
      note.classList.remove('opacity-90','duration-50')
      note.classList.add('opacity-0','duration-300')
    },1000)
    setTimeout(function() {
      note.remove()
    },1500)
  }

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
    on:click={() => { hidden = false }}>
      &bullet;&hairsp;&bullet;&hairsp;&bullet;
    </button>
  </div>
  <div class="info hidden flex" class:hidden style="background-color: {color}; color: {readableColor(color)}">
    <button class="text-center block w-full px-1" on:click={() => { hidden=true }}><XIcon /></button>
    <div>
      <button class="text-center block w-full py-1" on:click={() => { hidden=true }}><XIcon /></button>
      <button class="btn-copy btn" on:click={copyClick}><CopyIcon class="mx-1 pointer-events-none" size="1x" /> {toHsla(color)}</button>
      <button class="btn-copy btn" on:click={copyClick}><CopyIcon class="mx-1 pointer-events-none" size="1x" /> {toRgba(color)}</button>
      <button class="btn-copy btn" on:click={copyClick}><CopyIcon class="mx-1 pointer-events-none" size="1x" /> {toHex(color)}</button>
      <button class="btn my-2" on:click={() => dispatch('updateColor',toHsla(color))}><Edit2Icon class="mx-1 pointer-events-none" size="1x" />Make Primary</button>
      <button class="text-center block w-full py-1" on:click={() => { hidden=true }}><XIcon /></button>
    </div>
    <button class="text-center block w-full px-1" on:click={() => { hidden=true }}><XIcon /></button>
  </div>
</div>

<style lang="postcss">
  .btn-copy {
    @apply whitespace-nowrap;
  }
  .info {
    @apply absolute p-2 border-2 z-10 transition duration-200 shadow-lg transform;
    .btn {
      @apply w-full;
    }
  }
  .swatch {
    @apply relative p-2 min-h-16 min-w-16 flex flex-grow flex-col items-center justify-center;
  }
</style>