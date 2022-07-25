import { adjustHue, darken, lighten, parseToHsla, parseToRgba, saturate, toHex, toHsla, toRgba } from 'color2k'

import { steps, factorLightness, factorSaturation, hue, saturation, lightness, alpha, varOptCSS, varOptTailwind } from '$lib/stores'

let _steps
let _stepFactorLightness
let _stepFactorSaturation
let _varOptCSS
let _varOptTailwind

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

unsubs.push(varOptCSS.subscribe(value => {
  _varOptCSS = value
}))

unsubs.push(varOptTailwind.subscribe(value => {
  _varOptTailwind = value
}))

export const hueNames = [
  {red:0},
  {orangered:15},
  {orange:30},
  {goldenrod:45},
  {yellow:60},
  {yellowgreen:90},
  {green:120},
  {seagreen:145},
  {aquamarine:160},
  {aqua:180},
  {skyblue:195},
  {royalblue:225},
  {blue:240},
  {blueviolet:265},
  {purple:285},
  {magenta:300},
  {redviolet:330},
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

export const describeScheme = ({hues, varName, names, lightnesses}) => {
  if (hues) {
    return hues.reduce((p,c,i) => {
      
      const shadeName = (names) ? names[i] : varName + (i+1)
      
      return `${p}, ${shadeName} = φ${c>0?'+':''}${c.toFixed()}°`
    }, 'primary = φ')
  } else if (lightnesses) {
    return lightnesses?.reduce((p,c,i) => {
      const shadeName = (names) ? names[i] : varName + (i+1)
      return `${p}, ${shadeName} = φ${c>0?'+':''}${c.toFixed()}%`
    }, 'primary = φ')
  }
}

export const schemeColors = ({hues,lightnesses,varName},primary) => {
  const primaryH = parseToHsla(primary)[0].toFixed()
  const hueShades = (! hues) ? [] : hues.map((hue,i,a) => {
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
  const lightShades = (! lightnesses) ? [] : lightnesses.map((lV,i,a)=>{
    const color = lighten(primary,lV*0.01)
    const plus = (lV > 0) ? '+' : ''
    return {
      color,
      name: lV > 0 ? 'light' : 'dark',
      lightValue: lV,
      description: `φ${plus}${lV}%`,
      shades: shades(color)
    }
  })
  const colors = hues ? hueShades : lightShades
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
  { 
    name: `Monochromatic`, 
    hues: [],
    varName: 'mono'
  }, { 
    name: `Dark/Light`,
    lightnesses: [15,-15],
    names: ['light','dark'],
    varName: 'darklight'
  }, { 
    name: `Complementary`,
    hues: [180],
    names: ['complementary'],
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

export const cssVarNum = (i) => (i<0) ? '' : (i) ? i+'00' : '50'

const cssColor = (color) => {
  // console.log(`cssColor(${_varOptCSS},${color})`)
  if (_varOptCSS === 'RGBA') {
    return toRgba(color)
  } else if (_varOptCSS === '#HexA') {
    return toHex(color)
  } else if (_varOptCSS === '#Hex') {
    return toHex(color).substring(0,7)
  } else if (_varOptCSS === 'HSL') {
    const hsl = parseToHsla(color)
    return `hsl(${hsl[0].toFixed()}, ${(100*hsl[1]).toFixed()}%, ${(100*hsl[2]).toFixed()}%)`
  } else if (_varOptCSS === 'RGB') {
    const rgb = parseToRgba(color)
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  }
  return toHsla(color)
}

export const shadesAsCSS = (name,masterColor,shades,cssPrefix,varOpt) => {
  if (!name || name === '') name = hueName(parseToHsla(masterColor)[0])
  let varValue = cssColor(masterColor)
  return shades.reduce((p,c,i) => {
      varValue = cssColor(c)
      return `${p}\n<div class="pl-3">--${cssPrefix}-${name}-${cssVarNum(i)}: ${varValue};</div>`
    },`<div class="pl-3">--${cssPrefix ? cssPrefix+'-':''}${name}: ${varValue};</div>`)
}
const tailwindColor = (name, color, cssPrefix, n = -1) => {
  const vn = n < 0 ? '' : '-' + cssVarNum(n)
  const varName = `--${cssPrefix}-${name}${vn}`
  if (_varOptTailwind === 'varonly')
    return `var(${varName})`
  else if (_varOptTailwind === 'novar') 
    return `${cssColor(color)}`
  return `var(${varName}, ${cssColor(color)})`
}
export const shadesAsTailwind = (name,masterColor,shades,cssPrefix,vOptCSS,vOptTailwind) => {
  if (!name || name === '') name = hueName(parseToHsla(masterColor)[0])
  let varValue = tailwindColor(name,masterColor,cssPrefix)
  return shades.reduce((p,c,i) => {
    varValue = tailwindColor(name,c,cssPrefix,i)
    const varNum = `${i<1 ? 5 : i+'0'}0`
    return `${p}\n\t<div class="pl-3">'${varNum}': '${varValue}',</div>` 
  },`<div class="pl-3">DEFAULT: '${varValue}',</div>`)
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