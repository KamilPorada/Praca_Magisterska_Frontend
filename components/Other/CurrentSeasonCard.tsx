'use client'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf, faSun, faSnowflake, faCloudSun } from '@fortawesome/free-solid-svg-icons'

const CurrentSeasonCard = () => {
	const today = new Date()
	const year = today.getFullYear()

	// Początki pór roku
	const spring = new Date(year, 2, 21)
	const summer = new Date(year, 5, 22)
	const autumn = new Date(year, 8, 23)
	const winter = new Date(year, 11, 22)

	let season = ''
	let icon = faLeaf
	let color = 'bg-green-500'
	let nextSeasonDate = spring
	let nextSeasonName = 'wiosny'

	if (today >= winter || today < spring) {
		season = 'Zima'
		icon = faSnowflake
		color = 'bg-mainColor'
		nextSeasonDate = spring
		nextSeasonName = 'wiosny'
	} else if (today >= spring && today < summer) {
		season = 'Wiosna'
		icon = faLeaf
		color = 'bg-mainColor'
		nextSeasonDate = summer
		nextSeasonName = 'lata'
	} else if (today >= summer && today < autumn) {
		season = 'Lato'
		icon = faSun
		color = 'bg-mainColor'
		nextSeasonDate = autumn
		nextSeasonName = 'jesieni'
	} else if (today >= autumn && today < winter) {
		season = 'Jesień'
		icon = faCloudSun
		color = 'bg-mainColor'
		nextSeasonDate = winter
		nextSeasonName = 'zimy'
	}

	const daysLeft = Math.ceil((nextSeasonDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

	return (
		<div className='flex flex-col items-center justify-center gap-4 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			{/* Ikona i nagłówek */}
			<div className='flex flex-row justify-center items-center gap-3'>
				<FontAwesomeIcon icon={icon} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Aktualna
					<br />
					pora roku
				</h4>
			</div>

			{/* Nazwa sezonu i informacja */}
			<p className='text-xl font-semibold text-center'>{season}</p>
			<p className='text-sm text-white/70 text-center -mt-4'>
				Do {nextSeasonName} pozostało <strong>{daysLeft}</strong> dni
			</p>
		</div>
	)
}

export default CurrentSeasonCard
