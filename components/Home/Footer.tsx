'use client'
import Image from 'next/image'
import logo from '../../public/icon/logo.svg'

const Footer = () => {
	return (
		<footer className='bg-black text-gray-300 py-8 px-6 mt-16'>
			<div className='max-w-6xl mx-auto flex flex-col lg:flex-row lg:justify-between gap-8 text-center lg:text-left'>
				{/* Logo & motto */}
				<div className='flex flex-col items-center lg:items-start space-y-3'>
					<Image src={logo} alt='RetroSynoptiQ Logo' width={60} height={60} />
					<div>
						<span className='text-lg font-bold text-white'>RetroSynoptiQ</span>
						<p className='text-xs font-thin max-w-xs'>Poznaj przeszłość pogody, by lepiej planować przyszłość.</p>
					</div>
				</div>

				{/* Linki nawigacyjne */}
				<div>
					<h3 className='text-lg font-semibold text-white mb-2'>Nawigacja</h3>
					<ul className='space-y-2 font-thin'>
						<li><a href='#aboutus' className='hover:text-mainColor transition'>O nas</a></li>
						<li><a href='#' className='hover:text-mainColor transition'>Aktualna prognoza</a></li>
						<li><a href='#achievements' className='hover:text-mainColor transition'>Osiągnięcia</a></li>
						<li><a href='#specialists' className='hover:text-mainColor transition'>Użytkownicy</a></li>
					</ul>
				</div>

				{/* Platformy pogodowe */}
				<div>
					<h3 className='text-lg font-semibold text-white mb-2'>Platformy pogodowe</h3>
					<ul className='space-y-2 font-thin'>
						<li><a href='https://www.imgw.pl/' target='_blank' rel='noopener noreferrer' className='hover:text-mainColor transition'>IMGW – Oficjalne dane z Polski</a></li>
						<li><a href='https://meteo.pl/' target='_blank' rel='noopener noreferrer' className='hover:text-mainColor transition'>Meteo.pl – Prognozy numeryczne</a></li>
						<li><a href='https://www.accuweather.com/' target='_blank' rel='noopener noreferrer' className='hover:text-mainColor transition'>AccuWeather – Globalne prognozy</a></li>
						<li><a href='https://weather.com/' target='_blank' rel='noopener noreferrer' className='hover:text-mainColor transition'>Weather.com – The Weather Channel</a></li>
					</ul>
				</div>
			</div>

			{/* Prawa autorskie na pełną szerokość */}
			<div className='text-center text-sm text-gray-400 mt-8 border-t border-gray-500 pt-4'>
				<p>©{new Date().getFullYear()} RetroSynoptiQ<br/>Wszelkie prawa zastrzeżone</p>
			</div>
		</footer>
	)
}

export default Footer
