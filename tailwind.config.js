/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void:    '#080b0f',
        surface: '#0d1117',
        panel:   '#111820',
        border:  '#1c2a38',
        muted:   '#243040',
        subtle:  '#3a4f63',
        dim:     '#6b8299',
        text:    '#c8d8e8',
        bright:  '#e8f4ff',
        cyan:    '#00d4ff',
        teal:    '#00b896',
        amber:   '#f59e0b',
        rose:    '#f43f5e',
        lime:    '#84cc16',
      },
      fontFamily: {
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['var(--font-display)', 'Space Mono', 'monospace'],
        body:    ['var(--font-body)', 'DM Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':      'fadeIn 0.4s ease forwards',
        'slide-up':     'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'scan':         'scan 8s linear infinite',
        'glow':         'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scan:    { from: { backgroundPosition: '0 -100%' }, to: { backgroundPosition: '0 200%' } },
        glow:    { from: { boxShadow: '0 0 4px #00d4ff33' }, to: { boxShadow: '0 0 20px #00d4ff66, 0 0 40px #00d4ff22' } },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
