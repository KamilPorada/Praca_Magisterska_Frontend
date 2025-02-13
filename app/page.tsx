import AboutUs from '@/components/Home/AboutUsSection'
import Header from '@/components/Home/Header'
import HeroSection from '@/components/Home/HeroSection'
import TodayWeatherCard from '@/components/Home/TodayWeatherCard'
import JoinToUsSection from '@/components/Home/JoinToUsSection'
import OurAchievements from '@/components/Home/OurAchievements'
import SpecialistsSection from '@/components/Home/SpecialistsSection'

export default function Home() {
	return (
		<section className=' flex flex-col flex-wrap justify-center'>
			<Header />
			<HeroSection/>
      <AboutUs/>
      <TodayWeatherCard/>
      <JoinToUsSection/>
      <OurAchievements/>
      <SpecialistsSection/>
		</section>
	)
}
