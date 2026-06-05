import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#0D9488',
          tealDark: '#0F766E',
          tealLight: '#F0FDFA',
          blue: '#0D9488',      // mapped to teal
          blueDark: '#0F766E',  // mapped to tealDark
          blueLight: '#F0FDFA', // mapped to tealLight
          yellow: '#EAB308',
          yellowLight: '#FEF9C3',
          gold: '#EAB308',      // mapped to yellow
          goldLight: '#FEF9C3', // mapped to yellowLight
          amber: '#EAB308',     // mapped to yellow
          amberLight: '#FEF9C3',// mapped to yellowLight
          purple: '#8B5CF6',
          purpleLight: '#F3E8FF',
          dark: '#1E2A3A',
          muted: '#6B7280',
          border: '#E5E7EB',
          bg: '#F9FAFB',
          surface: '#FFFFFF',
          success: '#10B981',
          error: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
