<script>
  import { schemes, dots } from '$lib'
  import { scheme, primaryColor } from '$lib/stores'

  let _scheme = 1

  $: scheme.set(_scheme)
  $: _scheme = $scheme

</script>
<div class="settings scheme">
  <div class="">
    <div class="flex">
    <label class="m-2 px-2 max-w-min mx-auto">
      <span class="ml-r">Scheme</span>
      <select class="max-w-min" style="background-color: {$primaryColor};"
      bind:value={_scheme}
      >
        {#each schemes as s, i}
          <option value={i}>
            {s.name}
          </option>
        {/each}
      </select>
    </label>
  </div>
</div>
</div>

<style lang="postcss">
  label {
		@apply block flex items-center justify-end w-full text-[0.75em];
	}
  label select {
    @apply text-[1.5em] tracking-tighter;
  }
	select {
		@apply border-transparent leading-tight flex-shrink;
	}
	select option {
		@apply text-xs;
	}

</style>