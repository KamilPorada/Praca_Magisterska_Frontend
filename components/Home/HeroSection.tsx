'use client'
import { motion } from 'framer-motion'
import heroImg from '../../public/img/hero-img.jpg'
import Button from '../UI/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

const HeroSection = () => {
	// Konfiguracja animacji dla wszystkich elementów
	const fadeInFromLeft = {
		initial: { opacity: 0, x: '-4vw' }, // Start poza ekranem, mniej więcej na 8%
		animate: { opacity: 1, x: 0 },
		transition: { duration: 1, ease: 'easeOut' },
	}

	return (
		<div className='relative w-full h-screen'>
			{/* Obrazek */}
			<img src={heroImg.src} alt='Hero Image' className='absolute top-0 left-0 w-full h-full object-cover' />

			{/* Cień */}
			<div className='absolute top-0 left-0 w-full h-full bg-black opacity-40'></div>

			{/* Zawartość */}
			<div className='absolute z-20 flex flex-col justify-center h-full w-full text-white'>
				{/* Teksty */}
				<div className='absolute left-[8%] top-24 bottom-0 h-auto w-[1px] bg-gray-400'></div>
				<motion.h1
					{...fadeInFromLeft}
					className='absolute top-[35%] left-[12%] md:left-[10%] text-3xl sm:text-4xl md:text-5xl font-bold before:absolute before:-left-[3.5%] md:before:-left-[2.5%] before:w-[3px] md:before:w-[5px] md:before:h-[50px] before:h-[35px] before:bg-mainColor'>
					RetroSynoptiQ
				</motion.h1>

				<motion.p
					{...fadeInFromLeft}
					transition={{ ...fadeInFromLeft.transition, delay: 0.3 }} // Opóźnienie dla płynności
					className='absolute top-[48%] left-[12%] md:left-[10%] text-base sm:text-lg md:text-xl uppercase font-light'>
					Poznaj przeszłość pogody,
					<br /> by lepiej planować przyszłość.
				</motion.p>

				<motion.div
					{...fadeInFromLeft}
					transition={{ ...fadeInFromLeft.transition, delay: 0.6 }} // Kolejne opóźnienie dla efektu sekwencyjnego
					className='absolute top-[60%] left-[12%] md:left-[10%]'>
					<Button>
						Odkryj więcej <FontAwesomeIcon icon={faChevronDown} className='ml-2 text-basic md:text-lg animate-bounce' />
					</Button>{' '}
				</motion.div>
			</div>
		</div>
	)
}

export default HeroSection
