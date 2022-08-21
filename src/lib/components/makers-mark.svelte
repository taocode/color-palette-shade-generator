<script>
	import { darken } from 'color2k'
	import { hue, primaryColor } from '$lib/stores'

	$: lessDim = ($hue/360.0)*0.05
	$: console.log({lessDim})
	$: colorPrimary = darken($primaryColor,0.2-lessDim)
</script>
<div class="placer"
style="--color-primary: {colorPrimary}">
	<div class="maker">
		<span>Created by <a target="_blank" class="text-lime-700" href="https://www.taocode.com/">TAOCODE</a></span>.
		<span>Driven by curiosity. Powered by <a target="_blank" class="text-orange-700" href="https://svelte.dev/">Svelte</a></span>.
	</div>
</div>
<style lang="postcss">
	.maker {
		@apply max-w-prose mx-auto text-center bg-white/60 p-4 italic opacity-75 transition duration-200 ease-out hover:opacity-100
		rounded-tr rounded-tl;
		&:focus-within {
			@apply opacity-100;
		}
		a {
			@apply underline transition duration-200 ease-out;
			text-decoration-color: var(--color-primary);
			&:hover {
				color: var(--color-primary);
			}
		}
	}
	span {
		@apply whitespace-nowrap;
	}
	.placer {
		@apply absolute bottom-0 left-0 right-0;
	}
</style>