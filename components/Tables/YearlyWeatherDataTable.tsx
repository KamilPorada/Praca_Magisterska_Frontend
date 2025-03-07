import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

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
		<div className='flex flex-col justify-center items-center mt-4'>
			<div className='w-[270px] sm:w-[420px] md:w-[630px] lg:w-[820px] xl:w-[1050px] overflow-x-auto shadow-md rounded-lg'>
				<table className='bg-white text-sm text-left text-gray-800'>
					<thead className='bg-mainColor text-white'>
						<tr className='text-center'>
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
							<tr key={data.id} className='odd:bg-gray-200 even:bg-gray-300 text-center'>
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
					className={`px-4 py-2 rounded-full ${currentPage === 1 ? 'bg-gray-300' : 'bg-mainColor text-white'}`}>
					<FontAwesomeIcon icon={faChevronLeft} /> {/* Strzałka w lewo */}
				</button>
				<span className='px-4 py-2'>{`Strona ${currentPage} z ${totalPages}`}</span>
				<button
					onClick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`px-4 py-2 rounded-full ${currentPage === totalPages ? 'bg-gray-300' : 'bg-mainColor text-white'}`}>
					<FontAwesomeIcon icon={faChevronRight} /> {/* Strzałka w prawo */}
				</button>
			</div>
		</div>
	)
}

export default YearlyWeatherDataTable
