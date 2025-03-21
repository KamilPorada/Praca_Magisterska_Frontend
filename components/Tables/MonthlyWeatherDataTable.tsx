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
			<div className='w-[270px] sm:w-[420px] md:w-[630px] lg:w-[820px] xl:w-[1050px] overflow-x-auto shadow-md rounded-lg'>
				<table className='bg-white text-sm text-left text-gray-800'>
					<thead className='bg-mainColor text-white text-center'>
						<tr>
							<th className='px-6 py-2 border-b'>L.P.</th>
							<th className='px-6 py-2 border-b'>Rok</th>
							<th className='px-6 py-2 border-b'>Miesiąc</th>
							<th className='px-6 py-2 border-b'>Średnia maksymalna temperatura (°C)</th>
							<th className='px-6 py-2 border-b'>Średnia minimalna temperatura (°C)</th>
							<th className='px-6 py-2 border-b'>Średnia maksymalna odczuwalna temperatura (°C)</th>
							<th className='px-6 py-2 border-b'>Średnia minimalna odczuwalna temperatura (°C)</th>
							<th className='px-6 py-2 border-b'>Średnie nasłonecznienie dzienne (godz.)</th>
							<th className='px-6 py-2 border-b'>Średnia ilość światła dziennego (godz.)</th>
							<th className='px-6 py-2 border-b'>Średnia prędkość wiatru (km/h)</th>
							<th className='px-6 py-2 border-b'>Średnie porywy wiatru (km/h)</th>
							<th className='px-6 py-2 border-b'>Suma opadów (mm)</th>
							<th className='px-6 py-2 border-b'>Suma opadów deszczu (mm)</th>
							<th className='px-6 py-2 border-b'>Suma opadów śniegu (mm)</th>
							<th className='px-6 py-2 border-b'>Sumaryczny czas opadów (godz.)</th>
							<th className='px-6 py-2 border-b'>Suma promieniowania słonecznego (MJ/m²)</th>
							<th className='px-6 py-2 border-b'>Sumaryczna ewapotranspiracja (mm)</th>
							<th className='px-6 py-2 border-b'>Dominujący kierunek wiatru (°)</th>
							<th className='px-6 py-2 border-b'>Dominujący kod pogody</th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((data, index) => (
							<tr key={data.id} className='odd:bg-gray-200 even:bg-gray-300 text-center'>
								<td className='px-6 py-2 border-b'>{startIndex + index + 1}</td>
								<td className='px-6 py-2 border-b'>{data.year}</td>
								<td className='px-6 py-2 border-b'>{getMonthName(data.month)}</td>
								<td className='px-6 py-2 border-b'>{data.maxTemperature}</td>
								<td className='px-6 py-2 border-b'>{data.minTemperature}</td>
								<td className='px-6 py-2 border-b'>{data.maxFeelsLikeTemperature}</td>
								<td className='px-6 py-2 border-b'>{data.minFeelsLikeTemperature}</td>
								<td className='px-6 py-2 border-b'>{(data.dailySunshine / 3600).toFixed(2)}</td>
								<td className='px-6 py-2 border-b'>{(data.dailyLightHours / 3600).toFixed(2)}</td>

								<td className='px-6 py-2 border-b'>{data.maxWindSpeed}</td>
								<td className='px-6 py-2 border-b'>{data.windGusts}</td>
								<td className='px-6 py-2 border-b'>{data.totalPrecipitation}</td>
								<td className='px-6 py-2 border-b'>{data.rain}</td>
								<td className='px-6 py-2 border-b'>{data.snow}</td>
								<td className='px-6 py-2 border-b'>{data.precipitationTime}</td>
								<td className='px-6 py-2 border-b'>{data.totalSolarRadiation}</td>
								<td className='px-6 py-2 border-b'>{data.evapotranspiration}</td>
								<td className='px-6 py-2 border-b'>{data.dominantWindDirection}</td>
								<td className='px-6 py-2 border-b'>{data.weatherCode}</td>
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
