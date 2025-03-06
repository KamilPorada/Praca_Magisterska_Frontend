import { useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'

import Header from '@/components/Home/Header'
import HeroSection from '@/components/Home/HeroSection'
import AboutUs from '@/components/Home/AboutUsSection'
import WeatherCardsSection from '@/components/Home/WeatherCardsSection'
import JoinToUsSection from '@/components/Home/JoinToUsSection'
import OurAchievements from '@/components/Home/OurAchievements'
import SpecialistsSection from '@/components/Home/SpecialistsSection'
import BannerSection from '@/components/Home/BannerSection'
import Footer from '@/components/Home/Footer'
import Sidebar from '@/components/Navigation/Sidebar'

export default function LandingPageContenet() {
	const { data: session, status } = useSession()

	if (status === 'loading') {
		return (
			<div className='flex flex-col items-center mt-10'>
				<FontAwesomeIcon icon={faSun} spin className='text-yellow-400 w-12 h-12' />
				<p className='text-lg text-white  mt-2'>Ładowanie danych pogodowych...</p>
			</div>
		)
	}

	return !session ? (
		<section className='flex flex-col flex-wrap justify-center'>
			<Header />
			<HeroSection />
			<AboutUs />
			<WeatherCardsSection />
			<JoinToUsSection />
			<OurAchievements />
			<BannerSection />
			<SpecialistsSection />
			<Footer />
		</section>
	) : (
		''
	)
}
