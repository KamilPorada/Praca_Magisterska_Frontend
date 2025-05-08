'use client'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass } from '@fortawesome/free-solid-svg-icons'

const WindDirectionCard = () => {
	const [windDirection, setWindDirection] = useState<number | null>(null)

	// Funkcja do konwersji kąta kierunku wiatru na nazwy kardynalne
	const getCardinalDirection = (degree: number): string => {
		if (degree >= 0 && degree < 22.5) return 'Północny'
		if (degree >= 22.5 && degree < 67.5) return 'Północno-wschodni'
		if (degree >= 67.5 && degree < 112.5) return 'Wschodni'
		if (degree >= 112.5 && degree < 157.5) return 'Południowo-wschodni'
		if (degree >= 157.5 && degree < 202.5) return 'Południowy'
		if (degree >= 202.5 && degree < 247.5) return 'Południowo-zachodni'
		if (degree >= 247.5 && degree < 292.5) return 'Zachodni'
		if (degree >= 292.5 && degree < 337.5) return 'Północno-zachodni'
		return 'Północny' // Jeżeli poza zakresem
	}

	useEffect(() => {
		// Funkcja pobierająca dane o kierunku wiatru z Open-Meteo API
		const fetchWindDirection = async () => {
			const response = await fetch(
				'https://api.open-meteo.com/v1/forecast?latitude=52.2298&longitude=21.0118&current_weather=true'
			)
			const data = await response.json()
			console.log(data)
			setWindDirection(data.current_weather.winddirection) // Przechwycenie kierunku wiatru
		}

		fetchWindDirection()

		// Ustawienie interwału do odświeżania danych co minutę
		const intervalId = setInterval(fetchWindDirection, 60000)

		return () => clearInterval(intervalId) // Czyszczenie interwału przy odmontowaniu komponentu
	}, [])

	return (
		<div className='flex flex-col items-center justify-center gap-4 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			{/* Ikona i nagłówek */}
			<div className='flex flex-row justify-center items-center gap-3'>
				<FontAwesomeIcon icon={faCompass} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Kierunek
					<br />
					wiatru
				</h4>
			</div>

			{/* Kierunek wiatru */}
			<p className='text-3xl font-semibold text-center'>
				{windDirection !== null ? `${windDirection}°` : 'Ładowanie...'}
			</p>
			<p className='text-2xl font-semibold text-center -mt-5'>
				{windDirection !== null ? getCardinalDirection(windDirection) : 'Ładowanie...'}
			</p>
		</div>
	)
}

export default WindDirectionCard
