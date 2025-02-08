import Header from '@/components/Home/Header'
import HeroSection from '@/components/Home/HeroSection'

export default function Home() {
	return (
		<section className=' flex flex-col flex-wrap justify-center'>
			<Header />
			<HeroSection/>
		</section>
	)
}
