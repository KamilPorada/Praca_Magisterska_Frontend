'use client'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

const CurrentDateCard = () => {
	const today = new Date()
	const dayOfWeek = today.toLocaleDateString('pl-PL', { weekday: 'long' })
	const day = today.getDate()
	const month = today.toLocaleDateString('pl-PL', { month: 'long' })
	const year = today.getFullYear()

	return (
		<div className='flex flex-col items-center justify-center gap-4 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			{/* Ikonka w kółku */}
			<div className='flex flex-row justify-center items-center gap-3'>
					<FontAwesomeIcon icon={faCalendarAlt} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Dzisiejsza
					<br />
					data
				</h4>
			</div>
				<p className='text-xl font-semibold text-center'>
					{dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, {day} {month} {year}
				</p>
		</div>
	)
}

export default CurrentDateCard
