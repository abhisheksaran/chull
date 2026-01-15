/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Emotional color system
        emotion: {
          melancholy: {
            base: '#1a1a2e',
            accent: '#16213e',
            glow: '#0f3460',
            text: '#e94560',
          },
          nostalgia: {
            base: '#2d1b3d',
            accent: '#3d2a4f',
            glow: '#4a3a5a',
            text: '#d4a574',
          },
          introspection: {
            base: '#0d1b2a',
            accent: '#1b263b',
            glow: '#415a77',
            text: '#778da9',
          },
          passion: {
            base: '#2d0a1a',
            accent: '#4a0e2e',
            glow: '#6b1a3a',
            text: '#c41e3a',
          },
          serenity: {
            base: '#0a1929',
            accent: '#132f4c',
            glow: '#1e4976',
            text: '#4fc3f7',
          },
          longing: {
            base: '#1a0d1a',
            accent: '#2d1a2d',
            glow: '#3d2a3d',
            text: '#b886d9',
          },
        },
        // Base dark palette
        dark: {
          studio: '#0a0a0a',
          canvas: '#121212',
          paper: '#1a1a1a',
          ink: '#2a2a2a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        hindi: ['var(--font-hindi)', 'Noto Serif Devanagari', 'serif'],
        primary: ['var(--font-primary)', 'Cormorant Garamond', 'Playfair Display', 'serif'],
        english: ['var(--font-english)', 'Cormorant Garamond', 'Playfair Display', 'serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.5vw + 0.5rem, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.75vw + 0.625rem, 1rem)',
        'fluid-base': 'clamp(1rem, 1vw + 0.75rem, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1.25vw + 0.875rem, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 2vw + 1rem, 2.25rem)',
        'fluid-2xl': 'clamp(2rem, 3vw + 1.25rem, 3.5rem)',
        'fluid-3xl': 'clamp(2.5rem, 4vw + 1.5rem, 5rem)',
        'fluid-4xl': 'clamp(3.5rem, 6vw + 2rem, 8rem)',
        'fluid-5xl': 'clamp(4.5rem, 8vw + 2.5rem, 10rem)',
        'fluid-6xl': 'clamp(5.5rem, 10vw + 3rem, 12rem)',
      },
      spacing: {
        'screen-safe': 'calc(100vh - 2rem)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'fade-in-down': 'fadeInDown 1s ease-out',
        'slide-in-left': 'slideInLeft 1.2s ease-out',
        'slide-in-right': 'slideInRight 1.2s ease-out',
        'grain': 'grain 0.3s steps(6) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(-15%, 10%)' },
          '90%': { transform: 'translate(10%, 5%)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

