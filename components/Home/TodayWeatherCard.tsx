'use client'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faSun,
	faCloud,
	faSmog,
	faCloudRain,
	faSnowflake,
	faBolt,
	faWind,
	faTint,
	faCompass,
	faMoon,
	faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import SectionTitle from '../UI/SectionTitle'

const weatherIcons: Record<number, IconDefinition> = {
	0: faSun,
	1: faCloud,
	2: faCloud,
	3: faCloud,
	45: faSmog,
	48: faSmog,
	51: faCloudRain,
	53: faCloudRain,
	55: faCloudRain,
	56: faCloudRain,
	57: faCloudRain,
	61: faCloudRain,
	63: faCloudRain,
	65: faCloudRain,
	66: faCloudRain,
	67: faCloudRain,
	71: faSnowflake,
	73: faSnowflake,
	75: faSnowflake,
	77: faSnowflake,
	80: faCloudRain,
	81: faCloudRain,
	82: faCloudRain,
	85: faSnowflake,
	86: faSnowflake,
	95: faBolt,
	96: faBolt,
	99: faBolt,
}

export default function TodayWeatherCard() {
	const weatherData = {
		city: 'Warszawa',
		temperature_2m: 17,
		relative_humidity_2m: 52,
		is_day: true, // Zmień na false, aby zobaczyć wersję nocną
		weather_code: 0,
		surface_pressure: 1012,
		wind_speed_10m: 14,
		sunrise: '07:12',
		sunset: '17:45',
	}

	const [currentTime, setCurrentTime] = useState('12:00') // Sztucznie ustawiona godzina

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime('12:00')
		}, 60000)
		return () => clearInterval(interval)
	}, [])

	const parseTime = (timeStr: string): number => {
		const [hours, minutes] = timeStr.split(':').map(Number)
		return hours * 60 + minutes
	}

	const sunriseMinutes = parseTime(weatherData.sunrise)
	const sunsetMinutes = parseTime(weatherData.sunset)
	const currentMinutes = parseTime(currentTime)

	let progress, angle, orbX, orbY
	let timeRemainingText = ''

	if (weatherData.is_day) {
		// Słońce w ciągu dnia (od wschodu do zachodu)
		progress = Math.min(Math.max(((currentMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes)) * 100, 0), 100)
		angle = (progress / 100) * 180
		const minutesLeft = sunsetMinutes - currentMinutes
		if (minutesLeft > 0) {
			timeRemainingText = `Do zachodu słońca pozostało: ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}min`
		}
	} else {
		// Noc – od zachodu do następnego wschodu
		let totalNightDuration = 1440 - sunsetMinutes + sunriseMinutes // Całkowity czas nocy (minuty)
		let minutesSinceSunset =
			currentMinutes > sunsetMinutes
				? currentMinutes - sunsetMinutes // Po zachodzie, tej samej nocy
				: 1440 - sunsetMinutes + currentMinutes // Po północy, do wschodu

		progress = (minutesSinceSunset / totalNightDuration) * 100
		angle = 180 - (progress / 100) * 180
		const minutesLeft =
			currentMinutes > sunsetMinutes
				? sunriseMinutes + (1440 - currentMinutes) // Po zachodzie do rana
				: sunriseMinutes - currentMinutes // Przed wschodem, tej samej nocy

		if (minutesLeft > 0) {
			timeRemainingText = `Do wschodu słońca pozostało: ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}min`
		}
	}

	orbX = 50 + 40 * Math.cos((angle * Math.PI) / 180)
	orbY = 50 - 40 * Math.sin((angle * Math.PI) / 180)

	return (
		<div className='container py-16'>
			<SectionTitle title={'Aktualna prognoza'} />
			<div className='flex flex-col items-center mt-16'>
				<div
					className={`rounded-xl p-5 text-center shadow-lg transition-all duration-500 bg-opacity ${
						weatherData.is_day
							? 'bg-gradient-to-b from-blue-200 to-blue-400 text-gray-900'
							: 'bg-gradient-to-b from-gray-900 to-black text-white'
					}`}>
					<div className='flex justify-between items-center mb-2'>
						<div className='flex items-center gap-2 text-lg font-semibold'>
							<FontAwesomeIcon icon={faMapMarkerAlt} className='text-accentColor' />
							<p>{weatherData.city}</p>
						</div>
						<FontAwesomeIcon
							icon={weatherIcons[weatherData.weather_code] || faCloud}
							className={`text-5xl ${
								[0, 95, 96, 99].includes(weatherData.weather_code) ? 'text-yellow-400' : 'text-gray-200'
							}`}
						/>
					</div>

					<p className='text-5xl font-semibold py-4'>{weatherData.temperature_2m}°C</p>

					<div className='flex flex-wrap flex-row justify-center items-center gap-6 mt-4'>
						<div className='flex flex-col items-center gap-1 w-32 shadow-lg p-2 rounded-lg bg-backgroundColor bg-opacity-10'>
							<p className='text-xs text-center'>
								Wilgotność
								<br />
								względna
							</p>
							<div className='flex flex-row justify-center items-center text-base gap-2'>
								<FontAwesomeIcon icon={faTint} className='text-mainColor' />
								<p>{weatherData.relative_humidity_2m}%</p>
							</div>
						</div>

						<div className='flex flex-col items-center gap-1 w-32 shadow-lg p-2 rounded-lg bg-backgroundColor bg-opacity-10'>
							<p className='text-xs text-center'>
								Ciśnienie
								<br />
								atmosferyczne
							</p>
							<div className='flex flex-row justify-center items-center text-base gap-2'>
								<FontAwesomeIcon icon={faCompass} className='text-mainColor' />
								<p>{weatherData.surface_pressure} hPa</p>
							</div>
						</div>

						<div className='flex flex-col items-center gap-1 w-32 shadow-lg p-2 rounded-lg bg-backgroundColor bg-opacity-10'>
							<p className='text-xs text-center'>
								Prędkość
								<br />
								wiatru
							</p>
							<div className='flex flex-row justify-center items-center text-base gap-2'>
								<FontAwesomeIcon icon={faWind} className='text-mainColor' />
								<p>{weatherData.wind_speed_10m} km/h</p>
							</div>
						</div>
					</div>
					<div className='flex flex-col items-center text-center space-y-3 mt-4 p-4 rounded-lg shadow-lg bg-backgroundColor bg-opacity-10'>
						<h3 className='text-sm'>{timeRemainingText}</h3>
						<div className='flex flex-row justify-around items-center w-full'>
							{weatherData.is_day ? (
								<>
									<div className='flex flex-row justify-center items-center text-base gap-2'>
										<FontAwesomeIcon icon={faSun} className='text-yellow-400 text-xl' />
										<p>{weatherData.sunset}</p>
									</div>
									<svg width='100' height='60' viewBox='0 0 100 60'>
										<path d='M 10 50 A 40 40 0 0 1 90 50' stroke='orange' strokeWidth='3' fill='none' />
										<circle cx={orbX} cy={orbY} r='6' fill='yellow' stroke='gold' strokeWidth='2' />
									</svg>
									<div className='flex flex-row justify-center items-center text-base gap-2'>
										<FontAwesomeIcon icon={faMoon} className='text-yellow-400 text-xl' />
										<p>{weatherData.sunrise}</p>
									</div>
								</>
							) : (
								<>
									<div className='flex flex-row justify-center items-center text-base gap-2'>
										<FontAwesomeIcon icon={faMoon} className='text-yellow-400 text-xl' />
										<p>{weatherData.sunset}</p>
									</div>
									<svg width='100' height='60' viewBox='0 0 100 60'>
										<path d='M 10 50 A 40 40 0 0 1 90 50' stroke='gray' strokeWidth='3' fill='none' />
										<circle cx={orbX} cy={orbY} r='6' fill='white' stroke='gray' strokeWidth='2' />
									</svg>
									<div className='flex flex-row justify-center items-center text-base gap-2'>
										<FontAwesomeIcon icon={faSun} className='text-yellow-400 text-xl' />
										<p>{weatherData.sunrise}</p>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
