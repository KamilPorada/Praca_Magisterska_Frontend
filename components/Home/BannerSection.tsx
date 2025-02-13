'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import StormImage from '../../public/img/storm-img.jpg'

const BannerSection = () => {
	return (
		<div className='pt-8 md:pt-20 w-full'>
			<section className='relative w-full h-[200px] sm:h-[300px] md:h-[400px] flex items-center justify-center bg-black overflow-hidden group tertiary-font'>
				<Image
					src={StormImage}
					alt='Burza nad polem'
					layout='fill'
					objectFit='cover'
					className='opacity-60 w-full'
				/>

				<div className='relative z-10 text-white text-center px-4 sm:px-6'>
					<motion.h2
						className='text-base sm:text-2xl md:text-4xl font-bold uppercase'
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
						viewport={{ once: true }}
						whileHover={{ scale: 1.05 }}>
						Pogoda&nbsp;&nbsp;kształtuje&nbsp;&nbsp;historię
					</motion.h2>

					<motion.p
						className='text-xs sm:text-sm md:text-lg mt-4 sm:mt-5 max-w-xl sm:max-w-2xl mx-auto'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.2, delay: 0.3 }}
						viewport={{ once: true }}
						whileHover={{ scale: 1.05 }}>
						Analizuj <span className='text-mainColor'>dane</span>, by lepiej rozumieć{' '}
						<span className='text-mainColor'>klimat</span>!
					</motion.p>
				</div>
			</section>
		</div>
	)
}

export default BannerSection
