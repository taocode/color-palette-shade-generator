<script>
import { darken, lighten, adjustHue, toHex, readableColor } from 'color2k'
import { clickOutside } from 'svelte-use-click-outside'

import { Tabs, Tab, TabList, TabPanel } from '$lib/components/layout/tab'

import { describeScheme, schemes, cssSchemes } from '$lib'
import { scheme, primaryColor, varOptCSS } from '$lib/stores'
import ColorPaletteShadeGenerator from './color-palette-shade-generator.svelte'
import CollapsibleSection from './collapsible-section.svelte'

let readable = readableColor('white')
let hidePanels = false
</script>


<div class="max-w-prose bg-white/75 mx-auto px-3 pt-2 mt-16 mb-40"
on:click={() => hidePanels = false}
use:clickOutside={() => hidePanels = true}>
	<div class="flow-root prose mx-auto p-4 sm:px-0"
	style="
	--color-C: {darken($primaryColor,0.175)};
	--color-P: {darken(adjustHue($primaryColor,90),0.175)};
	--color-S: {lighten(adjustHue($primaryColor,180),0.12)};
	--color-G: {lighten(adjustHue($primaryColor,270),0.12)};
	--color-glow: {toHex(readable)+'66'};
	">
		<h2 class="flex align-bottom"><span class="">About</span> <ColorPaletteShadeGenerator size="1.5em" /></h2>
		<p>Make shades of colors with <strong>copy+paste <span class="font-mono">code</span> output</strong> for websites. Create accent colors based on color theory.</p>
	</div>
		<div class="tabs" class:hidePanels>
			<Tabs initialSelectedIndex={-1}>
				<TabList>
					<Tab>Features</Tab>
					<Tab>Schemes</Tab>
				</TabList>
				<div class="panels prose">
				<TabPanel>
						<div class="panel">
							<ol>
								<li>Variable outputs are easily copied via provided buttons
									<ul>
										<li>CSS variables: <code class="italic">--color-blue-500: hsla(240, 80%, 50%, 1)</code></li>
										<li>Tailwind/WindiCSS config (<code class="italic">tailwind.config.js</code>) variables with optional reference the CSS variables</li>
									</ul>
								</li>
								<li>Customizable options:
									<ul>
										<li>Variable name, <em>deafult:</em> name based on hue <code class="italic"><span class="font-extralight">--color-</span>varname</code></li>
										<li>Variable name prefix, <em>default:</em> <code class="italic"><span class="font-extralight">--</span>color<span class="font-extralight">-varname</span></code></li>
										<li><abbr title="Luminosity">%L</abbr> shift per step, <em>default:</em> <code class="italic">7.5%; dark/light: 1/3%L</code></li>
										<li><abbr title="Saturation">%S</abbr> shift per step, <em>default:</em> <code class="italic">0%</code></li>
										<li>Number of steps, <em>default:</em> <code class="italic">10</code></li>
									</ul>
								</li>
								<li>Secondary colors for accents based on color theory</li>
								<li>HSLA based, produces your favorite color notations for web:
									 <ul>
										{#each cssSchemes as {id, name, description, sample}, i}
										<li><span class="name">{name || id}</span>: {description} - <em class="whitespace-nowrap">{sample}</em></li>
										{/each}
								</ul>
							</li>
							</ol>
							<p class="text-center">Thanks to <a target="_blank" href="https://www.kevinpowell.co/">Kevin Powell</a> for explaining HSL so well: <a target="_blank" href="https://www.youtube.com/watch?v=Ab9pHqhsfcc">Are you using the WRONG color model in your CSS?</a></p>
						</div>
					</TabPanel>
					<TabPanel>
						<div class="panel">
							<ul class="list-disc">
								{#each schemes as s, i}
								<li>
									<button class="name"
									on:click={()=>scheme.set(i)}>{s.name}</button>
									<em>
									{#if s.hues}
									({1+s.hues.length} color{#if s.hues.length > 0}s{/if}){:else if s.lightnesses}
									({1+s.lightnesses.length} shade{#if s.lightnesses.length > 0}s{/if}){/if}</em>:
									{@html describeScheme(s)}
								</li>
								{/each}
							</ul>
							<p class="text-center">Learn more about <a target="_blank" href="https://www.interaction-design.org/literature/topics/color-theory">color theory</a>.</p>
						</div>
					</TabPanel>
				</div>
			</Tabs>
		</div>
</div>

<style lang="postcss">
	.name {
		@apply font-semibold;
	}
	.panels {
		@apply text-left;
	}
	.tabs {
		@apply max-w-prose mx-auto text-center pb-3;
	}
</style>
