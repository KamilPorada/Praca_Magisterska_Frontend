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
	const [errors, setErrors] = useState<{ city?: boolean; startDate?: string; endDate?: string }>({})
	const [dataFetched, setDataFetched] = useState<boolean>(false)

	const MIN_DATE = '1940-01-01'
	const MAX_DATE = '2024-12-31'

	const validateForm = () => {
		const newErrors: { city?: boolean; startDate?: string; endDate?: string } = {}

		if (!selectedCity) {
			newErrors.city = true
		}

		if (!startDate) {
			newErrors.startDate = 'Wybierz datę początkową.'
		} else if (startDate < MIN_DATE || startDate > MAX_DATE) {
			newErrors.startDate = `Data musi być między ${MIN_DATE} a ${MAX_DATE}.`
		}

		if (!endDate) {
			newErrors.endDate = 'Wybierz datę końcową.'
		} else if (endDate < MIN_DATE || endDate > MAX_DATE) {
			newErrors.endDate = `Data musi być między ${MIN_DATE} a ${MAX_DATE}.`
		} else if (startDate && endDate < startDate) {
			newErrors.endDate = 'Data końcowa nie może być wcześniejsza niż początkowa.'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
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
					{errors.city && <p className='text-red-500 text-sm mt-1'>Wybierz miasto.</p>}
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
					{errors.startDate && <p className='text-red-500 text-sm mt-1'>{errors.startDate}</p>}
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
					{errors.endDate && <p className='text-red-500 text-sm mt-1'>{errors.endDate}</p>}
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
