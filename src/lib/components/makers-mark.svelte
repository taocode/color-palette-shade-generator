<script>
	import { primaryColor } from '$lib/stores'
</script>
<div class="placer"
style="--color-primary: {$primaryColor}">
	<div class="maker">
		Created by <a target="_blank" href="https://www.taocode.com/">TAOCODE</a>; powered by curiosity and <a target="_blank" href="https://svelte.dev/">Svelte</a>.
	</div>
</div>
<style lang="postcss">
	.maker {
		@apply max-w-prose mx-auto text-center bg-white/60 p-4 italic opacity-60 transition duration-200 ease-out hover:opacity-100;
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
	.placer {
		@apply absolute bottom-0 left-0 right-0;
	}
</style>