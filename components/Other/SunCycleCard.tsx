'use client'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faCloudMoon } from '@fortawesome/free-solid-svg-icons'

interface SunData {
	sunrise: string
	sunset: string
}

const SunCycleCard = () => {
	const [sunData, setSunData] = useState<SunData | null>(null)
	const [isDay, setIsDay] = useState<boolean>(true)
	const [timeRemainingText, setTimeRemainingText] = useState<string>('')
	const [orbX, setOrbX] = useState<number>(50)
	const [orbY, setOrbY] = useState<number>(50)

	useEffect(() => {
		const fetchSunData = async () => {
			try {
				const response = await fetch('https://api.sunrise-sunset.org/json?lat=52.2297&lng=21.0122&formatted=0')
				const data = await response.json()
				const sunriseUTC = new Date(data.results.sunrise)
				const sunsetUTC = new Date(data.results.sunset)

				// Przekształć na czas lokalny
				const sunrise = new Date(sunriseUTC.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }))
				const sunset = new Date(sunsetUTC.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }))

				setSunData({
					sunrise: sunrise.toISOString(),
					sunset: sunset.toISOString(),
				})

				const now = new Date()
				const nowLocal = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }))

				const isCurrentlyDay = nowLocal >= sunrise && nowLocal < sunset
				setIsDay(isCurrentlyDay)

				const currentMinutes = nowLocal.getHours() * 60 + nowLocal.getMinutes()
				const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes()
				const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes()

				let progress = 0
				let angle = 0
				let minutesLeft = 0

				if (isCurrentlyDay) {
					progress = Math.min(
						Math.max(((currentMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes)) * 100, 0),
						100
					)
					angle = (progress / 100) * 180
					minutesLeft = sunsetMinutes - currentMinutes
					setTimeRemainingText(`Do zachodu słońca pozostało: ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}min`)
				} else {
					let totalNightDuration = 1440 - sunsetMinutes + sunriseMinutes
					let minutesSinceSunset =
						currentMinutes > sunsetMinutes ? currentMinutes - sunsetMinutes : 1440 - sunsetMinutes + currentMinutes

					progress = Math.min(Math.max((minutesSinceSunset / totalNightDuration) * 100, 0), 100)
					angle = (progress / 100) * 180

					minutesLeft = sunriseMinutes - currentMinutes + (currentMinutes > sunsetMinutes ? 1440 : 0)
					setTimeRemainingText(`Do wschodu słońca pozostało: ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}min`)
				}

				const orbXCalc = 50 + 40 * Math.cos(((180 - angle) * Math.PI) / 180)
				const orbYCalc = 50 - 40 * Math.sin(((180 - angle) * Math.PI) / 180)
				setOrbX(orbXCalc)
				setOrbY(orbYCalc)
			} catch (error) {
				console.error('Błąd podczas pobierania danych o słońcu:', error)
			}
		}

		fetchSunData()
	}, [])

	if (!sunData) {
		return (
			<div className='flex flex-col items-center justify-center p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
				<p>Ładowanie danych o słońcu...</p>
			</div>
		)
	}

	const sunriseTime = new Date(sunData.sunrise).toLocaleTimeString('pl-PL', {
		hour: '2-digit',
		minute: '2-digit',
	})
	const sunsetTime = new Date(sunData.sunset).toLocaleTimeString('pl-PL', {
		hour: '2-digit',
		minute: '2-digit',
	})

	return (
		<div className='flex flex-col items-center justify-center gap-5 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			<div className='flex flex-row justify-center items-center gap-3'>
				<FontAwesomeIcon icon={faCloudMoon} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Cykl dnia 
					<br />
					i nocy
				</h4>
			</div>
			<div className='flex flex-row justify-around items-center w-full'>
				{isDay ? (
					<>
						<div className='flex flex-row justify-center items-center text-base gap-2'>
							<FontAwesomeIcon icon={faSun} className='text-yellow-400 text-xl' />
							<p>{sunriseTime}</p>
						</div>
						<svg width='100' height='60' viewBox='0 0 100 60'>
							<path d='M 10 50 A 40 40 0 0 1 90 50' stroke='orange' strokeWidth='3' fill='none' />
							<circle cx={orbX} cy={orbY} r='6' fill='yellow' stroke='gold' strokeWidth='2' />
						</svg>
						<div className='flex flex-row justify-center items-center text-base gap-2'>
							<FontAwesomeIcon icon={faMoon} className='text-yellow-400 text-xl' />
							<p>{sunsetTime}</p>
						</div>
					</>
				) : (
					<>
						<div className='flex flex-row justify-center items-center text-base gap-2'>
							<FontAwesomeIcon icon={faMoon} className='text-yellow-400 text-xl' />
							<p>{sunsetTime}</p>
						</div>
						<svg width='100' height='60' viewBox='0 0 100 60'>
							<path d='M 10 50 A 40 40 0 0 1 90 50' stroke='gray' strokeWidth='3' fill='none' />
							<circle cx={orbX} cy={orbY} r='6' fill='white' stroke='gray' strokeWidth='2' />
						</svg>
						<div className='flex flex-row justify-center items-center text-base gap-2'>
							<FontAwesomeIcon icon={faSun} className='text-yellow-400 text-xl' />
							<p>{sunriseTime}</p>
						</div>
					</>
				)}
			</div>
			<h3 className='text-center'>{timeRemainingText}</h3>
		</div>
	)
}

export default SunCycleCard
