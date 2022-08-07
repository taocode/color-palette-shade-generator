<script>
 
  import { schemes, schemeColors, getSchemeColorShade } from '$lib'
  import { primaryColor } from '$lib/stores'
 
  export let color = $primaryColor
  export let schemeIndex = 0
 
  const scheme = schemes[schemeIndex]
  const { hues, lightnesses } = scheme

  $: colors = schemeColors(scheme, color)
  $: _si = schemeIndex
  $: _pc = color
  $: _sCs = schemeColors(schemes[_si],_pc) 
  $: c0 = _pc
  $: c1 = getSchemeColorShade(_si,_pc,1,_sCs)
  $: c2 = getSchemeColorShade(_si,_pc,2,_sCs)
  $: c3 = getSchemeColorShade(_si,_pc,3,_sCs)

</script>

<span class="scheme-icon scheme-{_si}"
  style="
  --c0: {c0};
  --c1: {c1};
  --c2: {c2};
  --c3: {c3};"
><span class="hue-color"></span>{#if lightnesses}
{#each lightnesses as l, i}<span class="hue-color shade-{i}"></span>{/each}
{/if}{#if hues}
{#each hues as h, i}<span class="hue-color color-{i}"></span>{/each}
{/if}
</span>

<style global lang="postcss">
  .scheme-icon {
    @apply inline-flex h-6 w-7 xs:(h-7 w-8) align-bottom;
  }
  .hue-color {
    @apply w-full;
    background-color: var(--c0);
  }
  .shade-0,
  .color-0 {
    background-color: var(--c1);
  }
  .shade-1,
  .color-1 {
    background-color: var(--c2);
  }
  .color-2 {
    background-color: var(--c3);
  }
</style>