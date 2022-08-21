<script>
  import { schemes, dots } from '$lib'
  import { primaryColor, scheme } from '$lib/stores'

	import SchemeIcon from './scheme-icon.svelte'

  let _scheme = $scheme

  $: scheme.set(_scheme)
  $: _scheme = $scheme
  $: schemeName = schemes[_scheme].name

</script>
<div class="settings scheme">
  <div class="">
    <div class="flex flex-wrap gap-1 justify-center text-center xs:mx-3">
        {#each schemes as s, i}
          <button title={s.name}
					class="border-4"
					style="border-color: {i === _scheme ? '#FFFFFFCC' : '#33333399'};"
					on:click={()=>scheme.set(i)}>
            <SchemeIcon schemeIndex={i} color={$primaryColor} />
					</button>
        {/each}
			</div>
	</div>
</div>
<div class="scheme-name">{schemeName}</div>

<style lang="postcss">
.scheme-name {
  @apply max-w-max mx-auto py-1 px-3 mt-4 bg-white/70 text-black;
}
</style>