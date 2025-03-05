import React, { useState } from 'react'

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

	return (
		<div className='mt-6'>
			<h2 className='text-xl font-semibold text-center mb-4'>Dane pogodowe dzienne</h2>
			<div className='overflow-x-auto shadow-md rounded-lg'>
				<table className='min-w-full bg-white text-sm text-left text-gray-800'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='px-4 py-2 border-b'>L.P.</th>
							<th className='px-4 py-2 border-b'>Data</th>
							<th className='px-4 py-2 border-b'>Maksymalna temperatura (°C)</th>
							<th className='px-4 py-2 border-b'>Minimalna temperatura (°C)</th>
							<th className='px-4 py-2 border-b'>Maksymalna odczuwalna temperatura (°C)</th>
							<th className='px-4 py-2 border-b'>Minimalna odczuwalna temperatura (°C)</th>
							<th className='px-4 py-2 border-b'>Całkowite opady (mm)</th>
							<th className='px-4 py-2 border-b'>Deszcz (mm)</th>
							<th className='px-4 py-2 border-b'>Deszcz ze śniegiem (mm)</th>
							<th className='px-4 py-2 border-b'>Śnieg (mm)</th>
							<th className='px-4 py-2 border-b'>Czas opadów (godz.)</th>
							<th className='px-4 py-2 border-b'>Kod pogody</th>
							<th className='px-4 py-2 border-b'>Wschód słońca</th>
							<th className='px-4 py-2 border-b'>Zachód słońca</th>
							<th className='px-4 py-2 border-b'>Czas nasłonecznienia (sekundy)</th>
							<th className='px-4 py-2 border-b'>Ilość światła dziennego (sekundy)</th>
							<th className='px-4 py-2 border-b'>Prędkość wiatru (km/h)</th>
							<th className='px-4 py-2 border-b'>Porywy wiatru (km/h)</th>
							<th className='px-4 py-2 border-b'>Dominujący kierunek wiatru (°)</th>
							<th className='px-4 py-2 border-b'>Suma promieniowania słonecznego</th>
							<th className='px-4 py-2 border-b'>Ewapotranspiracja</th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((data, index) => (
							<tr key={data.id} className='odd:bg-gray-50 even:bg-gray-100'>
								<td className='px-4 py-2 border-b'>{startIndex + index + 1}</td>
								<td className='px-4 py-2 border-b'>{data.date}</td>
								<td className='px-4 py-2 border-b'>{data.maxTemperature}</td>
								<td className='px-4 py-2 border-b'>{data.minTemperature}</td>
								<td className='px-4 py-2 border-b'>{data.maxFeelTemperature}</td>
								<td className='px-4 py-2 border-b'>{data.minFeelTemperature}</td>
								<td className='px-4 py-2 border-b'>{data.totalPrecipitation}</td>
								<td className='px-4 py-2 border-b'>{data.rain}</td>
								<td className='px-4 py-2 border-b'>{data.rainSnow}</td>
								<td className='px-4 py-2 border-b'>{data.snow}</td>
								<td className='px-4 py-2 border-b'>{data.precipitationDuration}</td>
								<td className='px-4 py-2 border-b'>{data.weatherCode}</td>
								<td className='px-4 py-2 border-b'>{data.sunrise}</td>
								<td className='px-4 py-2 border-b'>{data.sunset}</td>
								<td className='px-4 py-2 border-b'>{data.sunlightDuration}</td>
								<td className='px-4 py-2 border-b'>{data.daylightDuration}</td>
								<td className='px-4 py-2 border-b'>{data.maxWindSpeed}</td>
								<td className='px-4 py-2 border-b'>{data.windGusts}</td>
								<td className='px-4 py-2 border-b'>{data.dominantWindDirection}</td>
								<td className='px-4 py-2 border-b'>{data.totalSolarRadiation}</td>
								<td className='px-4 py-2 border-b'>{data.evapotranspiration}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='flex justify-center mt-4 space-x-2'>
				<button
					onClick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
				>
					Poprzednia
				</button>
				<span className='px-4 py-2'>{`Strona ${currentPage} z ${totalPages}`}</span>
				<button
					onClick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
				>
					Następna
				</button>
			</div>
		</div>
	)
}

export default DailyWeatherDataTable
