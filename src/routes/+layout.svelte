<script>
import { darken, lighten } from 'color2k'
import { schemeHues, styleColors } from '$lib'
import { hue, saturation, lightness, alpha, primaryColor, schemeIndex, schemeObj } from '$lib/stores'
import DevSizeIndicator from '$lib/components/layout/dev-size-indicator.svelte'
import 'virtual:windi.css'
import '../app.pcss'

let styleVars = ''
let styleHues = ''
$: {
  styleVars = `
  --scheme-index: ${$schemeIndex};
  --scheme-hue: ${$hue};
  --scheme-saturation: ${$saturation*100}%;
  --scheme-lightness: ${$lightness*100}%;
  --scheme-alpha: ${$alpha};
  --scheme-color: hsla(var(--scheme-hue), var(--scheme-saturation), var(--scheme-lightness), var(--scheme-alpha));`
  styleHues = schemeHues().reduce((p,c,i)=>`${p}\n--scheme-hue-${i}: ${c};`,'')
}
</script>
<DevSizeIndicator />

<div class="scheme-{$schemeIndex}" style={styleVars + styleHues + styleColors()}>
  <slot />
</div>

