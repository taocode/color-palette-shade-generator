<script>
	import ColorChoose from "$lib/components/color-choose.svelte"
	import { schemes } from '$lib/lib'
	export let color = `hsla(200, 80%, 50%, 1)`
</script>

<svelte:head>
	<title>Color Palette Shade Generato</title>
  <meta name="description" content="Generate a color palette using color theory with multiple shades for use with CSS, Tailwind">
</svelte:head>

<ColorChoose />

<div class="prose mx-auto my-10">
	<h2>About Color Palette Shade Generator</h2>
	<p>Use this color shade generating app to make multiple shades of colors based on <a target="_blank" href="https://www.interaction-design.org/literature/topics/color-theory">color theory</a> where:</p>
	<ul>
		{#each schemes as {name,colorCount,description}}
		<li><strong>{name}</strong> <em>({colorCount} color{#if colorCount != 1}s{/if})</em> - {description} </li>
		{/each}
	</ul>
	<h2>Features</h2>
	<ol>
		<li>HSLA based</li>
		<li>Variables that are copy+paste ready for CSS and Tailwind/WindiCSS</li>
		<li>Secondary colors for accents based on color theory</li>
	</ol>
	<h2>Why HSLA?</h2>
	<p>I believe that <strong>H</strong>ue <strong>S</strong>aturation <strong>L</strong>ightness is easier for a human to comprehend. RGBA and Hex outputs are also provided.</p>

</div>

