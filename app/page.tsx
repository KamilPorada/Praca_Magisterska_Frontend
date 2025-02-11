import AboutUs from '@/components/Home/AboutUsSection'
import Header from '@/components/Home/Header'
import HeroSection from '@/components/Home/HeroSection'
import TodayWeatherCard from '@/components/Home/TodayWeatherCard'

export default function Home() {
	return (
		<section className=' flex flex-col flex-wrap justify-center'>
			<Header />
			<HeroSection/>
      <AboutUs/>
      <TodayWeatherCard/>
		</section>
	)
}
