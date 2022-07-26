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


export const schemes = [
  {
    name: `Monochromatic`, 
    hues: [],
    varName: 'mono'
  }, {
    name: `Dark/Light`,
    lightnesses: [20,-20],
    names: ['light','dark'],
    varName: 'darklight'
  }, {
    name: `Complementary`,
    hues: [180],
    names: ['complementary'],
    varName: 'complementary'
  }, { 
    name: `Analogous`, 
    hues: [-30,30],
    varName: 'analogous'
  }, {
    name: `Split Complementary`,
    hues: [150,210],
    varName: 'split'
  }, {
    name: `Triadic`, 
    hues: [120,240],
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
    const name = (Array.isArray(names) && names.length > i) ? 'n_'+names[i] : ''
    return {
      color,
      name,
      description: `φ${plus}${hue}°`
    }
  })
  const lightShades = (! lightnesses) ? [] : lightnesses.map((lV,i,a)=>{
    const color = lighten(primary,lV*0.01)
    const plus = (lV > 0) ? '+' : ''
    const name = lV > 0 ? 'light' : 'dark'
    return {
      color,
      name,
      lightValue: lV,
      description: `φ${plus}${lV}%`
    }
  })
  const colors = hues ? hueShades : lightShades
  colors.unshift({
    color: primary,
    name: varName,
    description: 'φ'
  })
  return colors
}

export const dots = '<span class="tracking-widest">•••</span>'


export const cssVarNum = (n: number): string => (n<0) ? '' : (n) ? n+'00' : '50'

const cssColor = (color,optCSS) => {
  // console.log(`cssColor(${_varOptCSS},${color})`)
  if (optCSS === 'RGBA') {
    return toRgba(color)
  } else if (optCSS === '#HexA') {
    return toHex(color)
  } else if (optCSS === '#Hex') {
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

export const shadesAsCSS = (name,masterColor,shades,cssPrefix,vOptCSS) => {
  if (!name || name === '') name = hueName(parseToHsla(masterColor)[0])
  const cssPre = (cssPrefix && cssPrefix !== '') ? `${cssPrefix}-` : ''
  let varValue = cssColor(masterColor,vOptCSS)
  return shades.reduce((p,c,i) => {
      varValue = cssColor(c,vOptCSS)
      return `${p}\n<div class="pl-3">--${cssPre}${name}-${cssVarNum(i)}: ${varValue};</div>`
    },`<div class="pl-3">--${cssPre}${name}: ${varValue};</div>`)
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
export const shadesAsTailwind = (name,masterColor,shades,cssPrefix,vOptCSS,vOptTailwind) => {
  if (!name || name === '') name = hueName(parseToHsla(masterColor)[0])
  let varValue = tailwindColor(name,masterColor,cssPrefix,vOptCSS,vOptTailwind)
  return shades.reduce((p,c,i) => {
    varValue = tailwindColor(name,c,cssPrefix,vOptCSS,vOptTailwind,i)
    const varNum = i<1 ? '50' : `${i}00`
    return `${p}\n\t<div class="pl-3">'${varNum}': '${varValue}',</div>` 
  },`<div class="pl-3">DEFAULT: '${varValue}',</div>`)
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