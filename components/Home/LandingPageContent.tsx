
import { useSession } from 'next-auth/react'
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

	// Jeśli sesja jest ładowana, można dodać loader/spinner
	if (status === 'loading') {
		return <p className='text-center mt-10'>Ładowanie...</p>
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
		<Sidebar />
	)
}
