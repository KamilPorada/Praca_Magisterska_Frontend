import Header from '@/components/Home/Header'
import HeroSection from '@/components/Home/HeroSection'
import AboutUs from '@/components/Home/AboutUsSection'
import WeatherCardsSection from '@/components/Home/WeatherCardsSection'
import JoinToUsSection from '@/components/Home/JoinToUsSection'
import OurAchievements from '@/components/Home/OurAchievements'
import SpecialistsSection from '@/components/Home/SpecialistsSection'
import BannerSection from '@/components/Home/BannerSection'
import Footer from '@/components/Home/Footer'

export default function Home() {
	return (
		<section className='flex flex-col flex-wrap justify-center'>
			<Header />
			<HeroSection/>
      <AboutUs/>
      <WeatherCardsSection/>
      <JoinToUsSection/>
      <OurAchievements/>
      <BannerSection/>
      <SpecialistsSection/>
      <Footer/>
		</section>
	)
}
