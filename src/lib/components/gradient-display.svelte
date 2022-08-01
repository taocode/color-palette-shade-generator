<script>
import { adjustHue, darken, lighten } from 'color2k'
import { schemes, schemeColors } from '$lib'
import { primaryColor, scheme } from '$lib/stores'

$: sColors = schemeColors(schemes[$scheme],$primaryColor) 
$: c0 = $scheme <= 1 ? darken($primaryColor,0.3) : $primaryColor
$: c1 = $scheme <= 1 ? lighten($primaryColor,0.3) : sColors[1].color
$: c2 = $scheme > 2 ? sColors[2].color : 'transparent'
$: c3 = $scheme > 5 ? sColors[3].color : 'transparent'
</script>

<div class="gradient-display scheme-{$scheme}"
style="
--c0: {c0};
--c1: {c1};
--c2: {c2};
--c3: {c3};
">

</div>

<style lang="postcss">
.gradient-display {
	@apply h-80 bg-gray-400;
}

</style>