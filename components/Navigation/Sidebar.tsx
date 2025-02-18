'use client'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faHome,
	faMapMarkedAlt,
	faSearch,
	faChartBar,
	faFileAlt,
	faSignOutAlt,
	faUser,
	faArrowLeft,
	faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import logo from '../../public/icon/logo.svg'

const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const currentYear = new Date().getFullYear()

	return (
		<div
			className={`h-screen bg-black text-white flex flex-col transition-all duration-300 ${
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
				<button onClick={() => setIsCollapsed(!isCollapsed)}>
					<FontAwesomeIcon
						icon={isCollapsed ? faArrowRight : faArrowLeft}
						className='p-3 text-white rounded-lg hover:bg-mainColor transition-colors duration-400 cursor-pointer'
					/>
				</button>
			</div>

			{/* Nawigacja */}
			<nav className='mt-5 px-2 font-thin'>
				{[
					{ label: 'Strona główna', icon: faHome, path: '/' },
					{ label: 'Wyszukiwarka danych', icon: faSearch, path: '/wyszukiwarka' },
					{ label: 'Mapa Polski', icon: faMapMarkedAlt, path: '/mapa' },
					{ label: 'Analizy', icon: faChartBar, path: '/analizy' },
					{ label: 'Raporty', icon: faFileAlt, path: '/raporty' },
				].map((item, index) => (
					<a
						key={index}
						href={item.path}
						className={`flex items-center p-3 rounded-lg hover:bg-mainColor transition-colors duration-400 cursor-pointer 
		${isCollapsed ? 'justify-center' : 'justify-start'}`}>
						<FontAwesomeIcon icon={item.icon} className='text-white' />
						{!isCollapsed && <span className='ml-4'>{item.label}</span>}
					</a>
				))}
			</nav>

			{/* Sekcja użytkownika */}
			<div className={`flex items-center justify-between mt-auto p-2 ${isCollapsed ? 'flex-col gap-3' : ''}`}>
				<div className='flex flex-row items-center gap-2'>
					<div className='w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center'>
						<FontAwesomeIcon icon={faUser} className='text-white' />
					</div>
					{!isCollapsed && (
						<div>
							<p className='text-sm font-semibold'>Jan Kowalski</p>
							<p className='text-xs text-gray-400'>jan.kowalski@example.com</p>
						</div>
					)}
				</div>
				<button>
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
