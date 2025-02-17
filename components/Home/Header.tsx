'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../../public/icon/logo.svg'
import Button from '../UI/Button'

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50) // Jeśli przewinięto więcej niż 50px, zmień stan
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<header
			className={`fixed top-0 left-0 w-full h-24 z-50 transition-all duration-300 bg-backgroundColor bg-opacity-40 ${
				isScrolled ? 'bg-opacity-80' : ''
			}`}>
			<div className='flex items-center justify-between px-6 py-3'>
				{/* Logo i nazwa */}
				<div className='flex items-center space-x-3'>
					<Image src={logo} alt='RetroSynoptiQ Logo' width={60} />
					<div>
						<span className='text-lg font-bold text-white'>RetroSynoptiQ</span>
						<p className='text-xs font-thin'>– pogoda wczoraj, dziś, zawsze</p>
					</div>
				</div>

				{/* Menu desktopowe */}
				<nav className='hidden lg:flex space-x-6 font-medium'>
					{[
						{ label: 'O nas', href: '#aboutus' },
						{ label: 'Aktualna prognoza', href: '#forecast' },
						{ label: 'Osiągnięcia', href: '#achievements' },
						{ label: 'Użytkownicy', href: '#specialists' },
					].map((item, index) => (
						<a
							key={index}
							href={item.href}
							className='relative text-white hover:text-gray-300 transition-colors before:absolute before:bottom-[-4px] before:left-1/2 before:w-0 before:h-[2px] before:bg-mainColor before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0'>
							{item.label}
						</a>
					))}
				</nav>

				{/* Przycisk logowania */}
				<div className='hidden lg:block'>
					<Button className='text-black'>Zaloguj się</Button>
				</div>

				{/* Przycisk otwierający / zamykający menu mobilne */}
				<button className='lg:hidden text-white text-2xl' onClick={() => setIsMenuOpen(!isMenuOpen)}>
					<FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
				</button>

				{/* Menu boczne dla urządzeń mobilnych */}
				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							className='fixed top-0 right-0 w-64 h-full bg-backgroundColor shadow-lg p-6 flex flex-col justify-between z-50 mt-24 pb-32'>
							{/* Linki w menu */}
							<nav className='flex flex-col items-start space-y-4 mt-4 font-medium'>
								{[
									{ label: 'O nas', href: '#about' },
									{ label: 'Aktualna prognoza', href: '#forecast' },
									{ label: 'Historia pogody', href: '#history' },
									{ label: 'Wykresy', href: '#charts' },
								].map((item, index) => (
									<a
										key={index}
										href={item.href}
										className='relative text-white transition-colors before:absolute before:bottom-[-4px] before:left-0 before:w-0 before:h-[2px] before:bg-mainColor before:transition-all before:duration-300 before:ease-in-out hover:before:w-full'>
										{item.label}
									</a>
								))}
							</nav>
							<div className='w-full text-center mt-4'>
								<Button className='w-full'>Zaloguj się</Button>
								<p className='text-xs text-white mt-4'>Wszelkie prawa zastrzeżone</p>
								<p className='text-xs text-white'>© {new Date().getFullYear()}</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	)
}

export default Header
