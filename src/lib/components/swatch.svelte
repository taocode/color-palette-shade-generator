<script>
  import { readableColor } from 'color2k'
  import { CopyIcon, KeyIcon } from 'svelte-feather-icons'
  export let color = 'black'
  let styl = ''
</script>
<div class="swatch" style="background-color: {color}; color: {readableColor(color)}">
  {color.split(',')[2]}
  <div class="info" style="background-color: {color}; color: {readableColor(color)}">
    <button class="hsla btn"><CopyIcon size="1x" /> {color}</button>
    <button class="btn"><KeyIcon size="1x" />Make Primary</button>
  </div>
</div>

<style lang="postcss">
  .hsla {
    @apply whitespace-nowrap;
  }
  .info {
    @apply absolute top-10 opacity-0 p-4 border-2 z-10 transition duration-200 shadow-lg;
    
  }
  .swatch {
    @apply relative p-2 min-h-16 min-w-1/11 flex flex-grow items-center justify-center;
    &:hover,
    &:focus-within {
      .info {
          @apply opacity-100;
        }
      }
  }
</style>