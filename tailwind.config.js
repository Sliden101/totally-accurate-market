/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BFFF00',
        secondary: '#FF3366',
        accent: '#00D4FF',
        background: '#080808',
        surface: '#111111',
        'surface-alt': '#222222',
        text: '#F0F0F0',
        'text-muted': '#666666',
        success: '#00FF66',
        danger: '#FF2244',
        warning: '#FFAA00'
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'marquee': 'marquee 10s linear infinite',
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
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      spacing: {
        'gutter': 'clamp(1rem, 5vw, 2rem)',
        'gap': 'clamp(0.5rem, 3vw, 1.5rem)'
      },
      boxShadow: {
        'brutal': '6px 6px 0px 0px #222222',
        'brutal-hover': '8px 8px 0px 0px #BFFF00',
        'brutal-pink': '6px 6px 0px 0px #FF3366',
        'brutal-cyan': '6px 6px 0px 0px #00D4FF',
      }
    }
  },
  plugins: []
}
