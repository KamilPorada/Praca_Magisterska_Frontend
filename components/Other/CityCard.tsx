'use client'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity } from '@fortawesome/free-solid-svg-icons' // Można dodać inną ikonę miasta

const CityCard = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-4 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			{/* Ikona i nagłówek */}
			<div className='flex flex-row justify-center items-center gap-3'>
				<FontAwesomeIcon icon={faCity} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Dana dla
					<br />
					miasta
				</h4>
			</div>

			{/* Temperatura */}
			<p className='text-3xl font-semibold text-center'>Warszawa
			</p>
		</div>
	)
}

export default CityCard
