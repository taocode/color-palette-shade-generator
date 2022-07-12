<script>
	import About from "$lib/components/about.svelte"
import ColorChoose from "$lib/components/color-choose.svelte"
	import { schemes, describeScheme } from '$lib/lib'
	export let scheme = 1

	function updateScheme(event) {
		scheme = parseInt(event.detail)
	}
</script>

<svelte:head>
	<title>Color Palette Shade Generato</title>
  <meta name="description" content="Generate a color palette using color theory with multiple shades for use with CSS, Tailwind">
</svelte:head>

<ColorChoose {scheme} on:updateScheme={updateScheme} />

<About on:updateScheme={updateScheme} />
