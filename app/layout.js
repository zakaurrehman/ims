import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Provider from './providers'
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GlobalSearchProvider } from '../contexts/useGlobalSearchContext';

// Plus Jakarta Sans = UI / body / headings (warm geometric, the reference look);
// Inter = data tables & numbers only (tabular numerals keep columns aligned).
const jakarta = Plus_Jakarta_Sans({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-jakarta',
});

const inter = Inter({
	weight: ['400', '500', '600'],
	subsets: ['latin'],
	variable: '--font-inter',
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
			{/* Legacy aliases: --font-poppins → Jakarta (old call sites), --font-manrope → Jakarta
			    (heading classes) so every existing reference renders the current font. */}
			<body
				className={`${jakarta.variable} ${inter.variable} ${jakarta.className}`}
				style={{ '--font-poppins': jakarta.style.fontFamily, '--font-manrope': jakarta.style.fontFamily }}
			>
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
