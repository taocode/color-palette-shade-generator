<script>
import { describeScheme, schemes, cssSchemes, describeCssScheme } from '$lib'
import { lightness, scheme } from '$lib/stores'
import ColorPaletteShadeGenerator from './color-palette-shade-generator.svelte'

</script>

<div class="prose mx-auto my-10 px-3 sm:px-0">
	<h2 class="flex align-bottom"><span class="">About</span> <ColorPaletteShadeGenerator size="1.5em" /></h2>
	<p>Use this color shade generating app to make multiple shades of colors and variables for websites (CSS, Tailwind/WindiCSS) based on <a target="_blank" href="https://www.interaction-design.org/literature/topics/color-theory">color theory</a>.</p>
	<h3>Features</h3>
	<ol>
		<li>HSLA based</li>
		<li>Produces your favorite color notations for web (CSS/Tailwind):
			 <ul>
				{#each cssSchemes as s, i}
				<li>{s.name || s.id} {describeCssScheme(s)}</li>
				{/each}
		</ul></li>
		<li>Custom variable names with sensible default colors and prefix</li>
		<li>Variables that are copy+paste ready for CSS (--var-name: color) and Tailwind/WindiCSS</li>
		<li>Secondary colors for accents based on color theory</li>
	</ol>
	<h2>Schemes:</h2>
	<ul class="list-disc">
		{#each schemes as s, i}
		<li>
			<span>
			<button class="font-bold" on:click={()=>scheme.set(i)}>{s.name}</button>
				<em>
					{#if s.hues}
					({1+s.hues.length} color{#if s.hues.length > 0}s{/if})
					{:else if s.lightnesses}
					({1+s.lightnesses.length} shade{#if s.lightnesses.length > 0}s{/if})
					{/if}
				</em>: {describeScheme(s)}
		</span>
		</li>
		{/each}
	</ul>
	<h3>Why HSLA?</h3>
	<p>I believe that <strong>H</strong>ue <strong>S</strong>aturation <strong>L</strong>ightness is easier for a human to comprehend. RGBA and Hex outputs are also provided.</p>

</div>
