<script>
export const name = 'Color Palette Shade Generator'
export const fanciful = name
  .split(' ')
    .reduce(
        (p,c) => {
          const fl = c.substring(0,1)
          const r = c.substring(1)
          return `${p} <span class="${fl}">_${fl}_</span>${r}`
        },''
      )
</script>

{@html fanciful}