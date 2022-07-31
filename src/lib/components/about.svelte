<script>
import { darken, lighten, adjustHue, toHex, readableColor } from 'color2k'
import { describeScheme, schemes, cssSchemes } from '$lib'
import { scheme, primaryColor, varOptCSS } from '$lib/stores'
import ColorPaletteShadeGenerator from './color-palette-shade-generator.svelte'
import CollapsibleSection from './collapsible-section.svelte'

let readable = readableColor('white')
</script>

<div class="prose mx-auto my-10 px-3 sm:px-0"
style="
--color-C: {darken($primaryColor,0.175)};
--color-P: {darken(adjustHue($primaryColor,90),0.175)};
--color-S: {lighten(adjustHue($primaryColor,180),0.12)};
--color-G: {lighten(adjustHue($primaryColor,270),0.12)};
--color-glow: {toHex(readable)+'66'};
">
	<h2 class="flex align-bottom"><span class="">About</span> <ColorPaletteShadeGenerator size="1.5em" /></h2>
	<p>Make multiple shades of colors with <span class="font-mono font-semibold">copy+paste code outputs</span> for websites including CSS and Tailwind variables with accent colors based on <a target="_blank" href="https://www.interaction-design.org/literature/topics/color-theory">color theory</a>.</p>

	<div class="sections">
		<CollapsibleSection heading="Features" level={3} collapsed>
			<ol>
				<li>HSLA based</li>
				<li>Variable outputs are easily copied via provided buttons
					<ul>
						<li>CSS variables: <code class="italic">--color-blue-500: hsla(240, 80%, 50%, 1)</code></li>
						<li>Tailwind/WindiCSS config (<code class="italic">tailwind.config.js</code>) variables including option to reference the CSS variables</li>
					</ul>
				</li>
				<li>Customizable options:
					<ul>
						<li>Variable name with sensible defaults based on hue</li>
						<li>Variable name prefix, <em>default:</em> <code class="italic"><span class="font-extralight">--</span>color<span class="font-extralight">-varname</span></code></li>
						<li><abbr title="Luminosity">%L</abbr> shift per step, <em>default:</em> <code class="italic">7.5%; dark/light: 1/3%L</code></li>
						<li><abbr title="Saturation">%S</abbr> shift per step, <em>default:</em> <code class="italic">0%</code></li>
						<li>Number of steps, <em>default:</em> <code class="italic">10</code></li>
					</ul>
				</li>
				<li>Secondary colors for accents based on color theory</li>
				<li>Produces your favorite color notations for web:
					 <ul>
						{#each cssSchemes as {id, name, description, sample}, i}
						<li><span class="name">{name || id}</span>: {description} - <em>{sample}</em></li>
						{/each}
				</ul>
			</li>
			</ol>
		</CollapsibleSection>
		<CollapsibleSection heading="Schemes" collapsed>
			<ul class="list-disc">
				{#each schemes as s, i}
				<li>
					<span>
					<span class="name">{s.name}</span>
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
		</CollapsibleSection>
		<CollapsibleSection heading="Why HSL?" collapsed>
			<p>I believe that <strong>H</strong>ue <strong>S</strong>aturation <strong>L</strong>ightness is easiest for a human to comprehend. RGB(A) and Hex outputs are also provided.</p>
		</CollapsibleSection>
	</div>

</div>
<style lang="postcss">
	.name {
		@apply font-semibold;
	}
	.sections {
		@apply align-middle;
	}
</style>