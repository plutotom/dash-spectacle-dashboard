import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))',
                },
            },
            fontSize: {
                // to small
                '2xs': ['0.375rem', { lineHeight: '0.5rem' }],
                xs: ['0.875rem', { lineHeight: '1.25rem' }],
                sm: ['1rem', { lineHeight: '1.5rem' }],
                base: ['1.25rem', { lineHeight: '1.75rem' }],
                lg: ['1.5rem', { lineHeight: '2rem' }],
                xl: ['1.75rem', { lineHeight: '2.25rem' }],
                '2xl': ['2rem', { lineHeight: '2.5rem' }],
                '3xl': ['2.5rem', { lineHeight: '3rem' }],
                '4xl': ['3rem', { lineHeight: '3.5rem' }],
                '5xl': ['3.75rem', { lineHeight: '1' }],
                '6xl': ['4.5rem', { lineHeight: '1' }],
                '7xl': ['5rem', { lineHeight: '1' }],
                '8xl': ['6rem', { lineHeight: '1' }],
                '9xl': ['7rem', { lineHeight: '1' }],
                // to big
                // '2xs': ['0.75rem', { lineHeight: '1rem' }],
                // xs: ['1.75rem', { lineHeight: '2.5rem' }],
                // sm: ['2rem', { lineHeight: '3rem' }],
                // base: ['2.5rem', { lineHeight: '3.5rem' }],
                // lg: ['3rem', { lineHeight: '4rem' }],
                // xl: ['3.5rem', { lineHeight: '4.5rem' }],
                // '2xl': ['4rem', { lineHeight: '5rem' }],
                // '3xl': ['5rem', { lineHeight: '6rem' }],
                // '4xl': ['6rem', { lineHeight: '7rem' }],
                // '5xl': ['7.5rem', { lineHeight: '1' }],
                // '6xl': ['9rem', { lineHeight: '1' }],
                // '7xl': ['10rem', { lineHeight: '1' }],
                // '8xl': ['12rem', { lineHeight: '1' }],
                // '9xl': ['14rem', { lineHeight: '1' }],
            },
        },
    },

    plugins: [forms, require('tailwindcss-animate')],
};
