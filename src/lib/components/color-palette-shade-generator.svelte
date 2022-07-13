<script>
export const name = 'Color Palette Shade Generator'
export const size = '1.25em'
export let grid = true
export const fanciful = name
  .split(' ')
    .reduce(
        (p,c) => {
          const fl = c.substring(0,1)
          const r = c.substring(1)
          return `${p} <div class="max-w-min whitespace-nowrap mr-2"><span class="CPSG ${fl}" style="height: ${size}; width: ${size};">${fl}</span>${r}</div>`
        },''
      )
</script>

<div class="max-w-fit mx-auto">
  <div class="max-w-60 mx-auto flex-wrap justify-center sm:(inline-flex flex-nowrap max-w-none grid-cols-none)"
  class:grid={grid} class:grid-cols-2={grid} class:inline-flex={!grid} 
  >
    {@html fanciful}
  </div>
</div>

<style lang="postcss">
  .inflex {
    @apply inline-flex;
  }
</style>
