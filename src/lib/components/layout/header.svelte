<script>
  export let text;
</script>

<div class="header">
  <h1>{text}</h1>
</div>

<style lang="postcss">
  .header {
    height: 150px;
    @apply flex w-full items-center bg-gradient-45;
  }
  .header > h1 {
    @apply text-center w-full text-5xl font-sans font-semibold;
  }
</style>