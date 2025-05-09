import React, { useState, useEffect } from 'react'
import Button from '../UI/Button'

type City = {
	id: number
	name: string
}

type ComparisonFormProps = {
	cities: City[]
	onSubmit: (formData: { cityId1: number; cityId2: number; date: string }) => void
}

const MIN_DATE = '1950-01-01'
const MAX_DATE = '2024-12-31'

const ComparisonForm: React.FC<ComparisonFormProps> = ({ cities, onSubmit }) => {
	const [cityName1, setCityName1] = useState<string>('')
	const [cityName2, setCityName2] = useState<string>('')
	const [city1, setCity1] = useState<number | undefined>(cities[0]?.id)
	const [city2, setCity2] = useState<number | undefined>(cities[1]?.id)
	const [date, setDate] = useState('')
	const [errors, setErrors] = useState<{
		city1?: string
		city2?: string
		date?: string
	}>({})

	const validateForm = () => {
		const newErrors: typeof errors = {}

		if (!city1) {
			newErrors.city1 = 'Wybierz pierwsze miasto.'
		}
		if (!city2) {
			newErrors.city2 = 'Wybierz drugie miasto.'
		} else if (city1 === city2) {
			newErrors.city2 = 'Miasta muszą być różne.'
		}
		if (!date) {
			newErrors.date = 'Wybierz datę.'
		} else if (date < MIN_DATE || date > MAX_DATE) {
			newErrors.date = `Data musi być między ${MIN_DATE} a ${MAX_DATE}.`
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) return

		onSubmit({
			cityId1: city1!,
			cityId2: city2!,
			date,
		})
	}

	useEffect(() => {
		if (cities.length > 0) {
			setCity1(cities[0].id)
			setCityName1(cities[0].name)
			setCity2(cities[1].id)
			setCityName2(cities[1].name)
		}
	}, [cities])

	useEffect(() => {
		const city = cities.find(city => city.id === city1)
		if (city) {
			setCity1(cities[0].id)
			setCityName1(cities[0].name)
			setCity2(cities[1].id)
			setCityName2(cities[1].name)
		}
	}, [ cities])

	return (
		<form onSubmit={handleSubmit} className='w-full'>
			<div className='mb-4'>
				<label htmlFor='city1' className='block text-white font-semibold mb-2'>
					Pierwsze miasto:
				</label>
				<select
					id='city1'
					value={city1}
					onChange={e => setCity1(Number(e.target.value))}
					className={`w-full p-2 border text-black ${
						errors.city1 ? 'border-red-500 border-2' : 'border-gray-300'
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
				{errors.city1 && <p className='text-red-500 text-sm mt-1'>{errors.city1}</p>}
			</div>

			<div className='mb-4'>
				<label htmlFor='city2' className='block text-white font-semibold mb-2'>
					Drugie miasto:
				</label>
				<select
					id='city2'
					value={city2}
					onChange={e => setCity2(Number(e.target.value))}
					className={`w-full p-2 border text-black ${
						errors.city2 ? 'border-red-500 border-2' : 'border-gray-300'
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
				{errors.city2 && <p className='text-red-500 text-sm mt-1'>{errors.city2}</p>}
			</div>

			<div className='mb-4'>
				<label htmlFor='date' className='block text-white font-semibold mb-2'>
					Data:
				</label>
				<input
					id='date'
					type='date'
					value={date}
					onChange={e => setDate(e.target.value)}
					className={`w-full p-2 border text-black ${
						errors.date ? 'border-red-500 border-2' : 'border-gray-300'
					} rounded-md`}
				/>
				{errors.date && <p className='text-red-500 text-sm mt-1'>{errors.date}</p>}
			</div>

			<Button className='w-full mt-2'>Porównaj miasta</Button>
		</form>
	)
}

export default ComparisonForm
