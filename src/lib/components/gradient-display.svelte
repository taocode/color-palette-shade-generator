<script>
import { adjustHue, darken, lighten } from 'color2k'
import { schemes, schemeColors, getSchemeColorShade } from '$lib'
import { primaryColor, scheme } from '$lib/stores'

$: _si = $scheme
$: _pc = $primaryColor
$: _sCs = schemeColors(schemes[_si],_pc) 
$: c0 = _pc
$: c1 = getSchemeColorShade(_si, _pc, 1, _sCs)
$: c2 = getSchemeColorShade(_si, _pc, 2, _sCs)
$: c3 = getSchemeColorShade(_si, _pc, 3, _sCs)
$: if (_si === 0) {
  c0 = darken(_pc,0.3)
  c1 = lighten(_pc,0.3)
} else if (_si === 1) {
  c0 = darken(_pc,0.075)
  c1 = darken(_pc,0.4)
  c2 = lighten(_pc,0.075)
  c3 = lighten(_pc,0.3)
}

</script>

<div class="gradient-display scheme-{_si}"
style="
--c0: {c0};
--c1: {c1};
--c2: {c2};
--c3: {c3};
">

</div>

<style global lang="postcss">
.gradient-display {
  @apply absolute bg-light-500 top-0 w-full h-full -z-1;
  min-height: 66vh;
}
.scheme-0 {
  background: linear-gradient(90deg, 
    var(--c0) 0%, 
    var(--c1) 100% );
}
.scheme-1 {
  background: linear-gradient(90deg, 
    var(--c1) 0%, 
    var(--c0) 49.9%, 
    var(--c2) 50.1%, 
    var(--c3) 100% );
}
.scheme-2 {
  background: linear-gradient(90deg, 
    var(--c0) 0%, var(--c0) 20%, 
    var(--c1) 80%, var(--c1) 100% );
}
.scheme-3 {
  background: linear-gradient(90deg, 
    var(--c1) 25%,
    var(--c0) 35%, var(--c0) 65%,
    var(--c2) 75% );
}
.scheme-4,
.scheme-5 {
  background: linear-gradient(90deg, 
    var(--c1) 20%, 
    var(--c0) 39%, var(--c0) 61%,
    var(--c2) 80% );
}
.scheme-6 {
  background: linear-gradient(90deg, 
  var(--c0) 15%, 
  var(--c1) 25%, var(--c1) 40%, 
  var(--c2) 60%, var(--c2) 75%, 
  var(--c3) 85% );
}
</style>