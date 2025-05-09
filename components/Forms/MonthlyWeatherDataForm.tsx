// components/MonthlyWeatherDataForm.tsx
import React, { useState, useEffect } from 'react'
import Button from '../UI/Button'

type City = {
	id: number
	name: string
}

type MonthlyWeatherDataFormProps = {
	cities: City[]
	onDataFetched: (data: any) => void
}

const MonthlyWeatherDataForm: React.FC<MonthlyWeatherDataFormProps> = ({ cities, onDataFetched }) => {
	const [selectedCity, setSelectedCity] = useState<number | undefined>()
	const [cityName, setCityName] = useState<string>('')
	const [startMonth, setStartMonth] = useState<number>(1)
	const [startYear, setStartYear] = useState<number>(1950) // Zmieniamy na 1950
	const [endMonth, setEndMonth] = useState<number>(12)
	const [endYear, setEndYear] = useState<number>(2024) // Zmieniamy na 2024
	const [dataFetched, setDataFetched] = useState<boolean>(false) // New state to track if data is fetched

	const years = Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 1950 + i) // Generowanie lat od 1950 do 2024

	const monthNames = [
		'stycznia',
		'lutego',
		'marca',
		'kwietnia',
		'maja',
		'czerwca',
		'lipca',
		'sierpnia',
		'września',
		'października',
		'listopada',
		'grudnia',
	]
	

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!selectedCity || !startMonth || !startYear || !endMonth || !endYear) {
			alert('Please fill in all fields')
			return
		}

		try {
			const response = await fetch(
				`http://localhost:8080/api/monthly-weather?cityId=${selectedCity}&startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`
			)
			if (!response.ok) {
				throw new Error('Failed to fetch data')
			}
			const data = await response.json()
			onDataFetched(data) // Przekaż pobrane dane do komponentu nadrzędnego
			setDataFetched(true)
		} catch (error) {
			console.error('Error fetching monthly weather data:', error)
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
						className='w-full p-2 border border-gray-300 rounded-md text-black'>
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
					<label htmlFor='start-month' className='block text-white font-semibold mb-2'>
						Miesiąc początkowy:
					</label>
					<select
						id='start-month'
						value={startMonth}
						onChange={e => setStartMonth(Number(e.target.value))}
						className='w-full p-2 border border-gray-300 rounded-md text-black'>
						<option value={1}>Styczeń</option>
						<option value={2}>Luty</option>
						<option value={3}>Marzec</option>
						<option value={4}>Kwiecień</option>
						<option value={5}>Maj</option>
						<option value={6}>Czerwiec</option>
						<option value={7}>Lipiec</option>
						<option value={8}>Sierpień</option>
						<option value={9}>Wrzesień</option>
						<option value={10}>Październik</option>
						<option value={11}>Listopad</option>
						<option value={12}>Grudzień</option>
					</select>
				</div>

				<div className='mb-4'>
					<label htmlFor='start-year' className='block text-white font-semibold mb-2'>
						Rok początkowy:
					</label>
					<select
						id='start-year'
						value={startYear}
						onChange={e => setStartYear(Number(e.target.value))}
						className='w-full p-2 border border-gray-300 rounded-md text-black'>
						{years.map(year => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>

				<div className='mb-4'>
					<label htmlFor='end-month' className='block text-white font-semibold mb-2'>
						Miesiąc końcowy:
					</label>
					<select
						id='end-month'
						value={endMonth}
						onChange={e => setEndMonth(Number(e.target.value))}
						className='w-full p-2 border border-gray-300 rounded-md text-black'>
						<option value={1}>Styczeń</option>
						<option value={2}>Luty</option>
						<option value={3}>Marzec</option>
						<option value={4}>Kwiecień</option>
						<option value={5}>Maj</option>
						<option value={6}>Czerwiec</option>
						<option value={7}>Lipiec</option>
						<option value={8}>Sierpień</option>
						<option value={9}>Wrzesień</option>
						<option value={10}>Październik</option>
						<option value={11}>Listopad</option>
						<option value={12}>Grudzień</option>
					</select>
				</div>

				<div className='mb-4'>
					<label htmlFor='end-year' className='block text-white font-semibold mb-2'>
						Rok końcowy:
					</label>
					<select
						id='end-year'
						value={endYear}
						onChange={e => setEndYear(Number(e.target.value))}
						className='w-full p-2 border border-gray-300 rounded-md text-black'>
						{years.map(year => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>

				<Button className='w-full mt-2'>Wczytaj dane </Button>
			</form>
			{dataFetched && selectedCity && startYear && endYear && (
				<p className='mt-16 text-center text-white text-base sm:text-xl'>
					Dane pogodowe dla miasta {cityName} od {monthNames[startMonth - 1]} {startYear} do {monthNames[endMonth - 1]} {endYear}
				</p>
			)}
		</div>
	)
}

export default MonthlyWeatherDataForm
