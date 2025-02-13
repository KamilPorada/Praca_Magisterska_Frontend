'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Pagination, Autoplay } from 'swiper/modules'
import SpecialistItem from './SpecialistItem'
import SectionTitle from '../UI/SectionTitle'

import EnergyImg from '../../public/img/specialist-energy-img.jpg'
import FarmerImg from '../../public/img/specialist-farmer-img.jpg'
import HydrologistImg from '../../public/img/specialist-hydrologist-img.jpg'
import PilotImg from '../../public/img/specialist-pilot-img.jpg'
import BuilderImg from '../../public/img/specialist-builder-img.jpg'
import StudentImg from '../../public/img/specialist-student-img.jpg'
import EcologistImg from '../../public/img/specialist-ecologist-img.jpg'
import InfrastructureImg from '../../public/img/specialist-infrastructure-img.jpg'

const specialists = [
	{
		image: EnergyImg,
		title: 'Sektor energetyczny',
		group: 'Energetyka',
		description: 'Firmy analizują wpływ pogody na produkcję energii.',
	},
	{
		image: FarmerImg,
		title: 'Firmy agrotechnologiczne',
		group: 'Rolnictwo',
		description: 'Integracja danych pogodowych w zarządzaniu uprawami.',
	},
	{
		image: HydrologistImg,
		title: 'Służby hydrologiczne',
		group: 'Hydrologia',
		description: 'Monitorowanie poziomu wód i zarządzanie zasobami wodnymi.',
	},
	{
		image: PilotImg,
		title: 'Lotniska i linie lotnicze',
		group: 'Transport lotniczy',
		description: 'Lepsze planowanie lotów i zwiększenie bezpieczeństwa.',
	},
	{
		image: BuilderImg,
		title: 'Firmy budowlane',
		group: 'Budownictwo',
		description: 'Optymalizacja harmonogramów i minimalizacja ryzyka pogodowego.',
	},
	{
		image: StudentImg,
		title: 'Uniwersytety i ośrodki badawcze',
		group: 'Edukacja',
		description: 'Badania nad klimatem i prognozowaniem pogody.',
	},
	{
		image: EcologistImg,
		title: 'Organizacje ekologiczne',
		group: 'Ekologia',
		description: 'Monitorowanie zmian środowiskowych i planowanie działań.',
	},
	{
		image: InfrastructureImg,
		title: 'Zarządcy dróg i transportu',
		group: 'Infrastruktura',
		description: 'Zarządzanie infrastrukturą drogową i planowanie działań.',
	},
]

const SpecialistsSection = () => {
	return (
		<section className='bg-backgroundColor text-white container pt-8 md:pt-20'>
			<SectionTitle title='Użytkownicy platformy' />
			<div className='pt-8 md:pt-20'>
				<Swiper
					modules={[Pagination, Autoplay]}
					pagination={{ clickable: true }}
					loop={true} // Zapętlenie karuzeli
					autoplay={{ delay: 3000, disableOnInteraction: false }} // Automatyczne przewijanie co 3 sekundy
					spaceBetween={20}
					slidesPerView={1}
					breakpoints={{
						640: { slidesPerView: 2 },
						1024: { slidesPerView: 3 },
					}}
					className='max-w-6xl mx-auto'>
					{specialists.map((spec, index) => (
						<SwiperSlide key={index}>
							<SpecialistItem {...spec} />
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	)
}

export default SpecialistsSection
