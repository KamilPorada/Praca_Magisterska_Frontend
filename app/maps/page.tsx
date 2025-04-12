'use client'

import { useState, useEffect, useRef } from 'react'
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

type City = {
    id: number
    name: string
    voivodeship_id: number
    population: number
    area: number
    population_density: number
    longitude: number
    latitude: number
  }

const WeatherMap = () => {
    const [cities, setCities] = useState<City[]>([])
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

    useEffect(() => {
        const fetchCities = async () => {
          try {
            const response = await fetch('http://localhost:8080/api/cities')
            const data = await response.json()
    
            const sortedData = data.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
    
            setCities(sortedData)
          } catch (error) {
            console.error('Error fetching cities:', error)
          }
        }
    
        fetchCities()
      }, [])

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
						

							{/* Dodajemy mapę z danymi */}
							<PolandWeatherMap data={weatherData} cities={cities} />
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default WeatherMap
