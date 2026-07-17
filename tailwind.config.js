/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		"./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
				inter: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
				display: ['var(--font-manrope)', 'Manrope', 'var(--font-inter)', 'sans-serif'],
				// Legacy alias — Poppins was replaced by Inter; retire in Phase 3
				poppins: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
			},
			gridTemplateColumns: {
				'21': 'repeat(21, minmax(0, 1fr))'
			},
			backgroundImage: {
				LoginBG: "url('/login/loginBG.jpg')",
			},
			boxShadow: {
				'card': 'var(--shadow-xs)',
				'raised': 'var(--shadow-sm)',
				'pop': 'var(--shadow-md)',
			},
			colors: {
				// IMS design tokens (globals.css :root)
				page: 'var(--bg-page)',
				surface: 'var(--bg-card)',
				subtle: 'var(--bg-subtle)',
				sunken: 'var(--bg-sunken)',
				line: {
					DEFAULT: 'var(--line)',
					strong: 'var(--line-strong)',
				},
				ink: {
					DEFAULT: 'var(--ink)',
					secondary: 'var(--ink-secondary)',
					muted: 'var(--ink-muted)',
				},
				brand: {
					DEFAULT: 'var(--brand)',
					strong: 'var(--brand-strong)',
					soft: 'var(--brand-soft)',
					line: 'var(--brand-border)',
				},
				ok: { bg: 'var(--ok-bg)', text: 'var(--ok-text)', line: 'var(--ok-border)' },
				warn: { bg: 'var(--warn-bg)', text: 'var(--warn-text)', line: 'var(--warn-border)' },
				bad: { bg: 'var(--bad-bg)', text: 'var(--bad-text)', line: 'var(--bad-border)' },
				info: { bg: 'var(--info-bg)', text: 'var(--info-text)', line: 'var(--info-border)' },
				// Legacy one-offs — retire in Phase 3
				customBlue: '#096EB6',
				customLavender: '#B1A0C7',
				customOrange: '#E26B0A',
				customLime: '#92D050',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-zoom-in': {
					'0%': {
						opacity: 0,
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: 1,
						transform: 'scale(1)'
					}
				},
				'fade-zoom-out': {
					'0%': {
						opacity: 1,
						transform: 'scale(1)'
					},
					'100%': {
						opacity: 0,
						transform: 'scale(0.95)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-zoom-in': 'fade-zoom-in 200ms ease-out forwards',
				'fade-zoom-out': 'fade-zoom-out 200ms ease-in forwards'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				card: 'var(--radius-card)',
				panel: 'var(--radius-panel)',
				control: 'var(--radius-control)',
			},
			screens: {
				'3xl': '1920px',
			}
		},
		container: {
			maxWidth: '1700px'
		}
	},
	plugins: [require("tailwindcss-animate")],
	layers: ['components', 'utilities', 'app'], // or simply use a default layer like `components`
}

