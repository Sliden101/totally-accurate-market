/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        secondary: '#0891B2',
        accent: '#F59E0B',
        background: '#0F172A',
        surface: '#1E293B',
        'surface-alt': '#334155',
        text: '#F1F5F9',
        'text-muted': '#CBD5E1',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B'
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        accent: ['Outfit', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'slide-up': {
          'from': { transform: 'translateY(10px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        }
      },
      spacing: {
        'gutter': 'clamp(1rem, 5vw, 2rem)',
        'gap': 'clamp(0.5rem, 3vw, 1.5rem)'
      }
    }
  },
  plugins: []
}
