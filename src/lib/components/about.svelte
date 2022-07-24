<script>
import { describeScheme, schemes } from '$lib'
import { lightness, scheme } from '$lib/stores'
import ColorPaletteShadeGenerator from './color-palette-shade-generator.svelte'

</script>

<div class="prose mx-auto my-10 px-3 sm:px-0">
	<h2 class="flex align-bottom"><span class="">About</span> <ColorPaletteShadeGenerator size="1.5em" /></h2>
	<p>Use this color shade generating app to make multiple shades of colors for websites based on <a target="_blank" href="https://www.interaction-design.org/literature/topics/color-theory">color theory</a> where:</p>
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
	<h3>Features</h3>
	<ol>
		<li>HSLA based</li>
		<li>Variables that are copy+paste ready for CSS and Tailwind/WindiCSS</li>
		<li>Secondary colors for accents based on color theory</li>
	</ol>
	<h3>Why HSLA?</h3>
	<p>I believe that <strong>H</strong>ue <strong>S</strong>aturation <strong>L</strong>ightness is easier for a human to comprehend. RGBA and Hex outputs are also provided.</p>

</div>
