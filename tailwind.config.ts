import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        aconchego: ['var(--font-aconchego)'],
        chaumont: ['var(--font-chaumont)'],
      },
      colors: {
        primary: '#06104A',
        secondary: '#FEFFF3',
        accent: '#BEF9DE',
      },
    },
  },
  plugins: [],
}

export default config 