import { defineConfig } from 'windicss/helpers'
import typography from 'windicss/plugin/typography'


export default defineConfig({
  theme: {
    extend: {
      screens: {
        'xs': '400px'
      }
    }
  },
  plugins: [
    typography
  ]
})