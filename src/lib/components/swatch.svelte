<script>
  import { readableColor, toRgba, toHex, toHsla } from 'color2k'
  import { CopyIcon, Edit2Icon, KeyIcon } from 'svelte-feather-icons'
  export let color = 'black'
  let styl = ''
</script>
<div class="swatch" style="background-color: {color}; color: {readableColor(color)}">
  {color.split(',')[2]}
  <div class="info" style="background-color: {color}; color: {readableColor(color)}">
    <button class="btn-copy btn"><CopyIcon class="mx-1" size="1x" /> {toHsla(color)}</button>
    <button class="btn-copy btn"><CopyIcon class="mx-1" size="1x" /> {toRgba(color)}</button>
    <button class="btn-copy btn"><CopyIcon class="mx-1" size="1x" /> {toHex(color)}</button>
    <button class="btn my-2"><Edit2Icon class="mx-1" size="1x" />Make Primary</button>
  </div>
</div>

<style lang="postcss">
  .btn-copy {
    @apply whitespace-nowrap;
  }
  .info {
    @apply absolute opacity-0 p-2 border-2 z-10 transition duration-200 shadow-lg;
    .btn {
      @apply w-full;
    }
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