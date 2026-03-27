import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fl: {
          base:   '#F5F0EB', // page background
          muted:  '#E8DED3', // secondary background
          text:   '#2C2420', // primary text
          subtle: '#8A7E74', // secondary text
          accent: '#C4928A', // accent / CTA
          dark:   '#3D3632', // dark anchor / footer
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      transitionDuration: {
        300: '300ms',
      },
    },
  },
  plugins: [],
}

export default config
