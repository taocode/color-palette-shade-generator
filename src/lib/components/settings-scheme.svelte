<script>
  import { schemes, dots } from '$lib'
  import { primaryColor, scheme } from '$lib/stores'

  let _scheme = 1

  $: scheme.set(_scheme)
  $: _scheme = $scheme

</script>
<div class="settings scheme">
  <div class="">
    <div class="flex">
    <label for="scheme" class="m-2 px-2 max-w-min mx-auto">
      Scheme</label>
    <select 
      id="scheme"
      class="max-w-min" 
      style="background-color: {$primaryColor};"
      bind:value={_scheme}
      >
        {#each schemes as s, i}
          <option value={i}>
            {s.name}
          </option>
        {/each}
      </select>
  </div>
</div>
</div>

<style lang="postcss">

</style>