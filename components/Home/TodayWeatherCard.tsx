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

interface WeatherProps {
	city: string
	longitude: number
	latitude: number
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
}

export default function TodayWeatherCard({ weather }: { weather: WeatherProps }) {
	const [currentTime, setCurrentTime] = useState('12:00') // Sztucznie ustawiona godzina

	useEffect(() => {
		const updateTime = () => {
			const now = new Date()
			const year = now.getFullYear()
			const month = (now.getMonth() + 1).toString().padStart(2, '0') // Miesiące są liczone od 0
			const day = now.getDate().toString().padStart(2, '0')
			const hours = now.getHours().toString().padStart(2, '0')
			const minutes = now.getMinutes().toString().padStart(2, '0')

			setCurrentTime(`${year}-${month}-${day}T${hours}:${minutes}`)
		}

		updateTime() // Ustawienie początkowej wartości
		const interval = setInterval(updateTime, 60000) // Aktualizacja co minutę

		return () => clearInterval(interval)
	}, [])

	const parseTime = (timeStr?: string): number => {
		if (!timeStr) return 0 // Jeśli `timeStr` jest undefined lub pusty, zwracamy 0
		const match = timeStr.match(/T(\d{2}):(\d{2})/) // Wyszukujemy HH:MM po literze 'T'
		if (!match) return 0 // Jeśli nie udało się dopasować, zwracamy 0
		const hours = parseInt(match[1], 10)
		const minutes = parseInt(match[2], 10)
		return hours * 60 + minutes
	}

	const sunrise1Minutes = parseTime(weather.sunrise1)
	const sunrise2Minutes = parseTime(weather.sunrise2)
	const sunsetMinutes = parseTime(weather.sunset1)
	const currentMinutes = parseTime(currentTime)

	let progress, angle, orbX, orbY
	let timeRemainingText = ''
	console.log(weather.city, weather.is_day)

	if (weather.is_day) {
		// Słońce w ciągu dnia (od wschodu do zachodu)
		progress = Math.min(
			Math.max(((currentMinutes - sunrise1Minutes) / (sunsetMinutes - sunrise1Minutes)) * 100, 0),
			100
		)
		angle = (progress / 100) * 180
		const minutesLeft = sunsetMinutes - currentMinutes
		console.log(sunsetMinutes)
		console.log(currentTime)
		if (minutesLeft > 0) {
			timeRemainingText = `Do zachodu słońca pozostało: ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}min`
		}
	} else {
		// Noc – od zachodu do następnego wschodu
		let totalNightDuration = 1440 - sunsetMinutes + sunrise2Minutes // Całkowity czas nocy (minuty)
		let minutesSinceSunset =
			currentMinutes > sunsetMinutes
				? currentMinutes - sunsetMinutes // Po zachodzie, tej samej nocy
				: 1440 - sunsetMinutes + currentMinutes // Po północy, do wschodu

		progress = Math.min(
			Math.max(((currentMinutes - sunrise1Minutes) / (sunsetMinutes - sunrise1Minutes)) * 100, 0),
			100
		)
		angle = 180 - (progress / 100) * 180
		const minutesLeft =
			currentMinutes > sunsetMinutes
				? sunrise2Minutes + (1440 - currentMinutes) // Po zachodzie do rana
				: sunrise2Minutes - currentMinutes // Przed wschodem, tej samej nocy

		if (minutesLeft > 0) {
			timeRemainingText = `Do wschodu słońca pozostało: ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}min`
		}
	}

	orbX = 50 + 40 * Math.cos(((180 - angle) * Math.PI) / 180)
	orbY = 50 - 40 * Math.sin(((180 - angle) * Math.PI) / 180)

	return (
		<div className='flex flex-col items-center'>
			<div
				className={`rounded-xl p-5 text-center shadow-lg transition-all duration-500 bg-opacity ${
					weather.is_day
						? 'bg-gradient-to-b from-blue-200 to-blue-400 text-gray-900'
						: 'bg-gradient-to-b from-gray-900 to-black text-white'
				}`}>
				<div className='flex justify-between items-center mb-2'>
					<div className='flex items-center gap-2 text-lg font-semibold'>
						<FontAwesomeIcon icon={faMapMarkerAlt} className='text-accentColor' />
						<p>{weather.city}</p>
						<span className='text-sm text-gray-500'>{`(${weather.latitude.toFixed(2)}, ${weather.longitude.toFixed(
							2
						)})`}</span>
					</div>
					<FontAwesomeIcon
						icon={
							weather.weather_code === 0
								? weather.is_day
									? faSun
									: faMoon
								: weatherIcons[weather.weather_code] || faCloud
						}
						className={`text-5xl ${
							[0, 95, 96, 99].includes(weather.weather_code) ? 'text-yellow-400' : 'text-gray-200'
						}`}
					/>
				</div>

				<p className='text-5xl font-semibold py-4'>{weather?.temperature_2m ?? '0'}°C</p>

				<div className='flex flex-row justify-between items-center gap-1 mt-4'>
					<div className='flex flex-col items-center gap-1 w-[100px] shadow-lg p-2 rounded-lg bg-backgroundColor bg-opacity-10'>
						<p className='text-xs text-center'>
							Wilgotność
							<br />
							względna
						</p>
						<div className='flex flex-row justify-center items-center text-xs gap-2'>
							<FontAwesomeIcon icon={faTint} className='text-mainColor' />
							<p>{weather.relative_humidity_2m}%</p>
						</div>
					</div>

					<div className='flex flex-col items-center gap-1 w-[100px] shadow-lg p-2 rounded-lg bg-backgroundColor bg-opacity-10'>
						<p className='text-xs text-center'>
							Ciśnienie
							<br />
							atmosferyczne
						</p>
						<div className='flex flex-row justify-center items-center text-xs gap-2'>
							<FontAwesomeIcon icon={faCompass} className='text-mainColor' />
							<p>{Math.round(weather.surface_pressure)} hPa</p>
						</div>
					</div>

					<div className='flex flex-col items-center gap-1 w-[100px] shadow-lg p-2 rounded-lg bg-backgroundColor bg-opacity-10'>
						<p className='text-xs text-center'>
							Prędkość
							<br />
							wiatru
						</p>
						<div className='flex flex-row justify-center items-center text-xs gap-2'>
							<FontAwesomeIcon icon={faWind} className='text-mainColor' />
							<p>{weather.wind_speed_10m} km/h</p>
						</div>
					</div>
				</div>
				<div className='flex flex-col items-center text-center space-y-3 mt-4 p-4 rounded-lg shadow-lg bg-backgroundColor bg-opacity-10'>
					<h3 className='text-xs'>{timeRemainingText}</h3>
					<div className='flex flex-row justify-around items-center w-full'>
						{weather.is_day ? (
							<>
								<div className='flex flex-row justify-center items-center text-base gap-2'>
									<FontAwesomeIcon icon={faSun} className='text-yellow-400 text-xl' />
									<p>
										{new Date(weather.sunrise1).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
									</p>
								</div>
								<svg width='100' height='60' viewBox='0 0 100 60'>
									<path d='M 10 50 A 40 40 0 0 1 90 50' stroke='orange' strokeWidth='3' fill='none' />
									<circle cx={orbX} cy={orbY} r='6' fill='yellow' stroke='gold' strokeWidth='2' />
								</svg>
								<div className='flex flex-row justify-center items-center text-base gap-2'>
									<FontAwesomeIcon icon={faMoon} className='text-yellow-400 text-xl' />
									<p>{new Date(weather.sunset1).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
								</div>
							</>
						) : (
							<>
								<div className='flex flex-row justify-center items-center text-base gap-2'>
									<FontAwesomeIcon icon={faMoon} className='text-yellow-400 text-xl' />
									<p>{new Date(weather.sunset1).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
								</div>
								<svg width='100' height='60' viewBox='0 0 100 60'>
									<path d='M 10 50 A 40 40 0 0 1 90 50' stroke='gray' strokeWidth='3' fill='none' />
									<circle cx={orbX} cy={orbY} r='6' fill='white' stroke='gray' strokeWidth='2' />
								</svg>
								<div className='flex flex-row justify-center items-center text-base gap-2'>
									<FontAwesomeIcon icon={faSun} className='text-yellow-400 text-xl' />
									<p>
										{new Date(weather.sunrise2).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
									</p>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
