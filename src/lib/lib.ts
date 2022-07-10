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

export const schemes = [
  { id: 0, 
    name: `Monochromatic`, 
    description: 'a single color in multiple shades',
    colorCount: 1,
    f: (color) => {
      return [{
        name: 'primary',
        shades: shades(color)
      }]
    } },
  { id: 1, 
    name: `Complementary`,
    description: 'complementary: +180°',
    colorCount: 2,
    f: (color) => {
    return [{
      name: 'primary',
      shades: shades(color)
    },{
      name: 'complementary',
      shades: shades(adjustHue(color,180))
    }]
  } },
  { id: 2, 
    name: `Analogous`, 
    description: 'analogous1: -30°, analogus2: +30°',
    colorCount: 3,
    f: (color) => {
    return [{
      name: 'primary',
      shades: shades(color)
    }, {
      name: 'analogous1',
      shades: shades(adjustHue(color,330))
    }, {
      name: 'analogous2',
      shades: shades(adjustHue(color,30))
    }]
  } },
  { id: 3, 
    name: `Split Complementary`,
    description: "split1: +150°, split2: +210°",
    colorCount: 3,
    f: (color) => {
    return [{
      name: 'primary',
      shades: shades(color)
    }, {
      name: 'split1',
      shades: shades(adjustHue(color,150))
    }, {
      name: 'split2',
      shades: shades(adjustHue(color,210))
    }]
  } },
  { id: 4, 
    name: `Triadic`, 
    description: "triad1: +120°, traid2: +240°",
    colorCount: 3,
    f: (color) => {
    return [{
      name: 'primary',
      shades: shades(color)
    }, {
      name: 'triad1',
      shades: shades(adjustHue(color,120))
    }, {
      name: 'triad2',
      shades: shades(adjustHue(color,240))
    }]
  } },
  { id: 5, 
    description: "tetra1: +60°, tetra2: +180°, tetra3: +240°",
    colorCount: 4,
    name: `Tetradic`, 
    f: () => {
    return [{
      name: 'primary',
      shades: shades(color)
    }, {
      name: 'tetra1',
      shades: shades(adjustHue(color,60))
    }, {
      name: 'tetra2',
      shades: shades(adjustHue(color,180))
    }, {
      name: 'tetra3',
      shades: shades(adjustHue(color,240))
    }]
  } },
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