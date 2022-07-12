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
      },
    }
  },
  plugins: [
    aspectRatio,
    typography
  ]
})