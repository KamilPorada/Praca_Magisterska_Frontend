import React, { useState, useEffect } from 'react'
import Button from '../UI/Button'

type City = {
	id: number
	name: string
}

type DailyWeatherDataFormProps = {
	cities: City[]
	onDataFetched: (data: any) => void
}

const DailyWeatherDataForm: React.FC<DailyWeatherDataFormProps> = ({ cities, onDataFetched }) => {
	const [selectedCity, setSelectedCity] = useState<number | undefined>(undefined)
	const [cityName, setCityName] = useState<string>('')
	const [startDate, setStartDate] = useState<string>('')
	const [endDate, setEndDate] = useState<string>('')
	const [errors, setErrors] = useState<{ city?: boolean; startDate?: boolean; endDate?: boolean }>({})
	const [dataFetched, setDataFetched] = useState<boolean>(false) // New state to track if data is fetched

	const validateForm = () => {
		const newErrors = {
			city: !selectedCity,
			startDate: !startDate,
			endDate: !endDate,
		}
		setErrors(newErrors)
		return !Object.values(newErrors).some(Boolean)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) return

		try {
			const response = await fetch(
				`http://localhost:8080/api/daily-weather?cityId=${selectedCity}&startDate=${startDate}&endDate=${endDate}`
			)
			if (!response.ok) {
				throw new Error('Failed to fetch data')
			}
			const data = await response.json()

			const sortedData = data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
			onDataFetched(sortedData)
			setDataFetched(true)
		} catch (error) {
			console.error('Error fetching daily weather data:', error)
		}
	}

	useEffect(() => {
		if (cities.length > 0) {
			setSelectedCity(cities[0].id)
			setCityName(cities[0].name)
		}
	}, [cities])

	useEffect(() => {
		const city = cities.find(city => city.id === selectedCity)
		if (city) {
			setCityName(city.name)
		}
	}, [selectedCity, cities])

	return (
		<div className='w-full max-w-md mx-auto'>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label htmlFor='city' className='block text-white font-semibold mb-2'>
						Miasto:
					</label>
					<select
						id='city'
						value={selectedCity}
						onChange={e => setSelectedCity(Number(e.target.value))}
						className={`w-full p-2 border text-black ${
							errors.city ? 'border-red-500 border-2' : 'border-gray-300'
						} rounded-md`}>
						<option value='' disabled>
							Wybierz miasto
						</option>
						{cities.map(city => (
							<option key={city.id} value={city.id}>
								{city.name}
							</option>
						))}
					</select>
				</div>

				<div className='mb-4'>
					<label htmlFor='start-date' className='block text-white font-semibold mb-2'>
						Data początkowa:
					</label>
					<input
						id='start-date'
						type='date'
						value={startDate}
						onChange={e => setStartDate(e.target.value)}
						className={`w-full p-2 border text-black ${
							errors.startDate ? 'border-red-500 border-2' : 'border-gray-300'
						} rounded-md`}
					/>
				</div>

				<div className='mb-4'>
					<label htmlFor='end-date' className='block text-white font-semibold mb-2'>
						Data końcowa:
					</label>
					<input
						id='end-date'
						type='date'
						value={endDate}
						onChange={e => setEndDate(e.target.value)}
						className={`w-full p-2 border text-black ${
							errors.endDate ? 'border-red-500 border-2' : 'border-gray-300'
						} rounded-md`}
					/>
				</div>
				<Button className='w-full mt-2'>Wczytaj dane </Button>
			</form>
			{dataFetched && selectedCity && startDate && endDate && (
				<p className='mt-16 text-center text-white text-base sm:text-xl'>
					Dane pogodowe dla miasta {cityName} od{' '}
					{new Date(startDate).toLocaleDateString('pl-PL', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
					})}{' '}
					do{' '}
					{new Date(endDate).toLocaleDateString('pl-PL', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
					})}
				</p>
			)}
		</div>
	)
}

export default DailyWeatherDataForm
