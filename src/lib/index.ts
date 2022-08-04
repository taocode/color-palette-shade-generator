import { adjustHue, darken, lighten, parseToHsla, parseToRgba, saturate, toHex, toHsla, toRgba } from 'color2k'

import { steps, factorLightness, factorSaturation, hue, saturation, lightness, alpha, varOptCSS, varOptTailwind } from '$lib/stores'

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
  hue = (1*hue).toFixed()
  return hueNames.reduce((p,c,i) => {
    const pi = ((i>0) ? i : hueNames.length) - 1
    const [prev, ph] = Object.entries(hueNames[pi])[0]
    const [name, h] = Object.entries(c)[0]
    return (hue < h && hue >= ph) ? `${p}${prev}` : `${p}`
  },'')
}
export const cssSchemes = [
  {
    id: 'HSLA',
    description: 'Hue Saturation Lightness Alpha',
    sample: 'hsla(240, 75%, 50%, 0.9)',
  }, {
    id: 'RGBA',
    description: 'Red Green Blue Alpha',
    sample: 'rgba(32, 32, 223, 0.9)',
  }, {
    id: 'HexA',
    name: '#HexA',
    description: 'Hexadecimal with Alpha',
    sample: '#2020dfe6',
  }, {
    id: 'HSL',
    description: 'Hue Saturation Lightness',
    sample: 'hsl(240, 75%, 50%)',
  }, {
    id: 'RGB',
    description: 'Red Green Blue',
    sample: 'rgb(32, 32, 223)',
  }, {
    id: 'Hex',
    name: '#Hex',
    description: 'Hexadecimal',
    sample: '#2020df'
  }
]
export const updateHSLA = (color, fix=false) => {	
  let [h,s,l,a] = parseToHsla(color)
  if (fix) {
    h = h.toFixed(1)
    s = s.toFixed(3)
    l = l.toFixed(3)
    a = a.toFixed(2)
  }
  hue.set(h)
  saturation.set(s)
  lightness.set(l)
  alpha.set(a)
}
export const describeCssScheme = ({id,name,description}) => {
  return (name ? name : id) + (description ? ` - ${description}` : '')
}
export const describeScheme = ({hues, varName, names, lightnesses}) => {
  const primaryText = 'primary = φ'
  if (hues) {
    return hues.reduce((p,c,i) => {
      
      const shadeName = (names) ? names[i] : varName + (i+1)
      
      return `${p}, <span class="whitespace-nowrap">${shadeName} = φ${c>0?'+':''}${c.toFixed()}°</span>`
    }, primaryText)
  } else if (lightnesses) {
    return lightnesses.reduce((p,c,i) => {
      const shadeName = (names) ? names[i] : varName + (i+1)
      return `${p}, <span class="whitespace-nowrap">${shadeName} = φ${c>0?'+':''}${c.toFixed()}%L</span>`
    }, primaryText)
  }
  return primaryText
}

/*
$: c0 = _si < 1 ? darken(_pc,0.3) : _si === 1 ? darken(_pc,0.36) :  _pc
$: c1 = _si < 1 ? lighten(_pc,0.3) : _si === 1 ? darken(_pc,0.025) : _sCs[1].color
$: c2 = _si === 1 ? lighten(_pc,0.025) : _si > 2 ? _sCs[2].color : 'transparent'
$: c3 = _si === 1 ? lighten(_pc,0.33): _si > 5 ? _sCs[3].color : 'transparent'
*/
export const getSchemeColorShade = (si, primary, ci, schemeColors) => {
  switch (ci) {
    case 0: return primary
    case 1:
      switch (si) {
        case 0: return lighten(primary,0.3)
        case 1: return darken(primary,0.25)
        default: return schemeColors[1].color
      }
    case 2:
      switch (si) {
        case 1: return lighten(primary,0.3)
        default: return schemeColors[2]?.color || 'orange'
      }
    case 3:
      return schemeColors[3]?.color || 'yellow'
    default: return 'red'
  }
}
export const schemes = [
  {
    name: `Monochromatic`, 
    varName: 'mono'
  }, {
    name: `Dark/Light`,
    lightnesses: [-15,15],
    names: ['dark','light'],
    varName: 'darklight'
  }, {
    name: `Complementary`,
    hues: [180],
    names: ['complement'],
    varName: 'complementary'
  }, { 
    name: `Analogous`, 
    hues: [-30,30],
    varName: 'analogous'
  }, {
    name: `Split Complementary`,
    hues: [-150,150],
    varName: 'split'
  }, {
    name: `Triadic`, 
    hues: [-120,120],
    varName: 'triadic'
  }, {
    name: `Tetradic`,
    hues: [60,180,240],
    varName: 'tetradic'
  },
]

export const schemeColors = ({hues,lightnesses,varName,names},primary) => {
  const primaryH = parseToHsla(primary)[0].toFixed()
  const hueShades = (hues || []).map((hueShift,i,a) => {
    const color = adjustHue(primary,(hueShift < 0) ? 360+hueShift : hueShift)
    const plus = (hueShift > 0) ? '+' : ''
    // console.log('schemeColors',{a})
    const hue = parseToHsla(color)[0].toFixed()
    // console.log('isArray?',Array.isArray(names),names?.length)
    const name = (Array.isArray(names) && names.length > i) ? names[i] : ''
    return {
      color,
      name,
      description: `φ${plus}${hueShift}°`
    }
  })
  const lightShades = (lightnesses || []).map((lV,i,a)=>{
    const color = lighten(primary,lV*0.01)
    const plus = (lV > 0) ? '+' : ''
    const name = (Array.isArray(names) && names.length > i) ? names[i] : ''
    return {
      color,
      name,
      lightValue: lV,
      description: `φ${plus}${lV}%L`
    }
  })
  const colors = hues ? hueShades : lightShades
  colors.unshift({
    color: primary,
    description: 'φ'
  })
  return colors
}

export const dots = '<span class="tracking-widest">•••</span>'


export const cssVarNum = (n: number): string => (n<0) ? '' : (n) ? `${n}00` : '50'

const cssColor = (color,optCSS) => {
  // console.log(`cssColor(${_varOptCSS},${color})`)
  if (optCSS === 'RGBA') {
    return toRgba(color)
  } else if (optCSS === 'HexA') {
    return toHex(color)
  } else if (optCSS === 'Hex') {
    return toHex(color).substring(0,7)
  } else if (optCSS === 'HSL') {
    const hsl = parseToHsla(color)
    return `hsl(${hsl[0].toFixed()}, ${(100*hsl[1]).toFixed()}%, ${(100*hsl[2]).toFixed()}%)`
  } else if (optCSS === 'RGB') {
    const rgb = parseToRgba(color)
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  }
  return toHsla(color)
}

export const shadesAsCSS = (name,placeholder,masterColor,shades,cssPrefix,vOptCSS) => {
  if (!name || name === '') name = placeholder
  const cssPre = (cssPrefix && cssPrefix !== '') ? `${cssPrefix}-` : ''
  let varValue = cssColor(masterColor,vOptCSS)
  return shades.reduce((p,c,i) => {
      varValue = cssColor(c,vOptCSS)
      return `${p}\n<div class="pl-3">--${cssPre}${name}-${cssVarNum(i)}: ${varValue};</div>`
    },`\n<div class="pl-3">--${cssPre}${name}: ${varValue};</div>`)
}
const tailwindColor = (name, color, cssPrefix, vOptCSS, vOptTailwind, n = -1) => {
  const vn = n < 0 ? '' : '-' + cssVarNum(n)
  const cssPre = cssPrefix ? `${cssPrefix}-` : ''
  const varName = `--${cssPre}${name}${vn}`
  if (vOptTailwind === 'varonly')
    return `var(${varName})`
  else if (vOptTailwind === 'novar') 
    return `${cssColor(color,vOptCSS)}`
  return `var(${varName}, ${cssColor(color,vOptCSS)})`
}
export const shadesAsTailwind = (name,placeholder,masterColor,shades,cssPrefix,vOptCSS,vOptTailwind) => {
  if (!name || name === '') name = placeholder
  let varValue = tailwindColor(name,masterColor,cssPrefix,vOptCSS,vOptTailwind)
  return shades.reduce((p,c,i) => {
    varValue = tailwindColor(name,c,cssPrefix,vOptCSS,vOptTailwind,i)
    const varNum = i<1 ? '50' : `${i}00`
    return `${p}\n\t<div class="pl-3">'${varNum}': '${varValue}',</div>` 
  },`\n<div class="pl-3">\tDEFAULT: '${varValue}',</div>`)
}
export const colorShades = (color,steps,stepFactorLightness,stepFactorSaturation) => {
  let arr = [toHsla(color)]
  for (let i = 1; i < steps; i++) {
    if (i % 2) {
      const lighter = lighten(color,(i+1)/2*stepFactorLightness)
      arr.unshift(saturate(lighter,(i+1)/2*stepFactorSaturation))
    } else {
      const darker = darken(color,i/2*stepFactorLightness)
      arr.push(saturate(darker,i/2*stepFactorSaturation))
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