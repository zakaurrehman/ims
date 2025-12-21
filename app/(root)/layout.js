'use client'
import Sidebar from '../(root)/_components/SideBar';
import SideBarMini from '../(root)/_components/SideBarMini';
import Spinner from '../../components/spinner';
import { UserAuth } from "../../contexts/useAuthContext";
import Idle from '../../components/idle.js'
import { MainNav } from './_components/MainNav';
import { usePathname } from 'next/navigation';
import { Analytics } from "@vercel/analytics/next"
import FloatingChat from '../../components/FloatingChat';
import GlobalSearchLoader from '../../utils/globalSearch/GlobalSearchLoader'


export default function MyLayout({
	children, // will be a page or nested layout
}) {

	const auth = UserAuth() || {};
	const { user, loadingPage, userTitle } = auth;
	const pathname = usePathname();

	// Step 1: If loading, show spinner
	if (loadingPage) {
		return <Spinner />;
	}

	// Step 2: If not logged in, redirect to /signin
	if (!user) {
		if (typeof window !== 'undefined') {
			window.location.href = '/signin';
		}
		return null;
	}

	// Step 3: If user is accounting and not on /accounting, show nothing
	if (userTitle === 'accounting' && pathname !== '/accounting') {
		return null;
	}

	// Step 4: Render layout for authenticated users
	return (
		<main className="md:flex ">
			<Idle />
			<div className='hidden md:flex  drop-shadow-xl z-10 mx-auto'>
				<Sidebar />
			</div>
			<div className='md:hidden flex drop-shadow-xl z-30 top-0 bottom-4 fixed w-full h-0'>
				<SideBarMini />
			</div>
			<div className="grow md:overflow-auto h-screen relative">
								<GlobalSearchLoader />
				<MainNav />
				{children}
			</div>

			{/* AI-Powered Floating Chat */}
			<FloatingChat />
		</main>
	);
}
