'use client'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons'

const WeekInfoCard = () => {
	const [currentWeek, setCurrentWeek] = useState<number | null>(null)
	const [weeksLeft, setWeeksLeft] = useState<number | null>(null)

	useEffect(() => {
		const getWeekNumber = (date: Date): number => {
			const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
			const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
			return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
		}

		const today = new Date()
		const totalWeeks = 52
		const weekNow = getWeekNumber(today)
		setCurrentWeek(weekNow)
		setWeeksLeft(totalWeeks - weekNow)
	}, [])

	return (
		<div className='flex flex-col items-center justify-center gap-4 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			{/* Ikona i nagłówek */}
			<div className='flex flex-row justify-center items-center gap-3'>
				<FontAwesomeIcon icon={faCalendarWeek} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Bieżący
					<br />
					tydzień
				</h4>
			</div>

			{/* Dane */}
			<p className='text-2xl font-semibold text-center'>
				{currentWeek !== null ? `Tydzień ${currentWeek}` : 'Ładowanie...'}
			</p>
			<p className='text-center text-white/70 -mt-4'>
				{weeksLeft !== null ? `Pozostało ${weeksLeft} tygodnie` : ''}
			</p>
		</div>
	)
}

export default WeekInfoCard
