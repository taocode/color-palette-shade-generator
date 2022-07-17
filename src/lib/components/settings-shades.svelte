<script>

  import { hsla } from 'color2k';
  import { primaryColor, steps, factorLightness, factorSaturation } from '$lib/stores'

  let _steps = $steps
  let lightnessPercent = $factorLightness * 100
  let saturationPercent = $factorSaturation * 100

  $: steps.set( _steps )
  $: factorLightness.set( lightnessPercent*0.01 )
  $: factorSaturation.set( saturationPercent*0.01 )
</script>
<div class="settings shades">
  <div class="sm:flex">
    <div class="flex">
      <label>
        <input id="step-percent"
        class="mr-1"
        style="background-color: {$primaryColor};"
        size={lightnessPercent.toString().length}
        bind:value={lightnessPercent}
        type="number"
        min={0}
        max={100}
        step={0.5}
        placeholder="">
          <span class="whitespace-nowrap">%L/Step</span>
      </label>
      <label>
        <input id="step-percent"
        class="mr-1"
        style="background-color: {$primaryColor};"
        size={saturationPercent.toString().length}
        bind:value={saturationPercent}
        type="number"
        min={-50}
        max={50}
        step={0.5}
        placeholder="">
          <span class="whitespace-nowrap">%S/Step</span>
      </label>

      <label class="mx-2">
        <input id="steps"
        class="max-w-min mr-1"
        style="background-color: {$primaryColor};"
        size={_steps.toString().length}
        bind:value={_steps}
        type="number"
        min={3}
        max={20}
        placeholder="steps">
        <span>Steps</span>
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