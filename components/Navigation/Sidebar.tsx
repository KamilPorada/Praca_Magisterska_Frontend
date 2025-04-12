'use client'
import { useState } from 'react'
import { useSidebar } from '../../components/contexts/SidebarProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faHome,
	faChartBar,
	faMap,
	faSearch,
	faLink,
	faCity,
	faCalculator,
	faSignOutAlt,
	faUser,
	faArrowLeft,
	faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import logo from '../../public/icon/logo.svg'
import { signOut, useSession } from 'next-auth/react'

const Sidebar = () => {
	const currentYear = new Date().getFullYear()
	const { isCollapsed, toggleSidebar } = useSidebar()

	const { data: session } = useSession()
	const user = session?.user
	const pathname = usePathname() // Zamiast router.pathname używamy usePathname()

	const handleSignOut = async () => {
		signOut({
			callbackUrl: '/',
		})
	}

	if (pathname == '/') return null

	return (
		<div
			className={`h-screen bg-black text-white flex flex-col fixed left-0 top-0 transition-all duration-300 ${
				isCollapsed ? 'w-[70px]' : 'w-[280px]'
			}`}>
			<div
				className={`flex ${
					isCollapsed ? 'flex-col gap-6' : 'flex-row'
				} items-center justify-around border-b border-gray-500 mx-2 py-6`}>
				{!isCollapsed && (
					<div className='flex flex-row items-center justify-between w-52'>
						<Image src={logo} alt='RetroSynoptiQ Logo' width={50} />
						<div className='ml-2'>
							<span className='text-lg font-bold text-white'>RetroSynoptiQ</span>
							<p className='text-xs font-thin'>– pogoda wczoraj, dziś, zawsze</p>
						</div>
					</div>
				)}
				{isCollapsed && <Image src={logo} alt='RetroSynoptiQ Logo' width={50} />}
				<button onClick={() => toggleSidebar()}>
					<FontAwesomeIcon
						icon={isCollapsed ? faArrowRight : faArrowLeft}
						className='p-3 text-white rounded-lg hover:bg-mainColor transition-colors duration-400 cursor-pointer'
					/>
				</button>
			</div>

			{/* Nawigacja */}
			<nav className='mt-5 px-2 font-thin'>
				{[
					{ label: 'Strona główna', icon: faHome, path: '/dashboard' },
					{ label: 'Wyszukiwarka danych', icon: faSearch, path: '/search-data' },
					{ label: 'Analiza statystyczna', icon: faCalculator, path: '/stats-data' },
					{ label: 'Wizualizacja danych', icon: faChartBar, path: '/charts' },
					{ label: 'Wizualizacja na mapie', icon: faMap, path: '/maps' }, 
					{ label: 'Korelacja danych', icon: faLink, path: '/correlation' },
					{ label: 'Porównanie klimatu miast', icon: faCity, path: '/comparison' },
				].map((item, index) => (
					<a
						key={index}
						href={item.path}
						className={`flex items-center p-3 rounded-lg hover:bg-mainColor transition-colors duration-400 cursor-pointer 
    ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
						<FontAwesomeIcon icon={item.icon} className='text-white h-4' />
						{!isCollapsed && <span className='ml-4'>{item.label}</span>}
					</a>
				))}
			</nav>

			{/* Sekcja użytkownika */}
			<div className={`flex items-center justify-between mt-auto p-2 ${isCollapsed ? 'flex-col gap-3' : ''}`}>
				<div className='flex flex-row items-center gap-2'>
					{user?.image ? (
						<Image src={user.image} alt='Avatar' width={40} height={40} className='rounded-full' />
					) : (
						<div className='w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center'>
							<FontAwesomeIcon icon={faUser} className='text-white' />
						</div>
					)}
					{!isCollapsed && (
						<div>
							<p className='text-sm font-semibold'>{user?.name || 'Nieznany użytkownik'}</p>
							<p className='text-xs text-gray-400'>{user?.email || 'Brak e-maila'}</p>
						</div>
					)}
				</div>
				<button onClick={handleSignOut}>
					<FontAwesomeIcon
						icon={faSignOutAlt}
						className='p-3 text-white rounded-lg hover:bg-mainColor transition-colors duration-400 cursor-pointer'
					/>
				</button>
			</div>

			{/* Stopka */}
			<p className='text-xs text-gray-200 text-center pb-4 mt-4'>
				© {currentYear} {isCollapsed ? '' : 'RetroSynoptiQ'} <br />
				{!isCollapsed && 'Wszelkie prawa zastrzeżone'}
			</p>
		</div>
	)
}

export default Sidebar
