import { adjustHue, darken, lighten, parseToHsla, saturate, toHsla } from 'color2k'


import { steps, factorLightness, factorSaturation, hue, saturation, lightness, alpha } from '$lib/stores'

let _steps
let _stepFactorLightness
let _stepFactorSaturation

export const unsubs = []

unsubs.push(steps.subscribe(value => {
  _steps = value
}))

unsubs.push(factorLightness.subscribe(value => {
  _stepFactorLightness = value
}))

unsubs.push(factorSaturation.subscribe(value => {
  _stepFactorSaturation = value
}))

export const hueNames = [
  {red:0},
  {orangered:16},
  {orange:30},
  {goldenrod:43},
  {gold:51},
  {yellow:60},
  {yellowgreen:85},
  {green:120},
  {seagreen:147},
  {aquamarine:160},
  {aqua:180},
  {skyblue:195},
  {cornflowerblue:219},
  {royalblue:225},
  {blue:240},
  {blueviolet:265},
  {purple:285},
  {magenta:300},
  {mediumvioletred:322},
  {violetred:340},
  {red:360}
]
export const hueName = (hue) => {
  return hueNames.reduce((p,c,i) => {
    const pi = ((i>0) ? i : hueNames.length) - 1
    const [prev, ph] = Object.entries(hueNames[pi])[0]
    const [name, h] = Object.entries(c)[0]
    return (hue < h && hue >= ph) ? `${p}${prev}` : `${p}`
  },'')
}

export const updateHSLA = (color, fix=false) => {	
  let [h,s,l,a] = parseToHsla(color)
  if (fix) {
    h = h.toFixed()
    s = s.toFixed(3)
    l = l.toFixed(3)
    a = a.toFixed(2)
  }
  hue.set(h)
  saturation.set(s)
  lightness.set(l)
  alpha.set(a)
}

export const describeScheme = ({hues, varName}) => {
  return hues.reduce((p,c,i) => {
    return `${p}, ${varName}` + ((hues.length > 1) ? i+1 : '' ) + ` = φ+${c.toFixed()}°`
  }, 'primary = φ')
}

export const schemeColors = ({hues,varName},primary) => {
  const primaryH = parseToHsla(primary)[0].toFixed()
  const colors = hues.map((hue,i,a) => {
    const color = adjustHue(primary,(hue < 0) ? 360+hue : hue)
    const plus = (hue > 0) ? '+' : ''
    // console.log('schemeColors',{a})
    const h = parseToHsla(color)[0].toFixed()
    return {
      color,
      name: hueName(h),
      hue: h,
      description: `φ${plus}${hue}°`,
      shades: shades(color)
    }
  })
  colors.unshift({
    color: primary,
    name: hueName(primaryH),
    hue: primaryH,
    description: 'φ', 
    shades: shades(primary)
  })
  return colors
}

export const dots = '<span class="tracking-widest">•••</span>'

export const schemes = [
  { id: 0, 
    name: `Monochromatic`, 
    hues: [],
    varName: 'mono'
  }, { id: 1, 
    name: `Complementary`,
    hues: [180],
    varName: 'complementary'
  }, { id: 2, 
    name: `Analogous`, 
    hues: [-30,30],
    varName: 'analogous'
  }, { id: 3, 
    name: `Split Complementary`,
    hues: [150,210],
    varName: 'split'
  }, { id: 4, 
    name: `Triadic`, 
    hues: [120,240],
    varName: 'triadic'
  }, { id: 5, 
    name: `Tetradic`,
    hues: [60,180,240],
    varName: 'tetradic'
  },
]

export const shadesAsCSS = (name,masterColor,shades) => {
  if (!name || name === '') name = hueName(parseToHsla(masterColor)[0])
  return shades.reduce((p,c,i) => {
    return `${p}<div class="pl-3">--color-${name}-${i+1}00: ${c};</div>\n`
  },`<div class="pl-3">--color-${name}: ${masterColor};</div>`)
}
export const shadesAsTailwindAndCSS = (name,masterColor,shades,includeDefault) => {
  if (!name || name === '') name = hueName(parseToHsla(masterColor)[0])
  return shades.reduce((p,c,i) => {
    return `${p}<div class="pl-3">'${i+1}00': 'var(--color-${name}-${i+1}00${!includeDefault ? '': ', '+c})',</div>\n`
  },`<div class="pl-3">DEFAULT: 'var(--color-${name}${!includeDefault ? '' : ', ' + toHsla(masterColor)})',</div>`)
}
export const shadesAsTailwind = (name,masterColor,shades) => {
  if (!name || name === '') name = hueName(parseToHsla(masterColor)[0])
  return shades.reduce((p,c,i) => {
    return `${p}<div class="pl-3">'${i+1}00': '${c}',</div>\n`
  },`<div class="pl-3">DEFAULT: '${masterColor}',</div>`)
}
const shades = (color) => {
  let arr = [toHsla(color)]
  for (let i = 1; i < _steps; i++) {
    if (i % 2) {
      const lighter = lighten(color,(i+1)/2*_stepFactorLightness)
      arr.unshift(saturate(lighter,(i+1)/2*_stepFactorSaturation))
    } else {
      const darker = darken(color,i/2*_stepFactorLightness)
      arr.push(saturate(darker,i/2*_stepFactorSaturation))
    }
  }
  return arr
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
export const htmlToElement = (html) => {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

export const notice = (text,addTo) => {
  const note = htmlToElement(`<div class="absolute top-0 bottom-auto px-4 py-1 z-100 border-yellow-300 border-4 bg-yellow-200 text-dark-100 transition duration-50 duration-300 ease-out opacity-90 opacity-0">${text}</div>`)
  note.classList.remove('opacity-90','duration-300')
  addTo.prepend(note)
  setTimeout(function() {
    note.classList.remove('opacity-0')
  },50)
  setTimeout(function() {
    note.classList.remove('opacity-90','duration-50')
    note.classList.add('opacity-0','duration-300')
  },1000)
  setTimeout(function() {
    note.remove()
  },1500)
}