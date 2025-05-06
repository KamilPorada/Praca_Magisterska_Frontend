import React, { useState } from 'react'
import Button from '../UI/Button'

type City = {
	id: number
	name: string
}

type ClimatePredictionFormProps = {
	cities: City[]
	onSubmit: (formData: { cityId: number }) => void
}

const ClimatePredictionForm: React.FC<ClimatePredictionFormProps> = ({ cities, onSubmit }) => {
	const [selectedCity, setSelectedCity] = useState<number | undefined>(cities[0]?.id)
	const [errors, setErrors] = useState<{ city?: boolean }>({})

	const validateForm = () => {
		const newErrors: typeof errors = {}

		if (!selectedCity) {
			newErrors.city = true
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) return

		onSubmit({ cityId: selectedCity! })
	}

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

			<Button className='w-full mt-2'>Wybierz miasto</Button>
		</form>
	)
}

export default ClimatePredictionForm
