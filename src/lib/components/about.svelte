<script>
import { darken, adjustHue, opacify } from 'color2k'
import { clickOutside } from 'svelte-use-click-outside'

import { Tabs, Tab, TabList, TabPanel } from '$lib/components/layout/tab'

import { describeScheme, schemes, cssSchemes } from '$lib'
import { schemeIndex, primaryColor } from '$lib/stores'
import SchemeIcon from './scheme-icon.svelte'

let hidePanels = true
</script>


<div class="max-w-prose bg-white/75 mx-auto px-3 pt-2 mt-16 mb-60"
on:click={() => hidePanels = false}
use:clickOutside={() => hidePanels = true}
style="
--color-primary: {$primaryColor};
--color-bullet: {darken($primaryColor,0.1)};
--color-link: {darken(adjustHue($primaryColor,180),0.15)};
"
>
	<div class="flow-root prose mx-auto p-4 sm:px-0">
		<p class="text-center">Make shades of colors with <strong>copy+paste <span class="font-mono">code</span> output</strong> for websites. Explore accent colors based on color theory.</p>
	</div>
		<div class="tabs" class:hidePanels>
			<Tabs initialSelectedIndex={-1}>
				<div class="tablist">
					<TabList>
						<Tab>Features</Tab>
						<Tab>Schemes</Tab>
						<Tab>Why?</Tab>
					</TabList>
				</div>
				<div class="panels">
				<TabPanel>
						<div class="panel prose">
							<ol class="vars">
								<li>Variable outputs are easily copied via provided buttons
									<ul>
										<li>CSS variables: <code>--color-blue-500: hsla(240, 80%, 50%, 1);</code></li>
										<li>SASS/SCSS variables: <code>$color-blue-500: hsl(240, 80%, 50%);</code></li>
										<li>Tailwind/WindiCSS config (<code>tailwind.config.js</code>) variables with optional reference the CSS variables</li>
									</ul>
								</li>
								<li>Customizable options:
									<ul>
										<li>Variable name, <em>default:</em> name based on hue <code><span class="font-extralight">--color-</span>varname</code>
										<div class="italic text-md"><strong>Show Shades</strong> to set custom varname</div></li>
										<li>Variable name prefix, <em>default:</em> <code><span class="font-extralight">--</span>color<span class="font-extralight">-varname</span></code></li>
										<li><abbr title="Luminosity">%L</abbr> shift per step, <em>default:</em> <code>7.5%</code>; <em>dark/light:</em> <code>%L/3</code> <em class="font-mono text-sm">(7.5%/3=2.5%)</em></li>
										<li><abbr title="Saturation">%S</abbr> shift per step, <em>default:</em> <code>0%</code></li>
										<li>Number of steps, <em>default:</em> <code class="italic">10</code></li>
										<li>Sass/SCSS style variables, <em>default:</em> <code class="italic">0</code></li>
									</ul>
								</li>
								<li>Chosen color, scheme and customized options are stored in the query string <em class="font-mono tracking-tighter">(url.searchParams)</em> for a sharable link.
									<ul class="params">
										<li><span class="qp">H</span>=Hue</li>
										<li><span class="qp">S</span>=Saturation</li>
										<li><span class="qp">L</span>=Lightness</li>
										<li><span class="qp">A</span>=Alpha</li>
										<li><span class="qp">scheme</span>=scheme index</li>
										<li><span class="qp">steps</span>=number of steps</li>
										<li><span class="qp">pL</span>=%L per step</li>
										<li><span class="qp">pS</span>=%S per step</li>
										<li><span class="qp">pre</span>=variable prefix</li>
										<li><span class="qp">cn</span>=color notation</li>
										<li><span class="qp">tw</span>=tailwind variable option</li>
										<li><span class="qp">sass</span>=SCSS/SASS variable option</li>
										<li><span class="qp">c[0-3]</span>=custom color names</li>
									</ul>
								</li>
								<li>HSLA based, produces your chosen color notations for web:
									 <ul>
										{#each cssSchemes as {id, name, description, sample}, i}
										<li><span class="name">{name || id}</span>: <span>{description}</span> - <em class="whitespace-nowrap text-[0.85em] font-mono">{sample}</em></li>
										{/each}
								</ul>
							</li>
							</ol>
							
						</div>
					</TabPanel>
					<TabPanel>
						<div class="panel">
							<ul class="schemes">
								{#each schemes as s, i}
								<li>
									<SchemeIcon schemeIndex={i} color={$primaryColor} />
									<button class="name"
									on:click={()=>schemeIndex.set(i)}>{s.name}</button>
									<em>
									{#if s.hues}
									({1+(s.hues.length)} color{#if s.hues.length > 0}s{/if}){:else if s.lightnesses}
									({1+s.lightnesses.length} shade{#if s.lightnesses.length > 0}s{/if}){/if}</em>:
									{@html describeScheme(s)}
								</li>
								{/each}
							</ul>
							<div class="prose">
								<p class="text-center">Learn more about <a target="_blank" href="https://www.interaction-design.org/literature/topics/color-theory">color theory</a>.</p>
							</div>
						</div>
					</TabPanel>
					<TabPanel>
						<div class="panel">
							<div class="prose">
								<p>I wanted:</p>
								<ul class="pb-3">
									<li>a tool to help identify harmonious accent colors based on a single color.</li>
									<li>multi-shade variables ready for virtually any CSS powered platform.</li>
									<li>HSL notation variables; although there are many color palette generators, <em>most are primarily hexadecimal color notation.</em></li>
									<li>automated tailwind.config.js formatted variables for custom color shades.</li>
									<li>to deepen my understanding and competency with Svelte and SvelteKit. I ended up deepening my appreciation. <em>It's so fast!</em> The latest updates to SvelteKit are smart and elegant, like Svelte.</li>
								</ul>
								<p>If you find this tool useful, helpful or whatnot, please pass it on and use it as you wish. It's a nerd's tool for those brave enough to <abbr title="(battle)">learn</abbr> <abbr title="(into submission)">CSS</abbr>.</p>
								<p class="text-center">Feedback welcome; check out <a href="https://github.com/taocode/color-palette-shade-generator">this project's github</a> to report a bug or suggest a feature.</p>
								<div class="thanks-kp">Thanks to <a target="_blank" href="https://www.kevinpowell.co/">Kevin Powell</a> for explaining HSL: 
									<div><a target="_blank" href="https://www.youtube.com/watch?v=Ab9pHqhsfcc"><span>Are you using the WRONG</span> color model in your CSS?</a></div>
								</div>
							</div>
						</div>
					</TabPanel>
				</div>
			</Tabs>
		</div>
</div>

<style lang="postcss">
	p {
		@apply text-lg;
	}
	.name {
		@apply font-semibold;
	}
	.panels {
		@apply text-left;
	}
	.tabs {
		@apply max-w-prose mx-auto text-center pb-6;
	}
	.panel {
		@apply max-w-prose mx-auto;
	}
	.panel .schemes {
		@apply px-2;
		li {
			@apply mt-3 mb-6;
			text-indent: -2.4em;
			margin-left: 3rem;
		}
	}
	.params {
		@apply flex flex-wrap list-none list-outside gap-x-2 leading-tight;
		li {
			@apply pl-0 mr-4 whitespace-nowrap;
			&::before {
				display: none;
			}
		}
		li {
			@apply list-none;
		}
		.qp {
			@apply font-bold;
		}
	}
	.vars code {
		@apply italic xs:whitespace-nowrap;
	}
	.tablist {
		@apply mt-3 mb-6;
	}
	.thanks-kp {
		@apply text-center py-6 text-[1rem] leading-[2];
		span {
			@apply xs:whitespace-nowrap;
		}
	}
</style>
