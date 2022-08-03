<script>
import { adjustHue, darken, lighten } from 'color2k'
import { schemes, schemeColors } from '$lib'
import { primaryColor, scheme } from '$lib/stores'

$: _si = $scheme
$: _pc = $primaryColor
$: _sCs = schemeColors(schemes[_si],_pc) 
$: c0 = _si < 1 ? darken(_pc,0.3) : _si === 1 ? darken(_pc,0.36) :  _pc
$: c1 = _si < 1 ? lighten(_pc,0.3) : _si === 1 ? darken(_pc,0.025) : _sCs[1].color
$: c2 = _si === 1 ? lighten(_pc,0.025) : _si > 2 ? _sCs[2].color : 'transparent'
$: c3 = _si === 1 ? lighten(_pc,0.33): _si > 5 ? _sCs[3].color : 'transparent'

</script>

<div class="gradient-display scheme-{_si}"
style="
--c0: {c0};
--c1: {c1};
--c2: {c2};
--c3: {c3};
">

</div>
