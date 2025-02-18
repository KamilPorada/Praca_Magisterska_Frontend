'use client'
import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
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

const settings = {
	dots: true, 
	infinite: true, 
	speed: 1000, 
	slidesToShow: 3, 
	slidesToScroll: 1, 
	autoplay: true, 
	autoplaySpeed: 3000, 
	arrows: true, 
	responsive: [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			},
		},
	],
}

const SpecialistsSection = () => {
	return (
		<section className='bg-backgroundColor text-white container pt-8 md:pt-20' id='specialists'>
			<SectionTitle title='Użytkownicy platformy' />
			<div className='pt-8 md:pt-20 max-w-6xl mx-auto'>
				<Slider {...settings}>
					{specialists.map((spec, index) => (
						<div key={index} className='px-4'>
							<SpecialistItem {...spec} />
						</div>
					))}
				</Slider>
			</div>
		</section>
	)
}

export default SpecialistsSection
