import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

interface DailyWeatherData {
	id: number
	date: string
	maxTemperature: number
	minTemperature: number
	maxFeelTemperature: number
	minFeelTemperature: number
	totalPrecipitation: number
	rain: number
	rainSnow: number
	snow: number
	precipitationDuration: number
	weatherCode: number
	sunrise: string
	sunset: string
	sunlightDuration: number
	daylightDuration: number
	maxWindSpeed: number
	windGusts: number
	dominantWindDirection: number
	totalSolarRadiation: number
	evapotranspiration: number
}

interface DailyWeatherDataTableProps {
	dailyData: DailyWeatherData[]
}

const isDaylightSavingTime = (date: Date) => {
	// Funkcja do obliczania, czy data mieści się w okresie letnim (od ostatniej niedzieli marca do ostatniej niedzieli października)
	const year = date.getFullYear()
	const lastSundayMarch = new Date(year, 2, 31 - new Date(year, 2, 31).getDay()) // ostatnia niedziela marca
	const lastSundayOctober = new Date(year, 9, 31 - new Date(year, 9, 31).getDay()) // ostatnia niedziela października

	// Sprawdzamy, czy data mieści się pomiędzy ostatnią niedzielą marca a ostatnią niedzielą października
	return date >= lastSundayMarch && date <= lastSundayOctober
}

const DailyWeatherDataTable: React.FC<DailyWeatherDataTableProps> = ({ dailyData }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 50

	const totalPages = Math.ceil(dailyData.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const paginatedData = dailyData.slice(startIndex, startIndex + itemsPerPage)

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const adjustSunTimeForDST = (time: string) => {
		const date = new Date(time)
		// Jeśli czas letni, dodajemy godzinę
		if (isDaylightSavingTime(date)) {
			date.setHours(date.getHours() + 1)
		}
		return date.toLocaleTimeString('pl-PL', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		})
	}

	return (
		<div className='flex flex-col justify-center items-center mt-4'>
			<div className='w-[270px] sm:w-[420px] md:w-[630px] lg:w-[820px] xl:w-[1050px] overflow-x-auto shadow-md rounded-sm'>
				<table className='bg-gray-900 text-sm text-left text-white'>
					<thead className='text-white text-center'>
						<tr className='bg-gray-800 '>
							<th className='px-4 py-2 border-t border-l border-gray-500'>L.P.</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Data</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Maksymalna temperatura (°C)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Minimalna temperatura (°C)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Maksymalna odczuwalna temperatura (°C)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Minimalna odczuwalna temperatura (°C)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Całkowite opady (mm)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Deszcz (mm)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Deszcz ze śniegiem (mm)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Śnieg (mm)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Czas opadów (godz.)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Wschód słońca</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Zachód słońca</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Czas nasłonecznienia (godz.)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Ilość światła dziennego (godz.)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Prędkość wiatru (km/h)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Porywy wiatru (km/h)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Dominujący kierunek wiatru (°)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Suma promieniowania słonecznego (MJ/m²)</th>
							<th className='px-4 py-2 border-t border-l border-gray-500'>Ewapotranspiracja (mm)</th>
							<th className='px-4 py-2 border-t border-l border-r border-gray-500'>Kod pogody</th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((data, index) => (
							<tr key={data.id} className='text-center border-t border-b border-gray-500'>
								<td className='px-4 py-2 border-l border-gray-500'>{startIndex + index + 1}</td>
								<td className='px-6 py-2 border-b border-gray-500'>
									{new Date(data.date).toLocaleDateString('pl-PL', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									})}
								</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.maxTemperature}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.minTemperature}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.maxFeelTemperature}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.minFeelTemperature}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.totalPrecipitation}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.rain}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.rainSnow}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.snow}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.precipitationDuration}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{adjustSunTimeForDST(data.sunrise)}</td>
								<td className='px-4 py-2 border-b'>{adjustSunTimeForDST(data.sunset)}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{(data.sunlightDuration / 3600).toFixed(2)}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{(data.daylightDuration / 3600).toFixed(2)}</td>

								<td className='px-4 py-2 border-b border-gray-500'>{data.maxWindSpeed}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.windGusts}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.dominantWindDirection}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.totalSolarRadiation}</td>
								<td className='px-4 py-2 border-b border-gray-500'>{data.evapotranspiration}</td>
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

export default DailyWeatherDataTable
