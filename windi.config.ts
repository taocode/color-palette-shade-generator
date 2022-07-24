import { defineConfig } from 'windicss/helpers'
import typography from 'windicss/plugin/typography'
import aspectRatio from 'windicss/plugin/aspect-ratio'


export default defineConfig({
  theme: {
    extend: {
      screens: {
        'xs': '400px'
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          '100': 'var(--color-primary-100)',
          '200': 'var(--color-primary-200)',
          '300': 'var(--color-primary-300)',
          '400': 'var(--color-primary-400)',
          '500': 'var(--color-primary-500)',
          '600': 'var(--color-primary-600)',
          '700': 'var(--color-primary-700)',
          '800': 'var(--color-primary-800)',
          '900': 'var(--color-primary-900)',
        },
        complementary: {
          DEFAULT: 'var(--color-complementary)',
          '100': 'var(--color-complementary-100)',
          '200': 'var(--color-complementary-200)',
          '300': 'var(--color-complementary-300)',
          '400': 'var(--color-complementary-400)',
          '500': 'var(--color-complementary-500)',
          '600': 'var(--color-complementary-600)',
          '700': 'var(--color-complementary-700)',
          '800': 'var(--color-complementary-800)',
          '900': 'var(--color-complementary-900)',
        },
        skyblue: {
          DEFAULT: 'var(--color-skyblue)',
          '50': 'var(--color-skyblue-50)',
          '100': 'var(--color-skyblue-100)',
          '200': 'var(--color-skyblue-200)',
          '300': 'var(--color-skyblue-300)',
          '400': 'var(--color-skyblue-400)',
          '500': 'var(--color-skyblue-500)',
          '600': 'var(--color-skyblue-600)',
          '700': 'var(--color-skyblue-700)',
          '800': 'var(--color-skyblue-800)',
          '900': 'var(--color-skyblue-900)',
          },
          blueviolet: {
          DEFAULT: 'var(--color-blueviolet)',
          '50': 'var(--color-blueviolet-50)',
          '100': 'var(--color-blueviolet-100)',
          '200': 'var(--color-blueviolet-200)',
          '300': 'var(--color-blueviolet-300)',
          '400': 'var(--color-blueviolet-400)',
          '500': 'var(--color-blueviolet-500)',
          '600': 'var(--color-blueviolet-600)',
          '700': 'var(--color-blueviolet-700)',
          '800': 'var(--color-blueviolet-800)',
          '900': 'var(--color-blueviolet-900)',
          },
          orange: {
          DEFAULT: 'var(--color-orange)',
          '50': 'var(--color-orange-50)',
          '100': 'var(--color-orange-100)',
          '200': 'var(--color-orange-200)',
          '300': 'var(--color-orange-300)',
          '400': 'var(--color-orange-400)',
          '500': 'var(--color-orange-500)',
          '600': 'var(--color-orange-600)',
          '700': 'var(--color-orange-700)',
          '800': 'var(--color-orange-800)',
          '900': 'var(--color-orange-900)',
          },
          yellowgreen: {
          DEFAULT: 'var(--color-yellowgreen)',
          '50': 'var(--color-yellowgreen-50)',
          '100': 'var(--color-yellowgreen-100)',
          '200': 'var(--color-yellowgreen-200)',
          '300': 'var(--color-yellowgreen-300)',
          '400': 'var(--color-yellowgreen-400)',
          '500': 'var(--color-yellowgreen-500)',
          '600': 'var(--color-yellowgreen-600)',
          '700': 'var(--color-yellowgreen-700)',
          '800': 'var(--color-yellowgreen-800)',
          '900': 'var(--color-yellowgreen-900)',
          },
      },
    }
  },
  plugins: [
    aspectRatio,
    typography
  ]
})