'use client'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'

ChartJS.register(ArcElement, Tooltip)

const YearProgressCard = () => {
	const today = new Date()
	const year = today.getFullYear()
	const startOfYear = new Date(year, 0, 1)
	const endOfYear = new Date(year, 11, 31)
	const oneDay = 1000 * 60 * 60 * 24

	const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / oneDay) + 1
	const totalDays = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / oneDay) + 1
	const daysLeft = totalDays - dayOfYear

	const data = {
		labels: [],
		datasets: [
			{
				data: [dayOfYear, daysLeft],
				backgroundColor: ['#38bdf8', '#6366f1'],
				borderColor: '#1f2937',
				borderWidth: 5,
				cutout: '70%',
			},
		],
	}

	const options = {
		plugins: {
			legend: {
				display: false,
			},
		},
	}

	return (
		<div className='flex flex-col items-center justify-center gap-4 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			{/* Ikonka w kółku */}
			<div className='flex flex-row justify-center items-center gap-3'>
					<FontAwesomeIcon icon={faChartPie} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Postęp
					<br />
					roku
				</h4>
			</div>

			{/* Wykres */}
			<div className='w-40 h-40'>
				<Doughnut data={data} options={options} />
			</div>

			{/* Opis */}
			<p className='text-sm text-center text-white'>
				Dziś jest <strong>{dayOfYear}</strong> dzień roku {year}, do końca roku pozostało <strong>{daysLeft}</strong>{' '}
				dni.
			</p>
		</div>
	)
}

export default YearProgressCard
