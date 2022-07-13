<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  import { schemes, dots } from '$lib/lib'

  export let scheme = 0
  export let steps = 9
  export let color = 'black'
  export let stepPercent = 8

</script>
<div class="shade-settings">
  <div class="sm:flex">
    <div class="flex">
      <label class="mx-2">
        <input id="steps"
        class="w-[2ch] mr-1"
        style="background-color: {color};"
        bind:value={steps}
        on:change={() => dispatch('updateSteps',steps)}
        type="number"
        min={3}
        max={20}
        placeholder="steps">
        <span>Steps</span>
      </label>
      <label>
        <input id="step-percent"
        class="w-[3ch] mr-1"
        style="background-color: {color};"
        bind:value={stepPercent}
        on:change={() => dispatch('updateStepPercent',stepPercent)}
        type="number"
        min={0}
        max={100}
        step={0.5}
        placeholder="">
          <span class="whitespace-nowrap">% Step</span>
      </label>
    </div>
    <label class="m-2 px-2 max-w-min mx-auto">
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
      <span class="ml-1">Scheme</span>
    </label>
  </div>
</div>

<style lang="postcss">
  .shade-settings {
    @apply max-w-prose mx-auto;
  }
  label {
		@apply block flex items-center justify-end w-full text-[0.75em];
		input {
			@apply text-[2em];
		}
		select {
			@apply text-[1.5em] tracking-tighter;
		}
	}
  input,
	select {
		@apply text-right border-transparent leading-tight flex-shrink;
	}
	select option {
		@apply text-xs;
	}

</style>