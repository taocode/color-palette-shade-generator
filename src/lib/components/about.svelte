<script>
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

import { describeScheme, schemes } from "$lib/lib"
import ColorPaletteShadeGenerator from "./color-palette-shade-generator.svelte"

</script>

<div class="prose mx-auto my-10 px-3 sm:px-0">
	<h2 class="flex">About <ColorPaletteShadeGenerator /></h2>
	<p>Use this color shade generating app to make multiple shades of colors for websites based on <a target="_blank" href="https://www.interaction-design.org/literature/topics/color-theory">color theory</a> where:</p>
	<ul class="list-disc">
		{#each schemes as s, i}
		<li>
			<span>
			<button class="font-bold" on:click={()=>dispatch('updateScheme',i)}>{s.name}</button>
				<em>({1+s.hues.length} color{#if s.hues.length > 0}s{/if})</em>: {describeScheme(s)}
		</span>
		</li>
		{/each}
	</ul>
	<h3>Features</h3>
	<ol>
		<li>HSLA based</li>
		<li>Variables that are copy+paste ready for CSS and Tailwind/WindiCSS</li>
		<li>Secondary colors for accents based on color theory</li>
	</ol>
	<h3>Why HSLA?</h3>
	<p>I believe that <strong>H</strong>ue <strong>S</strong>aturation <strong>L</strong>ightness is easier for a human to comprehend. RGBA and Hex outputs are also provided.</p>

</div>