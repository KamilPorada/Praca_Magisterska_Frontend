'use client'

import { useState, useEffect, useRef } from 'react'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'
import ComparisonForm from '@/components/Forms/ComparisonForm'
import { useSidebar } from '@/components/contexts/SidebarProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faCity,
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

		function formatDate(dateString: string): string {
			const date = new Date(dateString) 
			const day = String(date.getDate()).padStart(2, '0')
			const month = String(date.getMonth() + 1).padStart(2, '0') 
			const year = date.getFullYear()

			return `${day}.${month}.${year}`
		}

		const selectedCityWeather1 = date
			? weatherData1.find(item => formatDate(item.date) === formatDate(date))
			: undefined
		const selectedCityWeather2 = date
			? weatherData2.find(item => formatDate(item.date) === formatDate(date))
			: undefined

		const isDaylightSavingTime = (date: Date) => {
			const year = date.getFullYear()
			const lastSundayMarch = new Date(year, 2, 31 - new Date(year, 2, 31).getDay()) 
			const lastSundayOctober = new Date(year, 9, 31 - new Date(year, 9, 31).getDay())
			return date >= lastSundayMarch && date <= lastSundayOctober
		}

		const adjustSunTimeForDST = (time: string) => {
			const date = new Date(time)
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
			<div ref={resultRef} className='bg-gray-900 text-white p-4 rounded-xl shadow-lg w-full my-10'>
				<h2 className='lg:text-xl font-thin text-center mb-6'>
					Porównanie warunków pogodowych dla miast
					<br />
					<span className='font-bold'>{result.city1.name}</span> oraz{' '}
					<span className='font-bold'>{result.city2.name}</span>
					<br />z dnia <span className='font-bold'>{date ? formatDate(date) : 'Brak daty'}</span>
				</h2>

				<div className='flex flex-col lg:flex-row justify-center items-center gap-5'>
					<div className='flex flex-col justify-center items-center relative bg-gray-800 rounded-xl shadow-md px-1 lg:px-5 py-5 lg:py-10 overflow-hidden'>
						<div className='absolute top-0 w-full h-[5px] bg-mainColor'></div>
						<div className='flex justify-center items-center w-[80px] h-[80px] lg:w-[120px] lg:h-[120px] bg-gray-300 [clip-path:polygon(30%_0%,_70%_0%,_100%_30%,_100%_70%,_70%_100%,_30%_100%,_0%_70%,_0%_30%)]'>
							<div className='flex justify-center items-center lg:w-[117px] lg:h-[117px] w-[77px] h-[77px] p-5 bg-mainColor [clip-path:polygon(30%_0%,_70%_0%,_100%_30%,_100%_70%,_70%_100%,_30%_100%,_0%_70%,_0%_30%)]'>
								<FontAwesomeIcon icon={faCity} className='w-full h-full text-white p-2' />
							</div>
						</div>

						<div className='flex flex-col justify-center items-center py-6 lg:pr-2 bg-slate-700 rounded-md ring-1 ring-gray-400'>
							<p className='uppercase font-bold leading-3 text-sm lg:text-lg'>{result.city1.name}</p>
							<p className='lowercase font-thin text-xs lg:text-base'>{result.city1.voivodeship.name}</p>
							<div className='flex flex-col lg:flex-row justify-center items-center mt-2'>
								<div className='flex flex-col justify-center items-center gap-2'>
									<p className='-mb-3 text-sm lg:text-base'>&nbsp;&nbsp;&nbsp;Populacja:&nbsp;&nbsp;&nbsp;</p>

									<p className='font-thin text-xs lg:text-sm'> {Math.round(result.city1.population / 1000)} tyś.os.</p>
								</div>

								<div className='flex flex-col justify-center items-center gap-2 w-[200px]'>
									<p className='-mb-3 text-sm lg:text-base'>Stolica województwa:</p>
									<p className='font-thin text-xs lg:text-sm'> {result.city1.voivodeship.capital}</p>
								</div>
								<div className='flex flex-col justify-center items-center gap-2'>
									<p className='-mb-3 text-sm lg:text-base'>Powierzchnia:</p>
									<p className='font-thin text-xs lg:text-sm'>{result.city1.area} km²</p>
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
						<div className='flex flex-col justify-center items-center p-2 lg:p-4 bg-slate-700 rounded-md ring-1 ring-gray-400 w-full'>
							<p className='mb-2 font-thin uppercase text-sm'>Warunki pogodowe</p>
							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full '>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Temperatura:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather1
											? `${((selectedCityWeather1.maxTemperature + selectedCityWeather1.minTemperature) / 2).toFixed(
													1
											  )}°C`
											: ''}
									</p>
									{selectedCityWeather1 && selectedCityWeather2 && result.comparison['maxTemperature']
										? (() => {
												const avg1 = (selectedCityWeather1.maxTemperature + selectedCityWeather1.minTemperature) / 2
												const avg2 = (selectedCityWeather2.maxTemperature + selectedCityWeather2.minTemperature) / 2
												const diff = Math.abs(+(avg1 - avg2).toFixed(1)) 
												const isNeutral = diff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['maxTemperature'].larger === result.city1.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0°C'
															: `${
																	result.comparison['maxTemperature'].larger === result.city1.name ? '+' : '-'
															  }${diff}°C`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Opady deszczu:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather1?.rain}mm</p>
									{result.comparison['rain']
										? (() => {
												const rainDiff = result.comparison['rain'].difference
												const isNeutral = rainDiff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['rain'].larger === result.city1.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0mm'
															: `${
																	result.comparison['rain'].larger === result.city1.name ? '+' : '-'
															  }${rainDiff.toFixed(2)}mm`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Opady śniegu:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather1?.snow}mm</p>
									{result.comparison['snow']
										? (() => {
												const snowDiff = result.comparison['snow'].difference
												const isNeutral = snowDiff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['snow'].larger === result.city1.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0mm'
															: `${
																	result.comparison['snow'].larger === result.city1.name ? '+' : '-'
															  }${snowDiff.toFixed(2)}mm`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Czas opadów:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather1?.precipitationDuration}h</p>
									{result.comparison['precipitationDuration']
										? (() => {
												const durationDiff = result.comparison['precipitationDuration'].difference
												const isNeutral = durationDiff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['precipitationDuration'].larger === result.city1.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0h'
															: `${
																	result.comparison['precipitationDuration'].larger === result.city1.name ? '+' : '-'
															  }${durationDiff.toFixed(1)}h`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Wschód słońca:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather1?.sunrise ? adjustSunTimeForDST(selectedCityWeather1.sunrise) : ''}
									</p>
									{selectedCityWeather1?.sunrise && selectedCityWeather2?.sunrise
										? (() => {
												const getMinutesFromTime = (time: string): number => {
													if (time.includes('T')) {
														const date = new Date(time)
														return date.getHours() * 60 + date.getMinutes()
													}
													const [h, m] = time.split(':').map(Number)
													if (isNaN(h) || isNaN(m)) return NaN
													return h * 60 + m
												}

												const t1 = getMinutesFromTime(selectedCityWeather1.sunrise)
												const t2 = getMinutesFromTime(selectedCityWeather2.sunrise)

												if (isNaN(t1) || isNaN(t2)) {
													return <p className='text-xs lg:text-sm text-yellow-400'>Błąd danych</p>
												}

												const diff = Math.abs(t1 - t2)
												const isNeutral = diff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral ? 'text-yellow-400' : t1 < t2 ? 'text-red-500' : 'text-green-500'
														}`}>
														{isNeutral ? '0 min' : `${t1 < t2 ? '-' : '+'}${diff} min`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Zachód słońca:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather1?.sunset ? adjustSunTimeForDST(selectedCityWeather1.sunset) : ''}
									</p>
									{selectedCityWeather1?.sunset && selectedCityWeather2?.sunset
										? (() => {
												const getMinutesFromTime = (time: string): number => {
													if (time.includes('T')) {
														const date = new Date(time)
														return date.getHours() * 60 + date.getMinutes()
													}
													const [h, m] = time.split(':').map(Number)
													if (isNaN(h) || isNaN(m)) return NaN
													return h * 60 + m
												}

												const t1 = getMinutesFromTime(selectedCityWeather1.sunset)
												const t2 = getMinutesFromTime(selectedCityWeather2.sunset)

												if (isNaN(t1) || isNaN(t2)) {
													return <p className='text-xs lg:text-sm text-yellow-400'>Błąd danych</p>
												}

												const diff = Math.abs(t1 - t2)
												const isNeutral = diff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral ? 'text-yellow-400' : t1 > t2 ? 'text-green-500' : 'text-red-500'
														}`}>
														{isNeutral ? '0 min' : `${t1 > t2 ? '+' : '-'}${diff} min`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Nasłonecznienie:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather1?.sunlightDuration !== undefined
											? formatSecondsToHoursMinutes(selectedCityWeather1.sunlightDuration)
											: ''}
									</p>
									{result.comparison['sunlightDuration']
										? (() => {
												const durationDiffSeconds = result.comparison['sunlightDuration'].difference
												const isNeutral = durationDiffSeconds === 0

												const getFormattedDiff = (seconds: number): string => {
													const abs = Math.abs(seconds)
													const h = Math.floor(abs / 3600)
													const m = Math.floor((abs % 3600) / 60)
													return `${h}h ${m}min`
												}

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['sunlightDuration'].larger === result.city1.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0h'
															: `${
																	result.comparison['sunlightDuration'].larger === result.city1.name ? '+' : '-'
															  }${getFormattedDiff(durationDiffSeconds)}`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Prędkość wiatru:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather1?.maxWindSpeed}km/h</p>
									{result.comparison['maxWindSpeed']
										? (() => {
												const windSpeedDiff = result.comparison['maxWindSpeed'].difference
												const isNeutral = windSpeedDiff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['maxWindSpeed'].larger === result.city1.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0km/h'
															: `${
																	result.comparison['maxWindSpeed'].larger === result.city1.name ? '+' : '-'
															  }${Math.abs(windSpeedDiff).toFixed(1)}km/h`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Kierunek wiatru:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather1?.dominantWindDirection !== undefined
											? selectedCityWeather1.dominantWindDirection +
											  '° (' +
											  degreesToWindDirection(selectedCityWeather1.dominantWindDirection) +
											  ')'
											: ''}
									</p>
									{selectedCityWeather1?.dominantWindDirection !== undefined &&
									selectedCityWeather2?.dominantWindDirection !== undefined ? (
										(() => {
											const windDirectionDiff = Math.abs(
												selectedCityWeather1.dominantWindDirection - selectedCityWeather2.dominantWindDirection
											)

											const isNeutral = windDirectionDiff === 0

											return (
												<p
													className={`text-xs lg:text-sm ${
														isNeutral
															? 'text-yellow-400'
															: selectedCityWeather1?.dominantWindDirection >
															  selectedCityWeather2?.dominantWindDirection
															? 'text-green-500'
															: 'text-red-500'
													}`}>
													{isNeutral
														? '0°'
														: `${
																selectedCityWeather1?.dominantWindDirection >
																selectedCityWeather2?.dominantWindDirection
																	? '+'
																	: '-'
														  }${Math.abs(windDirectionDiff).toFixed(0)}°`}
												</p>
											)
										})()
									) : (
										<p className='text-xs lg:text-sm text-gray-400'>Brak danych</p>
									)}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Radiacja słońca:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather1?.totalSolarRadiation} MJ/m²</p>
									{result.comparison['totalSolarRadiation'] ? (
										(() => {
											const radiationDiff = result.comparison['totalSolarRadiation'].difference
											const isNeutral = radiationDiff === 0

											return (
												<p
													className={`text-xs lg:text-sm ${
														isNeutral
															? 'text-yellow-400'
															: result.comparison['totalSolarRadiation'].larger === result.city1.name
															? 'text-green-500'
															: 'text-red-500'
													}`}>
													{isNeutral
														? '0.0 MJ/m²'
														: `${
																result.comparison['totalSolarRadiation'].larger === result.city1.name ? '+' : '-'
														  }${Math.abs(radiationDiff).toFixed(2)} MJ/m²`}
												</p>
											)
										})()
									) : (
										<p className='text-xs lg:text-sm text-gray-400'>Brak danych</p> 
									)}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Ewapotranspiracja:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather1?.evapotranspiration} mm</p>
									{result.comparison['evapotranspiration'] ? (
										(() => {
											const evapotranspirationDiff = result.comparison['evapotranspiration'].difference
											const isNeutral = evapotranspirationDiff === 0

											return (
												<p
													className={`text-xs lg:text-sm ${
														isNeutral
															? 'text-yellow-400'
															: result.comparison['evapotranspiration'].larger === result.city1.name
															? 'text-green-500'
															: 'text-red-500'
													}`}>
													{isNeutral
														? '0.0 mm'
														: `${
																result.comparison['evapotranspiration'].larger === result.city1.name ? '+' : '-'
														  }${Math.abs(evapotranspirationDiff).toFixed(2)} mm`}
												</p>
											)
										})()
									) : (
										<p className='text-xs lg:text-sm text-gray-400'>Brak danych</p>
									)}
								</div>
							</div>
						</div>
					</div>
					<p className='text-4xl lg:text-7xl text-white'>vs.</p>
					<div className='flex flex-col justify-center items-center relative bg-gray-800 rounded-xl shadow-md px-1 lg:px-5 py-5 lg:py-10 overflow-hidden'>
						<div className='absolute top-0 w-full h-[5px] bg-accentColor'></div>
						<div className='flex justify-center items-center w-[80px] h-[80px] lg:w-[120px] lg:h-[120px] bg-gray-300 [clip-path:polygon(30%_0%,_70%_0%,_100%_30%,_100%_70%,_70%_100%,_30%_100%,_0%_70%,_0%_30%)]'>
							<div className='flex justify-center items-center lg:w-[117px] lg:h-[117px] w-[77px] h-[77px] p-5 bg-accentColor [clip-path:polygon(30%_0%,_70%_0%,_100%_30%,_100%_70%,_70%_100%,_30%_100%,_0%_70%,_0%_30%)]'>
								<FontAwesomeIcon icon={faCity} className='w-full h-full text-white p-2' />
							</div>
						</div>

						<div className='flex flex-col justify-center items-center py-6 lg:pr-2 bg-slate-700 rounded-md ring-1 ring-gray-400'>
							<p className='uppercase font-bold leading-3 text-sm lg:text-lg'>{result.city2.name}</p>
							<p className='lowercase font-thin text-xs lg:text-base'>{result.city2.voivodeship.name}</p>
							<div className='flex flex-col lg:flex-row justify-center items-center mt-2'>
								<div className='flex flex-col justify-center items-center gap-2'>
									<p className='-mb-3 text-sm lg:text-base'>&nbsp;&nbsp;&nbsp;Populacja:&nbsp;&nbsp;&nbsp;</p>

									<p className='font-thin text-xs lg:text-sm'> {Math.round(result.city2.population / 1000)} tyś.os.</p>
								</div>

								<div className='flex flex-col justify-center items-center gap-2 w-[200px]'>
									<p className='-mb-3 text-sm lg:text-base'>Stolica województwa:</p>
									<p className='font-thin text-xs lg:text-sm'> {result.city2.voivodeship.capital}</p>
								</div>
								<div className='flex flex-col justify-center items-center gap-2'>
									<p className='-mb-3 text-sm lg:text-base'>Powierzchnia:</p>
									<p className='font-thin text-xs lg:text-sm'>{result.city2.area} km²</p>
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
						<div className='flex flex-col justify-center items-center p-2 lg:p-4 bg-slate-700 rounded-md ring-1 ring-gray-400 w-full'>
						<p className='mb-2 font-thin uppercase text-sm'>Warunki pogodowe</p>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full '>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Temperatura:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather2
											? `${((selectedCityWeather2.maxTemperature + selectedCityWeather2.minTemperature) / 2).toFixed(
													1
											  )}°C`
											: ''}
									</p>
									{selectedCityWeather1 && selectedCityWeather2 && result.comparison['maxTemperature']
										? (() => {
												const avg1 = (selectedCityWeather1.maxTemperature + selectedCityWeather1.minTemperature) / 2
												const avg2 = (selectedCityWeather2.maxTemperature + selectedCityWeather2.minTemperature) / 2
												const diff = Math.abs(+(avg1 - avg2).toFixed(1))
												const isNeutral = diff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['maxTemperature'].larger === result.city2.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0°C'
															: `${
																	result.comparison['maxTemperature'].larger === result.city2.name ? '+' : '-'
															  }${diff}°C`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Opady deszczu:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather2?.rain}mm</p>
									{result.comparison['rain']
										? (() => {
												const rainDiff = result.comparison['rain'].difference
												const isNeutral = rainDiff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['rain'].larger === result.city2.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0mm'
															: `${
																	result.comparison['rain'].larger === result.city2.name ? '+' : '-'
															  }${rainDiff.toFixed(2)}mm`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Opady śniegu:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather2?.snow}mm</p>
									{result.comparison['snow']
										? (() => {
												const snowDiff = result.comparison['snow'].difference
												const isNeutral = snowDiff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['snow'].larger === result.city2.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0mm'
															: `${
																	result.comparison['snow'].larger === result.city2.name ? '+' : '-'
															  }${snowDiff.toFixed(2)}mm`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Czas opadów:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather2?.precipitationDuration}h</p>
									{result.comparison['precipitationDuration']
										? (() => {
												const durationDiff = result.comparison['precipitationDuration'].difference
												const isNeutral = durationDiff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['precipitationDuration'].larger === result.city2.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0h'
															: `${
																	result.comparison['precipitationDuration'].larger === result.city2.name ? '+' : '-'
															  }${durationDiff.toFixed(1)}h`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Wschód słońca:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather2?.sunrise ? adjustSunTimeForDST(selectedCityWeather2.sunrise) : ''}
									</p>
									{selectedCityWeather1?.sunrise && selectedCityWeather2?.sunrise
										? (() => {
												const getMinutesFromTime = (time: string): number => {
													if (time.includes('T')) {
														const date = new Date(time)
														return date.getHours() * 60 + date.getMinutes()
													}
													const [h, m] = time.split(':').map(Number)
													if (isNaN(h) || isNaN(m)) return NaN
													return h * 60 + m
												}

												const t1 = getMinutesFromTime(selectedCityWeather2.sunrise)
												const t2 = getMinutesFromTime(selectedCityWeather1.sunrise)

												if (isNaN(t1) || isNaN(t2)) {
													return <p className='text-xs lg:text-sm text-yellow-400'>Błąd danych</p>
												}

												const diff = Math.abs(t1 - t2)
												const isNeutral = diff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral ? 'text-yellow-400' : t1 < t2 ? 'text-red-500' : 'text-green-500'
														}`}>
														{isNeutral ? '0 min' : `${t1 < t2 ? '-' : '+'}${diff} min`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Zachód słońca:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather2?.sunset ? adjustSunTimeForDST(selectedCityWeather2.sunset) : ''}
									</p>
									{selectedCityWeather2?.sunset && selectedCityWeather1?.sunset
										? (() => {
												const getMinutesFromTime = (time: string): number => {
													if (time.includes('T')) {
														const date = new Date(time)
														return date.getHours() * 60 + date.getMinutes()
													}
													const [h, m] = time.split(':').map(Number)
													if (isNaN(h) || isNaN(m)) return NaN
													return h * 60 + m
												}

												const t1 = getMinutesFromTime(selectedCityWeather2.sunset)
												const t2 = getMinutesFromTime(selectedCityWeather1.sunset)

												if (isNaN(t1) || isNaN(t2)) {
													return <p className='text-xs lg:text-sm text-yellow-400'>Błąd danych</p>
												}

												const diff = Math.abs(t1 - t2)
												const isNeutral = diff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral ? 'text-yellow-400' : t1 > t2 ? 'text-green-500' : 'text-red-500'
														}`}>
														{isNeutral ? '0 min' : `${t1 > t2 ? '+' : '-'}${diff} min`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Nasłonecznienie:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather2?.sunlightDuration !== undefined
											? formatSecondsToHoursMinutes(selectedCityWeather2.sunlightDuration)
											: ''}
									</p>
									{result.comparison['sunlightDuration']
										? (() => {
												const durationDiffSeconds = result.comparison['sunlightDuration'].difference
												const isNeutral = durationDiffSeconds === 0

												const getFormattedDiff = (seconds: number): string => {
													const abs = Math.abs(seconds)
													const h = Math.floor(abs / 3600)
													const m = Math.floor((abs % 3600) / 60)
													return `${h}h ${m}min`
												}

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['sunlightDuration'].larger === result.city2.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0h'
															: `${
																	result.comparison['sunlightDuration'].larger === result.city2.name ? '+' : '-'
															  }${getFormattedDiff(durationDiffSeconds)}`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Prędkość wiatru:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather2?.maxWindSpeed}km/h</p>
									{result.comparison['maxWindSpeed']
										? (() => {
												const windSpeedDiff = result.comparison['maxWindSpeed'].difference
												const isNeutral = windSpeedDiff === 0

												return (
													<p
														className={`text-xs lg:text-sm ${
															isNeutral
																? 'text-yellow-400'
																: result.comparison['maxWindSpeed'].larger === result.city2.name
																? 'text-green-500'
																: 'text-red-500'
														}`}>
														{isNeutral
															? '0.0km/h'
															: `${
																	result.comparison['maxWindSpeed'].larger === result.city2.name ? '+' : '-'
															  }${Math.abs(windSpeedDiff).toFixed(1)}km/h`}
													</p>
												)
										  })()
										: null}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Kierunek wiatru:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>
										{selectedCityWeather2?.dominantWindDirection !== undefined
											? selectedCityWeather2.dominantWindDirection +
											  '° (' +
											  degreesToWindDirection(selectedCityWeather2.dominantWindDirection) +
											  ')'
											: ''}
									</p>
									{selectedCityWeather1?.dominantWindDirection !== undefined &&
									selectedCityWeather2?.dominantWindDirection !== undefined ? (
										(() => {
											const windDirectionDiff = Math.abs(
												selectedCityWeather1.dominantWindDirection - selectedCityWeather2.dominantWindDirection
											)

											const isNeutral = windDirectionDiff === 0

											return (
												<p
													className={`text-xs lg:text-sm ${
														isNeutral
															? 'text-yellow-400'
															: selectedCityWeather1?.dominantWindDirection <
															  selectedCityWeather2?.dominantWindDirection
															? 'text-green-500'
															: 'text-red-500'
													}`}>
													{isNeutral
														? '0°'
														: `${
																selectedCityWeather1?.dominantWindDirection <
																selectedCityWeather2?.dominantWindDirection
																	? '+'
																	: '-'
														  }${Math.abs(windDirectionDiff).toFixed(0)}°`}
												</p>
											)
										})()
									) : (
										<p className='text-xs lg:text-sm text-gray-400'>Brak danych</p>
									)}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Radiacja słońca:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather2?.totalSolarRadiation} MJ/m²</p>
									{result.comparison['totalSolarRadiation'] ? (
										(() => {
											const radiationDiff = result.comparison['totalSolarRadiation'].difference
											const isNeutral = radiationDiff === 0

											return (
												<p
													className={`text-xs lg:text-sm ${
														isNeutral
															? 'text-yellow-400'
															: result.comparison['totalSolarRadiation'].larger === result.city2.name
															? 'text-green-500'
															: 'text-red-500'
													}`}>
													{isNeutral
														? '0.0 MJ/m²'
														: `${
																result.comparison['totalSolarRadiation'].larger === result.city2.name ? '+' : '-'
														  }${Math.abs(radiationDiff).toFixed(2)} MJ/m²`}
												</p>
											)
										})()
									) : (
										<p className='text-xs lg:text-sm text-gray-400'>Brak danych</p>
									)}
								</div>
							</div>

							<div className='flex flex-row justify-between items-center border-b border-gray-400 w-full'>
								<p className='text-[10px] lg:text-xs lg:font-thin'>Ewapotranspiracja:</p>
								<div className='flex flex-row justify-between items-center w-[170px] lg:w-[200px]'>
									<p className='text-xs lg:text-sm'>{selectedCityWeather2?.evapotranspiration} mm</p>
									{result.comparison['evapotranspiration'] ? (
										(() => {
											const evapotranspirationDiff = result.comparison['evapotranspiration'].difference
											const isNeutral = evapotranspirationDiff === 0

											return (
												<p
													className={`text-xs lg:text-sm ${
														isNeutral
															? 'text-yellow-400'
															: result.comparison['evapotranspiration'].larger === result.city2.name
															? 'text-green-500'
															: 'text-red-500'
													}`}>
													{isNeutral
														? '0.0 mm'
														: `${
																result.comparison['evapotranspiration'].larger === result.city2.name ? '+' : '-'
														  }${Math.abs(evapotranspirationDiff).toFixed(2)} mm`}
												</p>
											)
										})()
									) : (
										<p className='text-xs lg:text-sm text-gray-400'>Brak danych</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<section className={sidebarContainer}>
			<div className='flex flex-col justify-center items-center px-1 lg:px-6 '>
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
