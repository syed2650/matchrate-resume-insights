
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// New custom colors with updated coral/peach gradient scheme
				warm: {
					bg: '#FDFCFA', // Lighter background
					text: '#111111',
					accent: '#FB6B5A', // Coral accent
					section: '#F7F7F7',
					muted: '#F1F5F9',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'float-delayed': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'50%': { transform: 'translateY(-15px) rotate(3deg)' },
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0) scale(1)' },
					'50%': { transform: 'translateY(-8px) scale(1.02)' },
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '0.9' },
					'50%': { opacity: '0.6' },
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' },
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in-down': {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'scroll': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' },
				},
				'scroll-reversed': {
					'0%': { transform: 'translateX(-50%)' },
					'100%': { transform: 'translateX(0)' },
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'morph': {
					'0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
					'50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'float-delayed': 'float-delayed 5s ease-in-out infinite',
				'float-slow': 'float-slow 6s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
				'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
				'fade-in-left': 'fade-in-left 0.6s ease-out forwards',
				'fade-in-right': 'fade-in-right 0.6s ease-out forwards',
				'scale-in': 'scale-in 0.5s ease-out forwards',
				'scroll': 'scroll 25s linear infinite',
				'scroll-reversed': 'scroll-reversed 25s linear infinite',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'shimmer': 'shimmer 2s infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'spin-slow': 'spin-slow 20s linear infinite',
				'morph': 'morph 8s ease-in-out infinite',
			},
			boxShadow: {
				'premium': '0 4px 20px rgba(0, 0, 0, 0.05)',
				'premium-hover': '0 8px 30px rgba(0, 0, 0, 0.08)',
				'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
				'cta': '0 10px 25px -5px rgba(251, 107, 90, 0.4)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
			},
			backgroundImage: {
				'peach-gradient': 'linear-gradient(to bottom, #FFF1F0, #FFE4D6)',
				'coral-gradient': 'linear-gradient(to right, #FB6B5A, #F87171)',
				'blue-gradient': 'linear-gradient(to right, #6366F1, #3B82F6)',
				'neutral-gradient': 'linear-gradient(to bottom, #FAFAFA, #F5F5F5)',
				'lilac-gradient': 'linear-gradient(to bottom, #F5F3FF, #EDE9FE)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
