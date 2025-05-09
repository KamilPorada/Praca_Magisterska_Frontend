import React, { useState, useEffect } from 'react'
import Button from '../UI/Button'

type City = {
	id: number
	name: string
}

type Column = {
	name: string
	displayName: string
}

type CorrelationFormProps = {
	cities: City[]
	columns: Column[]
	onSubmit: (formData: { cityId: number; startDate: string; endDate: string; column1: string; column2: string }) => void
}

const MIN_DATE = '1950-01-01'
const MAX_DATE = '2024-12-31'

const CorrelationForm: React.FC<CorrelationFormProps> = ({ cities, columns, onSubmit }) => {
	const [selectedCity, setSelectedCity] = useState<number | undefined>(cities[0]?.id)
	const [cityName, setCityName] = useState<string>('')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [column1, setColumn1] = useState('')
	const [column2, setColumn2] = useState('')
	const [errors, setErrors] = useState<{
		city?: boolean
		startDate?: string
		endDate?: string
		column1?: string
		column2?: string
	}>({})

	const validateForm = () => {
		const newErrors: typeof errors = {}

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
		if (!column1) {
			newErrors.column1 = 'Podaj pierwszą kolumnę.'
		}
		if (!column2) {
			newErrors.column2 = 'Podaj drugą kolumnę.'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) return

		onSubmit({
			cityId: selectedCity!,
			startDate,
			endDate,
			column1,
			column2,
		})
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
		<form onSubmit={handleSubmit} className='w-full'>
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

			<div className='mb-4'>
				<label htmlFor='column1' className='text-white font-semibold mb-2'>
					Wybierz pierwszą zmienną:
				</label>
				<select
					id='column1'
					value={column1}
					onChange={e => setColumn1(e.target.value)}
					className={`w-full p-2 border text-black mt-2 ${
						errors.column1 ? 'border-red-500 border-2' : 'border-gray-300'
					} rounded-md`}>
					<option value=''>Wybierz kolumnę</option>
					{columns.map(column => (
						<option key={column.name} value={column.name}>
							{column.displayName}
						</option>
					))}
				</select>
				{errors.column1 && <p className='text-red-500 text-sm mt-1'>{errors.column1}</p>}
			</div>

			<div className='mb-4'>
				<label htmlFor='column2' className='text-white font-semibold mb-2'>
					Wybierz drugą zmienną:
				</label>
				<select
					id='column2'
					value={column2}
					onChange={e => setColumn2(e.target.value)}
					className={`w-full p-2 border text-black mt-2 ${
						errors.column2 ? 'border-red-500 border-2' : 'border-gray-300'
					} rounded-md`}>
					<option value=''>Wybierz kolumnę</option>
					{columns.map(column => (
						<option key={column.name} value={column.name}>
							{column.displayName}
						</option>
					))}
				</select>
				{errors.column2 && <p className='text-red-500 text-sm mt-2'>{errors.column1}</p>}
			</div>

			<Button className='w-full mt-2'>Oblicz korelacje</Button>
		</form>
	)
}

export default CorrelationForm
