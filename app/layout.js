import './globals.css';
import { Inter, Manrope } from 'next/font/google';
import Provider from './providers'
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GlobalSearchProvider } from '../contexts/useGlobalSearchContext';

// Inter = UI / body / tables (tabular numerals); Manrope = headings & stat numbers.
const inter = Inter({
	weight: ['400', '500', '600'],
	subsets: ['latin'],
	variable: '--font-inter',
});

const manrope = Manrope({
	weight: ['600', '700', '800'],
	subsets: ['latin'],
	variable: '--font-manrope',
});

export const metadata = {
	title: 'IMS-Metals',
	description: 'Invoices & Contracts',
	icons: {
		icon: '/logo/logoNew.svg',
		apple: '/logo/logoNew.svg',
	},
};

// Every page is auth-gated and renders live, per-user Firebase data — there is no static
// HTML to gain, and statically prerendering client pages that call useSearchParams() (e.g.
// /contracts, /invoices, /expenses) breaks `next build`. Render the app dynamically.
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {


	return (
		<html lang="en">
			{/* --font-poppins is aliased to Inter so legacy font-poppins/var(--font-poppins)
			    call sites render the new font until they are migrated (Phase 3). */}
			<body className={`${inter.variable} ${manrope.variable} ${inter.className}`} style={{ '--font-poppins': inter.style.fontFamily }}>
				<Provider>
					<GlobalSearchProvider>
						<div>{children}</div>
					</GlobalSearchProvider>
				</Provider>
				<SpeedInsights />
			</body>
		</html>
	);
}
