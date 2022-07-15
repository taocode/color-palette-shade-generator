<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let steps = 9
  export let color = 'black'
  export let stepPercent = 8

  $: dispatch('updateSteps',steps)
  $: dispatch('updateStepPercent',stepPercent)
</script>
<div class="settings shades">
  <div class="sm:flex">
    <div class="flex">
      <label class="mx-2">
        <input id="steps"
        class="w-[2ch] mr-1"
        style="background-color: {color};"
        bind:value={steps}
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
        type="number"
        min={0}
        max={100}
        step={0.5}
        placeholder="">
          <span class="whitespace-nowrap">% Step</span>
      </label>
    </div>
  </div>
</div>

<style lang="postcss">
  label {
		@apply block flex items-center justify-end w-full text-[0.75em];
		input {
			@apply text-[2em];
		}
	}
  input {
		@apply text-right border-transparent leading-tight flex-shrink;
	}
</style>