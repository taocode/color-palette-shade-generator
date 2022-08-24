<script>
export const name = 'Color Palette Shade Generator'
export let size = '1.25em'
export const fanciful = name
  .split(' ')
    .reduce(
        (p,c) => {
          const fl = c.substring(0,1)
          const r = c.substring(1)
          return `${p} 
          <div class="max-w-min whitespace-nowrap sm:mx-1.5"><span class="CPSG ${fl}" 
            style="height: ${size}; width: ${size};">${fl}</span>${r}</div>`
        },''
      )
</script>

<div class="max-w-fit mx-auto">
  <div class="max-w-60 mx-auto grid grid-cols-2 gap-y-2
  sm:(inline-flex max-w-none)">
    {@html fanciful}
  </div>
</div>

