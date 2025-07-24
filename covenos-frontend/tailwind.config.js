/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ⚫ Paleta inspirada na logo
        abyss: {
          DEFAULT: '#06202B',
          dark: '#04171F'
        },
        blood: {
          DEFAULT: '#981E1B',
          dark: '#6E1817'
        },
        night: '#0c1418',
        neutral: {
          750: '#2e2e2e'
        }
      },

      fontFamily: {
        // 👻 Fontes góticas e estilizadas
        'creepster': ['Creepster', 'cursive'],
        'nosifer': ['Nosifer', 'cursive'],
        'butcherman': ['Butcherman', 'cursive'],
        'gothic': ['UnifrakturCook', 'cursive'],
        'spooky': ['Creepster', 'cursive'],
        'serif': ['Cinzel Decorative', 'serif'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'mono': ['ui-monospace', 'SFMono-Regular']
      },

      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-blood': 'pulseBlood 2s ease-in-out infinite'
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3)'
          },
          '100%': {
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.6)'
          }
        },
        pulseBlood: {
          '0%, 100%': {
            boxShadow: '0 0 12px rgba(152, 30, 27, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 24px rgba(152, 30, 27, 0.7)'
          }
        }
      },

      backgroundImage: {
        'gradient-gothic': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 35%, #16213e 65%, #0f0f23 100%)',
        'gradient-witch': 'linear-gradient(135deg, #4c1d95 0%, #2e1065 50%, #1e1b4b 100%)',
        'gradient-blood': 'linear-gradient(135deg, #981E1B 0%, #450a0a 50%, #1c1917 100%)',
        'gradient-elegant': 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
      },

      boxShadow: {
        'gothic': '0 10px 25px -5px rgba(139, 92, 246, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.1)',
        'blood': '0 10px 25px -5px rgba(152, 30, 27, 0.5), 0 10px 10px -5px rgba(152, 30, 27, 0.3)',
        'witch': '0 10px 25px -5px rgba(109, 40, 217, 0.3), 0 10px 10px -5px rgba(109, 40, 217, 0.1)'
      }
    }
  },
  plugins: [],
}
