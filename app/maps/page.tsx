'use client'

import { useState, useRef } from 'react'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'
import MapsForm from '@/components/Forms/MapsForm'
import { useSidebar } from '@/components/contexts/SidebarProvider'
import PolandWeatherMap from '../../components/Maps/PolandWeatherMap' // Importujemy komponent mapy

type WeatherData = {
	id: number
	cityId: number
	cityName: string
	date: string
	maxTemperature: number
	minTemperature: number
	maxFeelTemperature: number
	minFeelTemperature: number
	totalPrecipitation: number
	rain: number
	rainSnow: number
	snow: number
	precipitationDuration: number
	weatherCode: number
	sunrise: string
	sunset: string
	sunlightDuration: number
	daylightDuration: number
	maxWindSpeed: number
	windGusts: number
	dominantWindDirection: number
	totalSolarRadiation: number
	evapotranspiration: number
}

const capitalsOfVoivodeships = [
	{ name: 'Białystok', latitude: 53.1325, longitude: 23.1688 },
	{ name: 'Bydgoszcz', latitude: 53.1235, longitude: 18.0084 },
	{ name: 'Gdańsk', latitude: 54.352, longitude: 18.6466 },
	{ name: 'Gorzów Wielkopolski', latitude: 52.7368, longitude: 15.2288 },
	{ name: 'Katowice', latitude: 50.2649, longitude: 19.0238 },
	{ name: 'Kielce', latitude: 50.8661, longitude: 20.6286 },
	{ name: 'Kraków', latitude: 50.0647, longitude: 19.945 },
	{ name: 'Lublin', latitude: 51.2465, longitude: 22.5684 },
	{ name: 'Łódź', latitude: 51.7592, longitude: 19.456 },
	{ name: 'Olsztyn', latitude: 53.7784, longitude: 20.4801 },
	{ name: 'Opole', latitude: 50.6751, longitude: 17.9213 },
	{ name: 'Poznań', latitude: 52.4064, longitude: 16.9252 },
	{ name: 'Rzeszów', latitude: 50.0413, longitude: 21.999 },
	{ name: 'Szczecin', latitude: 53.4285, longitude: 14.5528 },
	{ name: 'Warszawa', latitude: 52.2297, longitude: 21.0122 },
	{ name: 'Wrocław', latitude: 51.1079, longitude: 17.0385 }
]

const WeatherMap = () => {
	const [selectedDate, setSelectedDate] = useState<string | null>(null)
	const [isFormSubmitted, setIsFormSubmitted] = useState(false)
	const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { sidebarContainer } = useSidebar()
	const resultsRef = useRef<HTMLDivElement | null>(null)

	const handleDateSubmit = async (date: string) => {
		setSelectedDate(date)
		setIsFormSubmitted(true)
		setLoading(true)
		setError(null)

		try {
			const response = await fetch(`http://localhost:8080/api/poland-weather?date=${date}`)
			if (!response.ok) throw new Error('Błąd pobierania danych pogodowych')
			const data = await response.json()
			setWeatherData(data)
			console.log(data)
		} catch (err: any) {
			setError(err.message || 'Wystąpił błąd')
			setWeatherData(null)
		} finally {
			setLoading(false)
			setTimeout(() => {
				resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
				setTimeout(() => {
					window.scrollBy({ top: 150, left: 0, behavior: 'smooth' })
				}, 300)
			}, 300)
		}
	}

	return (
		<section className={sidebarContainer}>
			<div className='flex flex-col justify-center items-center px-4 sm:px-6'>
				<PlatformSectionTitle title='Pogoda na mapie' />
				<div className='w-full max-w-md flex flex-col justify-center items-center'>
					<p className='font-thin my-5 text-center text-lg'>
						Wybierz datę, aby zobaczyć dane pogodowe na mapie dla wybranych miast Polski!
					</p>
					<MapsForm onSubmit={handleDateSubmit} />
				</div>

				<div ref={resultsRef} className='mt-10 w-full'>
					{loading && <p className='text-center text-white'>Ładowanie danych...</p>}

					{error && <p className='text-center text-red-400'>Błąd: {error}</p>}

					{isFormSubmitted && selectedDate && weatherData && (
						<div className='text-white text-center'>
							<p className='mb-4 text-lg'>
								Dane pogodowe na dzień: <strong>{selectedDate}</strong>
							</p>

							{/* Dodajemy mapę z danymi */}
							<PolandWeatherMap data={weatherData} />
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default WeatherMap
