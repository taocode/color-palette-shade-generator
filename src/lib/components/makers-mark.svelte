<script>
	import { primaryColor } from '$lib/stores'
</script>
<div class="placer"
style="--color-primary: {$primaryColor}">
	<div class="maker">
		<span>Created by <a target="_blank" href="https://www.taocode.com/">TAOCODE</a></span>
		<span>Powered by curiosity and <a target="_blank" href="https://svelte.dev/">Svelte</a></span>
	</div>
</div>
<style lang="postcss">
	.maker {
		@apply max-w-prose mx-auto text-center bg-white/60 p-4 italic opacity-75 transition duration-200 ease-out hover:opacity-100;
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