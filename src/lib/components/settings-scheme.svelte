<script>
  import { schemes } from '$lib'
  import { primaryColor, schemeIndex } from '$lib/stores'

</script>
<div class="settings scheme">
  <div class="">
    <div class="flex flex-col justify-center text-center xs:mx-3">
    <select 
      id="scheme-chooser"
      class="no.max-w-40" 
      style="background-color: {$primaryColor};"
      bind:value={$schemeIndex}
      >
        {#each schemes as s, i}
          <option value={i}>
            {s.name}
          </option>
        {/each}
      </select>
    <label for="scheme-chooser" class="block my-2 px-2 w-full text-center">
      Scheme</label>
  </div>
</div>
</div>

<style lang="postcss">
</style>