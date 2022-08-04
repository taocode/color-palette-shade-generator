<script>
  import { schemes, dots } from '$lib'
  import { primaryColor, scheme } from '$lib/stores'

	import SchemeIcon from './scheme-icon.svelte'

  let _scheme = $scheme

  $: scheme.set(_scheme)
  $: _scheme = $scheme

</script>
<div class="settings scheme">
  <div class="">
    <div class="flex flex-wrap gap-1 justify-center text-center xs:mx-3">
        {#each schemes as s, i}
          <button title={s.name}
					class="border-4"
					style="border-color: {i === $scheme ? '#FFFFFFBB' : '#555555AA'};"
					on:click={()=>scheme.set(i)}>
            <SchemeIcon scheme={schemes[i]} schemeIndex={i} color={$primaryColor} />
					</button>
        {/each}
			</div>
	</div>
</div>

<style lang="postcss">
</style>