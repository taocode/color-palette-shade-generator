import { adjustHue, darken, hsla, parseToHsla } from 'color2k'

import { steps, stepFactor } from '$lib/stores'
import { toHsla } from 'color2k'

let _steps
let _stepFactor

steps.subscribe(value => {
  _steps = value
})

stepFactor.subscribe(value => {
  _stepFactor = value
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
    console.log('schemeColors',{a})
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
      arr.unshift(darken(color,(i+1)/2*_stepFactor*-1))
    } else {
      arr.push(darken(color,i/2*_stepFactor))
    }
  }
  return arr
}