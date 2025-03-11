'use client'
import { useState, useEffect } from 'react'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'
import DailyWeatherDataForm from '@/components/Forms/DailyWeatherDataForm'
import { useSidebar } from '../../components/contexts/SidebarProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCloudRain, faWind, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons'

type City = {
	id: number
	name: string
}

type DailyWeatherData = {
	id: number
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

const StatsData = () => {
	const [dailyData, setDailyData] = useState<DailyWeatherData[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [isFormSubmitted, setIsFormSubmitted] = useState(false)
	const [loading, setLoading] = useState(false)
	const { sidebarContainer } = useSidebar()

	const handleDataFetched = (data: DailyWeatherData[]) => {
		setLoading(true)
		setTimeout(() => {
			setDailyData(data)
			setIsFormSubmitted(true)
			setLoading(false)
		}, 1000)
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

	const calculateStats = (data: DailyWeatherData[]) => {
		if (data.length === 0) return null

		const avg = (arr: number[]) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)
		const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0).toFixed(2)
		const min = (arr: number[]) => Math.min(...arr).toFixed(2)
		const max = (arr: number[]) => Math.max(...arr).toFixed(2)

		return {
			temperature: {
				avg: avg(data.map(d => d.maxTemperature)),
				min: min(data.map(d => d.minTemperature)),
				max: max(data.map(d => d.maxTemperature))
			},
			precipitation: {
				total: sum(data.map(d => d.totalPrecipitation)),
				duration: sum(data.map(d => d.precipitationDuration))
			},
			wind: {
				avgSpeed: avg(data.map(d => d.maxWindSpeed)),
				maxSpeed: max(data.map(d => d.windGusts))
			},
			sunlight: {
				avgSunlight: avg(data.map(d => d.sunlightDuration / 3600)),
				avgDaylight: avg(data.map(d => d.daylightDuration / 3600))
			}
		}
	}

	const stats = calculateStats(dailyData)

	return (
		<section className={sidebarContainer}>
			<div className='flex flex-col justify-center items-center px-4 sm:px-6'>
				<PlatformSectionTitle title='Analiza statystyczna' />
				<div className='w-full max-w-md flex flex-col justify-center items-center'>
					<p className='font-thin my-5 text-center text-lg'>
						Wybierz miasto oraz zakres czasowy, aby przeprowadzić analizę statystyczną danych pogodowych!
					</p>
					<DailyWeatherDataForm cities={cities} onDataFetched={handleDataFetched} />
				</div>
				{loading ? (
					<div className='flex flex-col items-center mt-10'>
						<FontAwesomeIcon icon={faSun} spin size='2x' className='text-blue-500' />
						<p className='text-lg mt-2'>Analiza danych pogodowych w toku...</p>
					</div>
				) : isFormSubmitted && stats ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 w-full max-w-3xl text-black'>
						<div className='bg-blue-100 rounded-2xl p-4 flex items-center shadow-md'>
							<FontAwesomeIcon icon={faTemperatureHigh} className='text-blue-500 w-10 h-10 mr-4' />
							<div>
								<h3 className='text-lg font-bold'>Temperatura</h3>
								<p>Średnia: {stats.temperature.avg}°C</p>
								<p>Zakres: {stats.temperature.min}°C do {stats.temperature.max}°C</p>
							</div>
						</div>
						<div className='bg-blue-100 rounded-2xl p-4 flex items-center shadow-md'>
							<FontAwesomeIcon icon={faCloudRain} className='text-blue-500 w-10 h-10 mr-4' />
							<div>
								<h3 className='text-lg font-bold'>Opady</h3>
								<p>Suma: {stats.precipitation.total} mm</p>
								<p>Czas opadów: {stats.precipitation.duration} h</p>
							</div>
						</div>
						<div className='bg-blue-100 rounded-2xl p-4 flex items-center shadow-md'>
							<FontAwesomeIcon icon={faWind} className='text-blue-500 w-10 h-10 mr-4' />
							<div>
								<h3 className='text-lg font-bold'>Wiatr</h3>
								<p>Średnia prędkość: {stats.wind.avgSpeed} km/h</p>
								<p>Maksymalne porywy: {stats.wind.maxSpeed} km/h</p>
							</div>
						</div>
						<div className='bg-blue-100 rounded-2xl p-4 flex items-center shadow-md'>
							<FontAwesomeIcon icon={faSun} className='text-blue-500 w-10 h-10 mr-4' />
							<div>
								<h3 className='text-lg font-bold'>Nasłonecznienie</h3>
								<p>Średnie nasłonecznienie: {stats.sunlight.avgSunlight} h/dzień</p>
								<p>Średnia ilość światła dziennego: {stats.sunlight.avgDaylight} h/dzień</p>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</section>
	)
}

export default StatsData
