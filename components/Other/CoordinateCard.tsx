'use client'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'

const CoordinatesCard = () => {
	const [coordinates, setCoordinates] = useState<{
		latitude: number | null
		longitude: number | null
		elevation: number | null
	}>({
		latitude: null,
		longitude: null,
		elevation: null,
	})

	useEffect(() => {
		// Funkcja pobierająca dane o współrzędnych i wysokości z Open-Meteo API
		const fetchCoordinates = async () => {
			const response = await fetch(
				'https://api.open-meteo.com/v1/forecast?latitude=52.2298&longitude=21.0118&current_weather=true'
			)
			const data = await response.json()
			setCoordinates({
				latitude: data.latitude,
				longitude: data.longitude,
				elevation: data.elevation,
			})
		}

		fetchCoordinates()

		// Ustawienie interwału do odświeżania danych co minutę
		const intervalId = setInterval(fetchCoordinates, 60000)

		return () => clearInterval(intervalId) // Czyszczenie interwału przy odmontowaniu komponentu
	}, [])

	return (
		<div className='flex flex-col items-center justify-center gap-4 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			{/* Tytuł */}
			<div className='flex flex-row justify-center items-center gap-3'>
				<FontAwesomeIcon icon={faGlobe} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Położenie
					<br />
					miasta
				</h4>
			</div>

			{/* Współrzędne */}
			<div className='flex flex-col gap-3'>
				<div className='flex justify-center gap-2'>
					<p className='text-lg'>
						{coordinates.latitude !== null
							? `${coordinates.latitude.toFixed(2)}° ${coordinates.latitude >= 0 ? 'N' : 'S'}`
							: 'Ładowanie...'}
					</p>
					<p className='text-lg'>
						{coordinates.longitude !== null
							? `${coordinates.longitude.toFixed(2)}° ${coordinates.longitude >= 0 ? 'E' : 'W'}`
							: 'Ładowanie...'}
					</p>
				</div>
				<p className='text-lg text-center -mt-4'>
					{coordinates.elevation !== null ? `${coordinates.elevation} m n.p.m.` : 'Ładowanie...'}
				</p>
			</div>
		</div>
	)
}

export default CoordinatesCard
