/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        background: '#f8fafc',
        surface: '#ffffff',
        border: '#e2e8f0',
        text: '#1e293b',
        'text-secondary': '#64748b',
      },
    },
  },
  plugins: [],
}
