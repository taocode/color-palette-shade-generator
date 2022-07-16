import { adjustHue, darken, hsla, parseToHsla, saturate } from 'color2k'

import { steps, factorLightness, factorSaturation } from '$lib/stores'
import { toHsla } from 'color2k'

let _steps
let _stepFactorLightness
let _stepFactorSaturation

steps.subscribe(value => {
  _steps = value
})

factorLightness.subscribe(value => {
  _stepFactorLightness = value
})

factorSaturation.subscribe(value => {
  _stepFactorSaturation = value
})

export const describeScheme = ({hues, varName}) => {
  return hues.reduce((p,c,i) => {
    return `${p}, ${varName}` + ((hues.length > 1) ? i+1 : '' ) + ` = φ+${c}°`
  }, 'primary = φ')
}

export const schemeColors = ({hues,varName},primary) => {
  const colors = hues.map((hue,i,a) => {
    const color = adjustHue(primary,(hue < 0) ? 360+hue : hue)
    const plus = (hue > 0) ? '+' : ''
    // console.log('schemeColors',{a})
    return {
      color,
      name: varName+((a.length > 1) ? (i+1): ''),
      hue: parseToHsla(color)[0].toFixed(),
      description: `φ${plus}${hue}°`,
      shades: shades(color)
    }
  })
  colors.unshift({
    color: primary,
    name: 'primary',
    hue: parseToHsla(primary)[0].toFixed(),
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
const shades = (color) => {
  let arr = [toHsla(color)]
  for (let i = 1; i < _steps; i++) {
    if (i % 2) {
      const lighter = darken(color,(i+1)/2*_stepFactorLightness*-1)
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