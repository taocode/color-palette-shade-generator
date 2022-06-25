<script>
  import Navbar from "$lib/components/layout/navbar.svelte"
  import Header from "$lib/components/layout/header.svelte"
  

  import 'virtual:windi.css'
  import '../app.css'

</script>

<Navbar />
<Header text="Color Palette Shade Generator" />

<div class="">
  <slot />
</div>

