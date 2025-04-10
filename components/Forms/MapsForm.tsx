import React, { useState } from 'react'
import Button from '../UI/Button'

type MapsFormProps = {
	onSubmit: (selectedDate: string) => void
}

const MapsForm: React.FC<MapsFormProps> = ({ onSubmit }) => {
	const [selectedDate, setSelectedDate] = useState<string>('')
	const [error, setError] = useState<string>('')

	const MIN_DATE = '1950-01-01'
	const MAX_DATE = '2024-12-31'

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!selectedDate) {
			setError('Wybierz datę.')
			return
		}

		if (selectedDate < MIN_DATE || selectedDate > MAX_DATE) {
			setError(`Data musi być między ${MIN_DATE} a ${MAX_DATE}.`)
			return
		}

		setError('')
		onSubmit(selectedDate)
	}

	return (
		<div className='w-full max-w-md mx-auto'>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<input
						type='date'
						value={selectedDate}
						onChange={e => setSelectedDate(e.target.value)}
						className={`w-full p-2 border text-black ${
							error ? 'border-red-500 border-2' : 'border-gray-300'
						} rounded-md`}
					/>
					{error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
				</div>

				<Button className='w-full mt-2'>Wyświetl na mapie</Button>
			</form>
		</div>
	)
}

export default MapsForm
