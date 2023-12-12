import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import daisyUI from 'daisyui';

export default {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', ...fontFamily.sans]
			}
		}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#111827',
					secondary: '#e5e7eb',
					accent: '#e11d48',
					neutral: '#ffffff',
					'base-100': '#fafafa',
					info: '#2563eb',
					success: '#16a34a',
					warning: '#facc15',
					error: '#dc2626'
				}
			}
		]
	},
	plugins: [daisyUI]
} satisfies Config;
