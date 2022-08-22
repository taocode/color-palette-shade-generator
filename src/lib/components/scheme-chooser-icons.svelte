<script>
  import { fly } from 'svelte/transition'
  import { quadIn, quartOut } from 'svelte/easing'
  import { schemes } from '$lib'
  import { primaryColor, schemeIndex } from '$lib/stores'

	import SchemeIcon from './scheme-icon.svelte'

</script>
<div class="settings scheme">
  <div class="">
    <div class="flex flex-wrap gap-1 justify-center text-center xs:mx-3">
        {#each schemes as s, i}
          <button title={s.name}
					class="border-4"
					style="border-color: {i === $schemeIndex ? '#FFFFFFCC' : '#33333399'};"
					on:click={()=>schemeIndex.set(i)}>
            <SchemeIcon schemeIndex={i} color={$primaryColor} />
					</button>
        {/each}
			</div>
	</div>
</div>
<div class="relative min-h-[3em] mb-4">
  {#each schemes as s,i}
  {#if i === $schemeIndex}
  <div class="scheme-name" 
    in:fly="{{y: -80, x: ((i-3)*40), duration: 600, easing: quartOut}}" 
    out:fly={{y: 80, easing: quadIn}} >{s.name}</div>
  {/if}
  {/each}
</div>
<style lang="postcss">
.scheme-name {
  @apply absolute inset-0 max-w-max mx-auto py-1 px-3 mt-4 bg-white/70 text-black;
}
</style>