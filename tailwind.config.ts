import type { Config } from 'tailwindcss'

// For Tailwind v4, the config is much simpler. 
// The primary theme customizations are now located in `app/globals.css`.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config

