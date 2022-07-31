<script>
  import { PlusSquareIcon, MinusSquareIcon } from 'svelte-feather-icons'
  export let heading = ""
  export let collapsed = false
</script>

<h3>
  {heading}
  <button class="collapsetoggle"
  on:click={()=>collapsed = ! collapsed}>
    {#if collapsed}
    <PlusSquareIcon />
    {:else}
    <MinusSquareIcon />
    {/if}
  </button>
</h3>

{#if ! collapsed}
<slot />
{/if}
