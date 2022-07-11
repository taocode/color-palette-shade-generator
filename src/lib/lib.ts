import { adjustHue, darken, hsla, parseToHsla } from 'color2k'

import { steps, stepFactor } from '$lib/stores'

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
    return `${p}, ${varName}${i+1} = φ+${c}°`
  }, 'primary = φ')
}

export const schemeColors = ({hues,varName},primary) => {
  const colors = hues.map((hue,i) => {return {name: varName+(i+1), shades: shades(adjustHue(primary,(hue < 0) ? 360+hue : hue))}})
  colors.unshift({name: 'primary', shades: shades(primary)})
  return colors
}

export const schemes = [
  { id: 0, 
    name: `Monochromatic`, 
    hues: [],
    varName: 'mono'
  }, { id: 1, 
    name: `Complementary`,
    hues: [180],
    varName: 'comp'
  }, { id: 2, 
    name: `Analogous`, 
    hues: [-30,30],
    varName: 'analog'
  }, { id: 3, 
    name: `Split Complementary`,
    hues: [150,210],
    varName: 'split'
  }, { id: 4, 
    name: `Triadic`, 
    hues: [120,240],
    varName: 'triad'
  }, { id: 5, 
    name: `Tetradic`,
    hues: [60,180,240],
    varName: 'tetra'
  },
]
const shades = (color) => {
  let arr = [color]
  for (let i = 1; i < _steps; i++) {
    if (i % 2) {
      arr.unshift(darken(color,(i+1)/2*_stepFactor*-1))
    } else {
      arr.push(darken(color,i/2*_stepFactor))
    }
  }
  return arr
}