import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spiritual: {
          purple: '#6b46c1',
          gold: '#d4af37',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;