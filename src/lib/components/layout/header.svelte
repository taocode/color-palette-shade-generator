<script>
  export let text
  export let color1 = 'red-500'
  export let color2 = 'blue-500'
</script>

<div class="header">
  <h1>{text}</h1>
</div>

<style lang="postcss">
  .header {
    @apply flex w-full h-20 items-center;
    @apply text-white bg-gradient-to-r from-red-700 to-blue-800;
  }
  h1 {
    @apply text-center w-full text-3xl font-sans font-semibold;
  }
</style>