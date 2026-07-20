import type { Config } from 'tailwindcss';

/**
 * Configuration Tailwind ALIMENTEE par docs/design/design-tokens.json (DTCG 3 tiers).
 *
 * Principe (design-system.md §Handoff) :
 *  - PRIMITIVES (echelles numeriques de couleur, radius, spacing, fontes) : valeurs en dur ici,
 *    copiees telles quelles du fichier tokens (source de verite machine).
 *  - SEMANTIQUE (accent / surface / contenu / ligne / statuts) : referencee via variables CSS
 *    `var(--color-*)` definies dans src/app/globals.css, pour permettre le remapping light/dark
 *    sans dupliquer les classes (dark = remapping, pas inversion — design-tokens.json semantic.dark).
 *
 * Mapping token -> nom Tailwind (choix documente la ou le token brut n'a pas d'equivalent direct) :
 *  - color-background-primary/secondary  -> surface.page / surface.muted
 *  - color-surface-card                  -> surface.card
 *  - color-text-primary/secondary/...    -> content.primary / content.secondary / content.tertiary / content.inverse
 *  - color-border-default/strong         -> line.DEFAULT / line.strong   (evite le mot-cle Tailwind "border")
 *  - color-accent-primary(+hover/subtle) -> accent.DEFAULT / accent.hover / accent.subtle
 *  - color-{verified,stale,attention,error}-fg/bg/border -> {verified,stale,attention,error}.{fg,bg,border}
 *    (fusionnes avec l'echelle primitive du meme nom : ex. bg-verified-500 primitif ET bg-verified-bg semantique)
 *  - color-focus-ring                    -> focus (utilisable en outline-focus / ring-focus)
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- PRIMITIVES (design-tokens.json > primitives.color) ---
        ink: {
          950: '#0B0E13', 900: '#10151C', 800: '#1B222B', 700: '#28313D',
          600: '#3A4552', 500: '#54606E', 400: '#78838F', 300: '#A6AEB8',
        },
        paper: {
          0: '#FFFFFF', 50: '#F8F9FB', 100: '#F1F3F6', 200: '#E7EAEE', 300: '#DCE1E7',
        },
        cobalt: {
          900: '#152A47', 700: '#1F3A5F', 600: '#2A4E7A', 500: '#3E6699',
          400: '#6E93BE', 300: '#9DBBDA', 100: '#DCE7F2',
        },
        // --- STATUTS : echelle primitive + alias semantiques fg/bg/border (var CSS) ---
        verified: {
          800: '#0A5449', 700: '#0F7B6C', 600: '#14957F', 500: '#2FBFA0',
          300: '#8FDCC9', 100: '#DEF5EE',
          fg: 'var(--color-verified-fg)', bg: 'var(--color-verified-bg)', border: 'var(--color-verified-border)',
        },
        attention: {
          800: '#6B3E10', 700: '#8A5A2B', 600: '#A9723A', 500: '#C9924D',
          300: '#E3C193', 100: '#F6E9D8',
          fg: 'var(--color-attention-fg)', bg: 'var(--color-attention-bg)', border: 'var(--color-attention-border)',
        },
        stale: {
          700: '#54606E', 500: '#78838F', 300: '#A6AEB8', 100: '#E7EAEE',
          fg: 'var(--color-stale-fg)', bg: 'var(--color-stale-bg)', border: 'var(--color-stale-border)',
        },
        error: {
          700: '#7A241D', 600: '#9C2E24', 500: '#B3261E', 100: '#F7DEDB',
          fg: 'var(--color-error-fg)', bg: 'var(--color-error-bg)', border: 'var(--color-error-border)',
        },
        // --- SEMANTIQUE (var CSS, remappees light/dark dans globals.css) ---
        surface: {
          page: 'var(--color-background-primary)',
          muted: 'var(--color-background-secondary)',
          card: 'var(--color-surface-card)',
        },
        content: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        line: {
          DEFAULT: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
        },
        accent: {
          DEFAULT: 'var(--color-accent-primary)',
          hover: 'var(--color-accent-primary-hover)',
          subtle: 'var(--color-accent-primary-subtle)',
        },
        focus: 'var(--color-focus-ring)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'SF Mono', 'monospace'],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700',
      },
      fontSize: {
        // [taille, lineHeight] — design-tokens.json > primitives.font.size / lineHeight
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        md: ['18px', '28px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
        '2xl': ['30px', '36px'],
        '3xl': ['36px', '40px'],
        '4xl': ['48px', '52px'],
        display: ['60px', '64px'],
      },
      spacing: {
        '2xs': '2px', xs: '4px', sm: '8px', md: '16px', lg: '24px',
        xl: '32px', '2xl': '48px', '3xl': '64px', '4xl': '96px',
      },
      borderRadius: {
        none: '0', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        modal: 'var(--shadow-modal)',
      },
      transitionDuration: {
        instant: '0ms', fast: '150ms', normal: '300ms', slow: '500ms', glacial: '1000ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
      },
      screens: {
        sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px',
      },
      maxWidth: {
        container: '1280px', // design-tokens.json > primitives.grid.max-width
      },
    },
  },
  plugins: [],
};

export default config;
