<script>
export const name = 'Color Palette Shade Generator'
export const fanciful = name
  .split(' ')
    .reduce(
        (p,c) => {
          const fl = c.substring(0,1)
          const r = c.substring(1)
          return `${p} <span class="inline-block py-1 px-3 aspect-square text-center align-baseline font-800 ${fl}">${fl}</span>${r}`
        },''
      )
</script>

{@html fanciful}
