import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bank: {
          50: '#f4f8ff',
          100: '#e8f0fe',
          500: '#1b5ef2',
          600: '#1348c7',
          700: '#123eaa',
          900: '#102a5e'
        },
        slate: {
          950: '#0b1220'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
