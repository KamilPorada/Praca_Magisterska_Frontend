'use client'

import { useState, useEffect, useRef } from 'react'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'
import ComparisonForm from '@/components/Forms/ComparisonForm'
import { useSidebar } from '@/components/contexts/SidebarProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faAnglesRight,
	faCity,
	faCompass,
	faDroplet,
	faForward,
	faHourglass,
	faLeaf,
	faMoon,
	faSnowflake,
	faSun,
	faTemperatureEmpty,
	faTemperatureFull,
	faWind,
} from '@fortawesome/free-solid-svg-icons'

type WeatherData = {
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

type City = {
	id: number
	name: string
	population: number
	area: number
	population_density: number
	longitude: number
	latitude: number
	voivodeship: {
		id: number
		name: string
		capital: string
		area: number
		population: number
		density: number
		county_count: number
		commune_count: number
	}
}

type ComparisonEntry = {
	larger: string
	difference: number
}

type ComparisonResult = {
	city1: City
	city2: City
	comparison: { [key: string]: ComparisonEntry }
}

const ComparisonPage = () => {
	const [weatherData1, setWeatherData1] = useState<WeatherData[]>([])
	const [weatherData2, setWeatherData2] = useState<WeatherData[]>([])
	const [date, setDate] = useState<string>()
	const [cities, setCities] = useState<City[]>([])
	const [result, setResult] = useState<ComparisonResult | null>(null)
	const [loading, setLoading] = useState(false)
	const [isFormSubmitted, setIsFormSubmitted] = useState(false)
	const { sidebarContainer } = useSidebar()
	const resultRef = useRef<HTMLDivElement | null>(null)

	const columnNameMap: { [key: string]: string } = {
		maxTemperature: 'maksymalna temperatura',
		minTemperature: 'minimalna temperatura',
		maxFeelTemperature: 'maksymalna odczuwalna temperatura',
		minFeelTemperature: 'minimalna odczuwalna temperatura',
		totalPrecipitation: 'całkowite opady',
		rain: 'deszcz',
		rainSnow: 'deszcz/śnieg',
		snow: 'śnieg',
		precipitationDuration: 'czas opadów',
		weatherCode: 'kod pogody',
		sunlightDuration: 'czas nasłonecznienia',
		daylightDuration: 'czas światła dziennego',
		maxWindSpeed: 'maksymalna prędkość wiatru',
		windGusts: 'porywy wiatru',
		dominantWindDirection: 'dominujący kierunek wiatru',
		totalSolarRadiation: 'całkowite promieniowanie słoneczne',
		evapotranspiration: 'ewapotranspiracja',
	}

	useEffect(() => {
		const fetchCities = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/cities')
				const data = await response.json()
				const sorted = data.sort((a: City, b: City) => a.name.localeCompare(b.name))
				setCities(sorted)
			} catch (error) {
				console.error('Błąd pobierania miast:', error)
			}
		}

		fetchCities()
	}, [])

	const handleSubmit = async (formData: { cityId1: number; cityId2: number; date: string }) => {
		setLoading(true)
		setIsFormSubmitted(false)

		try {
			const queryParams = new URLSearchParams({
				cityId1: String(formData.cityId1),
				cityId2: String(formData.cityId2),
				date: formData.date,
			})

			const response = await fetch(`http://localhost:8080/api/compare?${queryParams}`)
			const data = await response.json()
			setResult(data)
			setIsFormSubmitted(true)
			setDate(formData.date)

			const response1 = await fetch(
				`http://localhost:8080/api/daily-weather?cityId=${String(formData.cityId1)}&startDate=${
					formData.date
				}&endDate=${formData.date}`
			)
			const response2 = await fetch(
				`http://localhost:8080/api/daily-weather?cityId=${String(formData.cityId2)}&startDate=${
					formData.date
				}&endDate=${formData.date}`
			)

			if (!response1.ok || !response2.ok) {
				throw new Error('Failed to fetch weather data for one or both cities')
			}

			const data1 = await response1.json()
			const data2 = await response2.json()
			setWeatherData1(data1)
			setWeatherData2(data2)

			setTimeout(() => {
				resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
				setTimeout(() => {
					window.scrollBy({ top: 150, left: 0, behavior: 'smooth' })
				}, 300)
			}, 300)
		} catch (error) {
			console.error('Błąd podczas porównywania miast:', error)
		} finally {
			setLoading(false)
		}
	}

	const renderComparisonResult = () => {
		if (!result || !result.comparison) {
			return <div className='text-white mt-6'>Brak wyników porównania.</div>
		}

		const getColor = (winner: string) => {
			if (winner === result.city1.name) return 'bg-green-600'
			if (winner === result.city2.name) return 'bg-blue-600'
			return 'bg-gray-500'
		}

		function formatDate(dateString: string): string {
			const date = new Date(dateString) // Tworzymy obiekt Date z daty w formacie YYYY-MM-DD
			const day = String(date.getDate()).padStart(2, '0') // Pobieramy dzień i dodajemy wiodące zero, jeśli to konieczne
			const month = String(date.getMonth() + 1).padStart(2, '0') // Pobieramy miesiąc (dodajemy 1, ponieważ miesiące są indeksowane od 0) i dodajemy wiodące zero
			const year = date.getFullYear() // Pobieramy pełny rok

			return `${day}.${month}.${year}` // Łączymy dzień, miesiąc i rok w wymagany format
		}

		const selectedCityWeather1 = date
			? weatherData1.find(item => formatDate(item.date) === formatDate(date))
			: undefined
		const selectedCityWeather2 = date
			? weatherData2.find(item => formatDate(item.date) === formatDate(date))
			: undefined

		const isDaylightSavingTime = (date: Date) => {
			// Funkcja do obliczania, czy data mieści się w okresie letnim (od ostatniej niedzieli marca do ostatniej niedzieli października)
			const year = date.getFullYear()
			const lastSundayMarch = new Date(year, 2, 31 - new Date(year, 2, 31).getDay()) // ostatnia niedziela marca
			const lastSundayOctober = new Date(year, 9, 31 - new Date(year, 9, 31).getDay()) // ostatnia niedziela października

			// Sprawdzamy, czy data mieści się pomiędzy ostatnią niedzielą marca a ostatnią niedzielą października
			return date >= lastSundayMarch && date <= lastSundayOctober
		}

		const adjustSunTimeForDST = (time: string) => {
			const date = new Date(time)
			// Jeśli czas letni, dodajemy godzinę
			if (isDaylightSavingTime(date)) {
				date.setHours(date.getHours() + 1)
			}
			return date.toLocaleTimeString('pl-PL', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			})
		}

		const formatSecondsToHoursMinutes = (seconds: number) => {
			const hours = Math.floor(seconds / 3600)
			const minutes = Math.floor((seconds % 3600) / 60)
			return `${hours}h ${minutes}min`
		}

		const degreesToWindDirection = (degrees: number) => {
			const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
			const index = Math.round(degrees / 45) % 8
			return windDirections[index]
		}

		return (
			<div ref={resultRef} className='bg-gray-900 text-white p-4 sm:p-6 rounded-xl shadow-lg w-full my-10'>
				<h2 className='text-xl font-thin text-center mb-6'>
					Porównanie warunków pogodowych dla miast
					<br />
					<span className='font-bold'>{result.city1.name}</span> oraz{' '}
					<span className='font-bold'>{result.city2.name}</span>
					<br />z dnia <span className='font-bold'>{date ? formatDate(date) : 'Brak daty'}</span>
				</h2>

				<div className='flex flex-row justify-center items-center gap-5'>
					<div className='flex flex-col justify-center items-center relative bg-gray-800 rounded-xl shadow-md px-5 py-10 overflow-hidden'>
						<div className='absolute top-0 w-full h-[5px] bg-mainColor'></div>
						<div className='flex justify-center items-center w-[120px] h-[120px] bg-gray-300 [clip-path:polygon(30%_0%,_70%_0%,_100%_30%,_100%_70%,_70%_100%,_30%_100%,_0%_70%,_0%_30%)]'>
							<div className='flex justify-center items-center w-[117px] h-[117px] p-5 bg-mainColor [clip-path:polygon(30%_0%,_70%_0%,_100%_30%,_100%_70%,_70%_100%,_30%_100%,_0%_70%,_0%_30%)]'>
								<FontAwesomeIcon icon={faCity} className='w-full h-full text-white p-2' />
							</div>
						</div>

						<div className='flex flex-col justify-center items-center py-6 pr-2 bg-slate-700 rounded-md ring-1 ring-gray-400'>
							<p className='uppercase font-bold leading-3 text-lg'>{result.city1.name}</p>
							<p className='lowercase font-thin'>{result.city1.voivodeship.name}</p>
							<div className='flex flex-row justify-center items-center mt-2'>
								<div className='flex flex-col justify-center items-center gap-2'>
									<p className='-mb-3'>&nbsp;&nbsp;&nbsp;Populacja:&nbsp;&nbsp;&nbsp;</p>

									<p className='font-thin text-sm'> {Math.round(result.city1.population / 1000)} tyś.os.</p>
								</div>

								<div className='flex flex-col justify-center items-center gap-2 w-[200px]'>
									<p className='-mb-3'>Stolica województwa:</p>
									<p className='font-thin text-sm'> {result.city1.voivodeship.capital}</p>
								</div>
								<div className='flex flex-col justify-center items-center gap-2'>
									<p className='-mb-3'>Powierzchnia:</p>
									<p className='font-thin text-sm'>{result.city1.area} km²</p>
								</div>
							</div>
						</div>
						<div className='flex flex-row justify-evenly items-center w-full'>
							<div className='flex flex-col justify-center items-center'>
								<div className='w-2 h-4 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-1 h-3 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-2 h-4 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-1 h-3 ring-1 ring-gray-400 rounded-full'></div>
							</div>
							<div className='flex flex-col justify-center items-center'>
								<div className='w-2 h-4 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-1 h-3 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-2 h-4 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-1 h-3 ring-1 ring-gray-400 rounded-full'></div>
							</div>
						</div>
						<div className='flex flex-col justify-center items-center p-4 bg-slate-700 rounded-md ring-1 ring-gray-400 w-full'>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full '>
								<p className='text-xs font-thin'>Temperatura:</p>
								<div className='flex flex-row justify-center items-center gap-2'>
									<p className='text-sm'>
										{selectedCityWeather1
											? `${((selectedCityWeather1.maxTemperature + selectedCityWeather1.minTemperature) / 2).toFixed(
													1
											  )}°C`
											: ''}
									</p>
									<p className='leading-4'>|</p>
									<p>{result.comparison['maxTemperature']?.larger === result.city1.name ? '+' : '-'}</p>
								</div>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Opady deszczu:</p>
								<div className='flex flex-row justify-center items-center gap-2'>
									<p className='text-sm'>{selectedCityWeather1?.rain}mm</p>
									<p className='leading-4'>|</p>
									<p
										className={`text-sm ${
											result.comparison['rain']?.larger === result.city1.name ? 'text-green-500' : 'text-red-500'
										}`}>
										{result.comparison['rain']?.larger === result.city1.name
											? '+' + result.comparison['rain'].difference.toFixed(1) + 'mm'
											: '-' + result.comparison['rain'].difference.toFixed(1) + 'mm'}
									</p>
								</div>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Opady śniegu:</p>
								<p className='text-sm'>{selectedCityWeather1?.snow}mm</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Czas trwania opadów:</p>
								<p className='text-sm'>{selectedCityWeather1?.precipitationDuration}h</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Wschód słońca:</p>
								<p className='text-sm'>
									{selectedCityWeather1?.sunrise ? adjustSunTimeForDST(selectedCityWeather1.sunrise) : ''}
								</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Zachód słońca:</p>
								<p className='text-sm'>
									{selectedCityWeather1?.sunset ? adjustSunTimeForDST(selectedCityWeather1.sunset) : ''}
								</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Czas nasłonecznienia:</p>
								<p className='text-sm'>
									{selectedCityWeather1?.sunlightDuration !== undefined
										? formatSecondsToHoursMinutes(selectedCityWeather1.sunlightDuration)
										: ''}
								</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Prędkość wiatru:</p>
								<p className='text-sm'>{selectedCityWeather1?.maxWindSpeed}km/h</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Kierunek wiatru:</p>
								<p className='text-sm'>
									{selectedCityWeather1?.dominantWindDirection !== undefined
										? degreesToWindDirection(selectedCityWeather1.dominantWindDirection)
										: ''}
								</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Promieniowanie słoneczne:</p>
								<p className='text-sm'>{selectedCityWeather1?.totalSolarRadiation}MJ/m²</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-xs font-thin'>Ewapotranspiracja:</p>
								<p className='text-sm'>{selectedCityWeather1?.evapotranspiration}mm</p>
							</div>
						</div>
					</div>
					<p className='text-7xl text-white'>vs.</p>
					<div className='flex flex-col justify-center items-center relative bg-gray-800 rounded-xl shadow-md px-5 py-10 overflow-hidden'>
						<div className='absolute top-0 w-full h-[5px] bg-accentColor'></div>
						<div className='flex justify-center items-center w-[120px] h-[120px] bg-gray-300 [clip-path:polygon(30%_0%,_70%_0%,_100%_30%,_100%_70%,_70%_100%,_30%_100%,_0%_70%,_0%_30%)]'>
							<div className='flex justify-center items-center w-[117px] h-[117px] p-5 bg-accentColor [clip-path:polygon(30%_0%,_70%_0%,_100%_30%,_100%_70%,_70%_100%,_30%_100%,_0%_70%,_0%_30%)]'>
								<FontAwesomeIcon icon={faCity} className='w-full h-full text-white p-2' />
							</div>
						</div>

						<div className='flex flex-col justify-center items-center py-6 pr-2 bg-slate-700 rounded-md ring-1 ring-gray-400'>
							<p className='uppercase font-bold leading-3 text-lg'>{result.city2.name}</p>
							<p className='lowercase font-thin'>{result.city2.voivodeship.name}</p>
							<div className='flex flex-row justify-center items-center mt-2'>
								<div className='flex flex-col justify-center items-center gap-2'>
									<p className='-mb-3'>&nbsp;&nbsp;&nbsp;Populacja:&nbsp;&nbsp;&nbsp;</p>

									<p className='font-thin text-sm'> {Math.round(result.city2.population / 1000)} tyś.os.</p>
								</div>

								<div className='flex flex-col justify-center items-center gap-2 w-[200px]'>
									<p className='-mb-3'>Stolica województwa:</p>
									<p className='font-thin text-sm'> {result.city2.voivodeship.capital}</p>
								</div>
								<div className='flex flex-col justify-center items-center gap-2'>
									<p className='-mb-3'>Powierzchnia:</p>
									<p className='font-thin text-sm'>{result.city2.area} km²</p>
								</div>
							</div>
						</div>
						<div className='flex flex-row justify-center items-center gap-16 w-full'>
							<div className='flex flex-col justify-center items-center'>
								<div className='w-2 h-4 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-1 h-3 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-2 h-4 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-1 h-3 ring-1 ring-gray-400 rounded-full'></div>
							</div>
							<div className='flex flex-col justify-center items-center'>
								<div className='w-2 h-4 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-1 h-3 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-2 h-4 ring-1 ring-gray-400 rounded-full'></div>
								<div className='w-1 h-3 ring-1 ring-gray-400 rounded-full'></div>
							</div>
						</div>
						<div className='flex flex-col justify-center items-center p-6 bg-slate-700 rounded-md ring-1 ring-gray-400'>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<FontAwesomeIcon icon={faTemperatureEmpty} className='text-2xl text-red-500 drop-shadow-md' />
								<p className='text-sm'>
									{selectedCityWeather2
										? `${((selectedCityWeather2.maxTemperature + selectedCityWeather2.minTemperature) / 2).toFixed(
												1
										  )}°C`
										: ''}
								</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<FontAwesomeIcon icon={faDroplet} className='text-xl text-blue-400 drop-shadow-md' />
								<p className='text-sm'>{selectedCityWeather2?.rain}mm</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<FontAwesomeIcon icon={faSnowflake} className='text-xl text-cyan-300 drop-shadow-md' />
								<p className='text-sm'>{selectedCityWeather2?.snow}mm</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<div className='flex flex-row justify-center items-start'>
									<FontAwesomeIcon icon={faHourglass} className='text-lg text-yellow-700 drop-shadow-md' />
									<FontAwesomeIcon icon={faDroplet} className='text-xs text-blue-400 drop-shadow-md' />
								</div>
								<p className='text-sm'>{selectedCityWeather2?.precipitationDuration}h</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<FontAwesomeIcon icon={faSun} className='text-xl text-yellow-300 drop-shadow-md' />
								<p className='text-sm'>
									{selectedCityWeather2?.sunrise ? adjustSunTimeForDST(selectedCityWeather2.sunrise) : ''}
								</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<FontAwesomeIcon icon={faMoon} className='text-xl text-indigo-200 drop-shadow-md' />
								<p className='text-sm'>
									{selectedCityWeather2?.sunset ? adjustSunTimeForDST(selectedCityWeather2.sunset) : ''}
								</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<div className='flex flex-row justify-center items-start'>
									<FontAwesomeIcon icon={faHourglass} className='text-lg text-yellow-700 drop-shadow-md' />
									<FontAwesomeIcon icon={faSun} className='text-xs text-amber-300 drop-shadow-md' />
								</div>
								<p className='text-sm'>
									{selectedCityWeather2?.sunlightDuration !== undefined
										? formatSecondsToHoursMinutes(selectedCityWeather2.sunlightDuration)
										: ''}
								</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<FontAwesomeIcon icon={faWind} className='text-xl text-sky-400 drop-shadow-md' />
								<p className='text-sm'>{selectedCityWeather2?.maxWindSpeed}km/h</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<FontAwesomeIcon icon={faCompass} className='text-xl text-slate-400 drop-shadow-md' />
								<p className='text-sm'>
									{selectedCityWeather2?.dominantWindDirection !== undefined
										? degreesToWindDirection(selectedCityWeather2.dominantWindDirection)
										: ''}
								</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<div className='flex flex-row justify-center items-end'>
									<FontAwesomeIcon icon={faSun} className='text-lg text-amber-300 drop-shadow-md' />
									<FontAwesomeIcon icon={faAnglesRight} className='text-xs rotate-12 text-yellow-100 drop-shadow-md' />
								</div>
								<p className='text-sm'>{selectedCityWeather2?.totalSolarRadiation}MJ/m²</p>
							</div>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 p-1 w-40'>
								<FontAwesomeIcon icon={faLeaf} className='text-xl text-green-400 drop-shadow-md' />
								<p className='text-sm'>{selectedCityWeather2?.evapotranspiration}mm</p>
							</div>
						</div>
					</div>
				</div>

				{/* Miasta i województwa */}
				{/* <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
					<div className='bg-gray-800 p-5 rounded-md shadow'>
						<h3 className='text-xl font-semibold mb-2'>🏙 {result.city1.name}</h3>
						<p>
							<b>Województwo:</b> {result.city1.voivodeship.name}
						</p>
						<p>
							<b>Populacja:</b> {result.city1.population.toLocaleString()}
						</p>
						<p>
							<b>Powierzchnia:</b> {result.city1.area} km²
						</p>
					</div>
					<div className='bg-gray-800 p-5 rounded-md shadow'>
						<h3 className='text-xl font-semibold mb-2'>🏙 {result.city2.name}</h3>
						<p>
							<b>Województwo:</b> {result.city2.voivodeship.name}
						</p>
						<p>
							<b>Populacja:</b> {result.city2.population.toLocaleString()}
						</p>
						<p>
							<b>Powierzchnia:</b> {result.city2.area} km²
						</p>
					</div>
				</div> */}

				{/* Porównanie parametrów */}
				{/* <div className='space-y-4'>
					{Object.entries(result.comparison).map(([key, value]) => {
						const name = columnNameMap[key] || key
						const winnerColor = getColor(value.larger)
						const left = result.city1.name === value.larger
						return (
							<div key={key} className='bg-gray-800 p-4 rounded-md shadow'>
								<p className='text-sm text-gray-400 uppercase font-thin mb-2'>{name}</p>
								<div className='flex justify-between items-center mb-2 text-sm'>
									<span>{result.city1.name}</span>
									<span>{result.city2.name}</span>
								</div>
								<div className='w-full bg-gray-700 h-4 rounded-full relative overflow-hidden'>
									<div
										className={`${winnerColor} h-full transition-all`}
										style={{
											width: '50%',
											transform: `translateX(${left ? '-50%' : '50%'})`,
										}}></div>
								</div>
								<p className='mt-2 text-sm'>
									<b>{value.larger}</b> ma wyższą wartość o <b>{value.difference.toFixed(2)}</b>
								</p>
							</div>
						)
					})}
				</div> */}
			</div>
		)
	}

	return (
		<section className={sidebarContainer}>
			<div className='flex flex-col justify-center items-center px-4 sm:px-6'>
				<PlatformSectionTitle title='Porównanie miast' />
				<div className='w-full max-w-xl flex flex-col justify-center items-center'>
					<p className='font-thin my-5 text-center text-lg'>
						Wybierz dwa miasta i datę, aby porównać ich dane pogodowe.
					</p>
					<ComparisonForm onSubmit={handleSubmit} cities={cities} />
				</div>

				{loading && <p className='text-white mt-6'>Ładowanie wyników...</p>}
				{isFormSubmitted && renderComparisonResult()}
			</div>
		</section>
	)
}

export default ComparisonPage
