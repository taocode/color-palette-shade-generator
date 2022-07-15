<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  import { schemes, dots } from '$lib'

  export let scheme = 0
  export let color = 'black'

</script>
<div class="settings scheme">
  <div class="sm:flex">
    <div class="flex">
    <label class="m-2 px-2 max-w-min mx-auto">
      <span class="ml-r">Scheme</span>
      <select class="max-w-min" style="background-color: {color};"
      bind:value={scheme}
      on:change={() => dispatch('updateScheme',scheme)}
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