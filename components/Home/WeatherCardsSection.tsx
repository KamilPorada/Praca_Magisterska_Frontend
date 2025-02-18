'use client'

import { useEffect, useState } from 'react'
import TodayWeatherCard from './TodayWeatherCard'
import SectionTitle from '../UI/SectionTitle'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface WeatherProps {
	city: string
	temperature_2m: number
	relative_humidity_2m: number
	is_day: boolean
	weather_code: number
	surface_pressure: number
	wind_speed_10m: number
	sunrise1: string
	sunset1: string
	sunrise2: string
	sunset2: string
	longitude: number
	latitude: number
}

const cities = [
	{ city: 'Warszawa', latitude: 52.2298, longitude: 21.0122 },
	{ city: 'Kraków', latitude: 50.0647, longitude: 19.9445 },
	{ city: 'Łódź', latitude: 51.7592, longitude: 19.456 },
	{ city: 'Wrocław', latitude: 51.1079, longitude: 17.0385 },
	{ city: 'Poznań', latitude: 52.4064, longitude: 16.9252 },
	{ city: 'Gdańsk', latitude: 54.352, longitude: 18.6466 },
	{ city: 'Szczecin', latitude: 53.4285, longitude: 14.5528 },
	{ city: 'Bydgoszcz', latitude: 53.1235, longitude: 18.0084 },
	{ city: 'Lublin', latitude: 51.2465, longitude: 22.5684 },
	{ city: 'Katowice', latitude: 50.2706, longitude: 19.0399 },
	{ city: 'Białystok', latitude: 53.1325, longitude: 23.1688 },
	{ city: 'Rzeszów', latitude: 50.0412, longitude: 21.9991 },
	{ city: 'Suwałki', latitude: 54.1111, longitude: 22.9301 },
	{ city: 'Zakopane', latitude: 49.2992, longitude: 19.9496 },
]

export default function WeatherCardsSection() {
	const [weatherDataList, setWeatherDataList] = useState<WeatherProps[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchWeatherData = async () => {
			try {
				const responses = await Promise.all(
					cities.map(async city => {
						const response = await fetch(
							`http://localhost:8080/api/weather?latitude=${city.latitude}&longitude=${city.longitude}`
						)
						const data = await response.json()

						return {
							city: city.city,
							latitude: data.latitude,
							longitude: data.longitude,
							temperature_2m: data.current.temperature_2m,
							relative_humidity_2m: data.current.relative_humidity_2m,
							is_day: data.current.is_day,
							weather_code: data.current.weather_code,
							surface_pressure: data.current.surface_pressure,
							wind_speed_10m: data.current.wind_speed_10m,
							sunrise1: data.daily.sunrise[0],
							sunset1: data.daily.sunset[0],
							sunrise2: data.daily.sunrise[1],
							sunset2: data.daily.sunset[1],
						}
					})
				)
				setWeatherDataList(responses)
			} catch (error) {
				console.error('Błąd pobierania danych pogodowych:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchWeatherData()
	}, [])

	// Konfiguracja karuzeli
	const settings = {
		dots: true, // Kropki nawigacyjne
		infinite: true, // Zapętlenie
		speed: 1000, // Czas animacji (ms)
		slidesToShow: 3, // Ile kart na raz (możesz zmniejszyć na mobile)
		slidesToScroll: 1, // Ile przesuwa za jednym razem
		autoplay: true, // Automatyczne przewijanie
		autoplaySpeed: 3000, // Co ile ms zmieniać kartę
		arrows: true, // Strzałki
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

	return (
		<section className='container py-16' id='weathercards'>
			<SectionTitle title={'Aktualna prognoza'} />
			{loading ? (
				<p className='mt-10'>Ładowanie danych...</p>
			) : (
				<div className='mt-10'>
					<Slider {...settings} className='custom-slider'>
						{weatherDataList.map(weather => (
							<div key={weather.city} className='px-4'>
								<TodayWeatherCard weather={weather} />
							</div>
						))}
					</Slider>
				</div>
			)}
			<p className='text-center mt-20 text-xs md:text-sm lg:text-base font-thin px-4'>
				Ciekawi Cię, jak zmieniała się pogoda w Twoim mieście na przestrzeni lat?
				<br />
				<span className='ml-2 font-bold transition-colors duration-300 ease-in-out hover:text-mainColor'>
					<a href='#jointous'>Zarejestruj się</a>
				</span>
				, aby odkryć pełnię możliwości!
			</p>
		</section>
	)
}
