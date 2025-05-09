import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

interface MonthlyWeatherData {
	id: number
	year: number
	month: number
	maxTemperature: number
	minTemperature: number
	maxFeelsLikeTemperature: number
	minFeelsLikeTemperature: number
	dailySunshine: number
	dailyLightHours: number
	maxWindSpeed: number
	windGusts: number
	totalPrecipitation: number
	rain: number
	snow: number
	precipitationTime: number
	totalSolarRadiation: number
	evapotranspiration: number
	weatherCode: number
	dominantWindDirection: number
}

interface MonthlyWeatherDataTableProps {
	monthlyData: MonthlyWeatherData[]
}

const MonthlyWeatherDataTable: React.FC<MonthlyWeatherDataTableProps> = ({ monthlyData }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 50

	const totalPages = Math.ceil(monthlyData.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const paginatedData = monthlyData.slice(startIndex, startIndex + itemsPerPage)

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const getMonthName = (month: number) => {
		const months = [
			'Styczeń',
			'Luty',
			'Marzec',
			'Kwiecień',
			'Maj',
			'Czerwiec',
			'Lipiec',
			'Sierpień',
			'Wrzesień',
			'Październik',
			'Listopad',
			'Grudzień',
		]
		return months[month - 1]
	}

	return (
		<div className='flex flex-col justify-center items-center mt-4'>
			<div className='w-[270px] sm:w-[420px] md:w-[630px] lg:w-[820px] xl:w-[1050px] overflow-x-auto shadow-md rounded-sm'>
				<table className='bg-gray-900 text-sm text-left text-white'>
					<thead className='text-white text-center'>
						<tr className='bg-gray-800'>
							<th className='px-4 py-2 border-t border-l border-gray-500'>L.P.</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Rok</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Miesiąc</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Średnia maksymalna temperatura (°C)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Średnia minimalna temperatura (°C)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Średnia maksymalna odczuwalna temperatura (°C)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Średnia minimalna odczuwalna temperatura (°C)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Średnie nasłonecznienie dzienne (godz.)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Średnia ilość światła dziennego (godz.)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Średnia prędkość wiatru (km/h)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Średnie porywy wiatru (km/h)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Suma opadów (mm)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Suma opadów deszczu (mm)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Suma opadów śniegu (mm)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Sumaryczny czas opadów (godz.)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Suma promieniowania słonecznego (MJ/m²)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Sumaryczna ewapotranspiracja (mm)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Dominujący kierunek wiatru (°)</th>
							<th className='px-4 py-2 border-t border-l border-r border-gray-500'>Dominujący kod pogody</th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((data, index) => (
							<tr key={data.id} className='text-center border-t border-b border-gray-500'>
								<td className='px-4 py-2 border-l border-gray-500'>{startIndex + index + 1}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.year}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{getMonthName(data.month)}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.maxTemperature}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.minTemperature}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.maxFeelsLikeTemperature}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.minFeelsLikeTemperature}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{(data.dailySunshine / 3600).toFixed(2)}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{(data.dailyLightHours / 3600).toFixed(2)}</td>

								<td className='px-4 py-2 border-b border-gray-500'>{data.maxWindSpeed}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.windGusts}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.totalPrecipitation}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.rain}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.snow}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.precipitationTime}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.totalSolarRadiation}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.evapotranspiration}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.dominantWindDirection}</td>
								<td className='px-4 py-2 border-r border-gray-500'>{data.weatherCode}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='flex justify-center mt-4 space-x-2'>
				<button
					onClick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					className={`px-6 py-2 rounded-full ${currentPage === 1 ? 'bg-gray-300' : 'bg-mainColor text-white'}`}>
					<FontAwesomeIcon icon={faChevronLeft} /> {/* Strzałka w lewo */}
				</button>
				<span className='px-6 py-2'>{`Strona ${currentPage} z ${totalPages}`}</span>
				<button
					onClick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`px-6 py-2 rounded-full ${
						currentPage === totalPages ? 'bg-gray-300' : 'bg-mainColor text-white'
					}`}>
					<FontAwesomeIcon icon={faChevronRight} /> {/* Strzałka w prawo */}
				</button>
			</div>
		</div>
	)
}

export default MonthlyWeatherDataTable
