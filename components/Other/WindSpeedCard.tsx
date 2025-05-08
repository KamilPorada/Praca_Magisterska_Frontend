'use client'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWind } from '@fortawesome/free-solid-svg-icons'

const WindSpeedCard = () => {
	const [windSpeed, setWindSpeed] = useState<number | null>(null)

	useEffect(() => {
		// Funkcja pobierająca dane o prędkości wiatru z Open-Meteo API
		const fetchWindSpeed = async () => {
			const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.2298&longitude=21.0118&current_weather=true')
			const data = await response.json()
			setWindSpeed(data.current_weather.windspeed)
		}

		fetchWindSpeed()

		// Ustawienie interwału do odświeżania danych co minutę
		const intervalId = setInterval(fetchWindSpeed, 60000)

		return () => clearInterval(intervalId) // Czyszczenie interwału przy odmontowaniu komponentu
	}, [])

	return (
		<div className='flex flex-col items-center justify-center gap-4 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			{/* Ikona i nagłówek */}
			<div className='flex flex-row justify-center items-center gap-3'>
				<FontAwesomeIcon icon={faWind} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Prędkość
					<br />
					wiatru
				</h4>
			</div>

			{/* Prędkość wiatru */}
			<p className='text-3xl font-semibold text-center'>
				{windSpeed !== null ? `${windSpeed} km/h` : 'Ładowanie...'}
			</p>
		</div>
	)
}

export default WindSpeedCard
