import React from 'react'
import { useState } from 'react'

interface YearlyWeatherData {
	id: number
	year: number
	maxTemperature: number
	minTemperature: number
	maxFeelsLikeTemperature: number
	minFeelsLikeTemperature: number
	maxWindSpeed: number
	windGusts: number
	totalPrecipitation: number
	rain: number
	snow: number
	precipitationTime: number
	dominantWindDirection: number
}

interface YearlyWeatherDataTableProps {
	yearlyData: YearlyWeatherData[]
}

const YearlyWeatherDataTable: React.FC<YearlyWeatherDataTableProps> = ({ yearlyData }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 50

	const totalPages = Math.ceil(yearlyData.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const paginatedData = yearlyData.slice(startIndex, startIndex + itemsPerPage)

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page)
		}
	}
	return (
		<div className='mt-6'>
			<h2 className='text-xl font-semibold text-center mb-4'>Dane pogodowe roczne</h2>
			<div className='overflow-x-auto shadow-md rounded-lg'>
				<table className='min-w-full bg-white text-sm text-left text-gray-800'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='px-4 py-2 border-b'>L.P.</th>
							<th className='px-4 py-2 border-b'>Rok</th>
							<th className='px-4 py-2 border-b'>Maksymalna temperatura (°C)</th>
							<th className='px-4 py-2 border-b'>Minimalna temperatura (°C)</th>
							<th className='px-4 py-2 border-b'>Maksymalna odczuwalna temperatura (°C)</th>
							<th className='px-4 py-2 border-b'>Minimalna odczuwalna temperatura (°C)</th>
							<th className='px-4 py-2 border-b'>Maksymalna prędkość wiatru (km/h)</th>
							<th className='px-4 py-2 border-b'>Porywy wiatru (km/h)</th>
							<th className='px-4 py-2 border-b'>Całkowite opady (mm)</th>
							<th className='px-4 py-2 border-b'>Deszcz (mm)</th>
							<th className='px-4 py-2 border-b'>Śnieg (mm)</th>
							<th className='px-4 py-2 border-b'>Czas opadów (godz.)</th>
							<th className='px-4 py-2 border-b'>Dominujący kierunek wiatru (°)</th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((data, index) => (
							<tr key={data.id} className='odd:bg-gray-50 even:bg-gray-100'>
								<td className='px-4 py-2 border-b'>{startIndex + index + 1}</td>
								<td className='px-4 py-2 border-b'>{data.year}</td>
								<td className='px-4 py-2 border-b'>{data.maxTemperature}</td>
								<td className='px-4 py-2 border-b'>{data.minTemperature}</td>
								<td className='px-4 py-2 border-b'>{data.maxFeelsLikeTemperature}</td>
								<td className='px-4 py-2 border-b'>{data.minFeelsLikeTemperature}</td>
								<td className='px-4 py-2 border-b'>{data.maxWindSpeed}</td>
								<td className='px-4 py-2 border-b'>{data.windGusts}</td>
								<td className='px-4 py-2 border-b'>{data.totalPrecipitation}</td>
								<td className='px-4 py-2 border-b'>{data.rain}</td>
								<td className='px-4 py-2 border-b'>{data.snow}</td>
								<td className='px-4 py-2 border-b'>{data.precipitationTime}</td>
								<td className='px-4 py-2 border-b'>{data.dominantWindDirection}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='flex justify-center mt-4 space-x-2'>
				<button
					onClick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}>
					Poprzednia
				</button>
				<span className='px-4 py-2'>{`Strona ${currentPage} z ${totalPages}`}</span>
				<button
					onClick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}>
					Następna
				</button>
			</div>
		</div>
	)
}

export default YearlyWeatherDataTable
