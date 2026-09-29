/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        foreground: '#0f172a',
        sidebar: '#0f172a',
        sidebarForeground: '#f8fafc',
        primary: {
          DEFAULT: '#0d9488', // teal-600
          foreground: '#ffffff',
        },
        muted: '#94a3b8',
        accent: '#f1f5f9',
        border: '#e2e8f0',
        card: '#ffffff',
        cardForeground: '#0f172a',
        
        status: {
          stable: '#10b981', // emerald-500
          watch: '#f59e0b', // amber-500
          warning: '#f97316', // orange-500
          critical: '#ef4444', // red-500
          satellite: '#d946ef', // fuchsia-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [],
}
