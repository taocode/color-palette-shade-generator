<script>
  import { fly } from 'svelte/transition'
  import { schemes, dots } from '$lib'
  import { primaryColor, schemeIndex } from '$lib/stores'

	import SchemeIcon from './scheme-icon.svelte'

  let _scheme = $schemeIndex

  $: schemeIndex.set(_scheme)
  $: _scheme = $schemeIndex

</script>
<div class="settings scheme">
  <div class="">
    <div class="flex flex-wrap gap-1 justify-center text-center xs:mx-3">
        {#each schemes as s, i}
          <button title={s.name}
					class="border-4"
					style="border-color: {i === _scheme ? '#FFFFFFCC' : '#33333399'};"
					on:click={()=>schemeIndex.set(i)}>
            <SchemeIcon schemeIndex={i} color={$primaryColor} />
					</button>
        {/each}
			</div>
	</div>
</div>
<div class="relative min-h-[3em] mb-4">
  {#each schemes as s,i}
  {#if i === _scheme}
  <div class="scheme-name" in:fly="{{y: -80, x: ((i-3)*40)}}" out:fly={{y: 40}}>{s.name}</div>
  {/if}
  {/each}
</div>
<style lang="postcss">
.scheme-name {
  @apply absolute inset-0 max-w-max mx-auto py-1 px-3 mt-4 bg-white/70 text-black;
}
</style>