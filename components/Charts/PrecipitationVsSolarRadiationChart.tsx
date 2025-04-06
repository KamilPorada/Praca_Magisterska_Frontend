import React from 'react'
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	ZAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts'

type DailyWeatherData = {
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
	sunlightDuration: number // W sekundach
	daylightDuration: number
	maxWindSpeed: number
	windGusts: number
	dominantWindDirection: number
	totalSolarRadiation: number
	evapotranspiration: number
}

type MonthlyWeatherData = {
	id: number
	year: number
	month: number
	maxTemperature: number
	minTemperature: number
	maxFeelsLikeTemperature: number
	minFeelsLikeTemperature: number
	dailySunshine: number // W sekundach
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

type WeatherData = DailyWeatherData | MonthlyWeatherData

type ChartProps = {
	data: WeatherData[]
}

const PrecipitationVsSunlightDurationChart: React.FC<ChartProps> = ({ data }) => {
	// Filtrowanie tylko danych dziennych i miesięcznych
	const filteredData = data.filter(
		item => 'sunlightDuration' in item || 'dailySunshine' in item
	)

	// Przygotowanie danych do wykresu
	const chartData = filteredData.map(item => ({
		precipitationDuration:
			'precipitationDuration' in item
				? item.precipitationDuration
				: item.precipitationTime ?? 0,
		sunlight:
			'sunlightDuration' in item
				? item.sunlightDuration / 3600
				: 'dailySunshine' in item
				? item.dailySunshine / 3600
				: 0,
	}))

	// Sprawdzenie typu danych do etykiety osi X
	const isDaily = 'sunlightDuration' in data[0]

	// Tooltip formatter
	const formatTooltipValue = (value: number) => (value ? value.toFixed(2) + 'h' : '0.00h')

	return (
		<div className='w-1/3 h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>
				Czas trwania opadów a nasłonecznienie
			</h2>
			<ResponsiveContainer width='100%' height='90%'>
				<ScatterChart>
					<CartesianGrid stroke='#ffffff' strokeDasharray='6' strokeWidth={0.2} />
					<XAxis
						type='number'
						dataKey='precipitationDuration'
						name={isDaily ? 'Czas trwania opadów (h)' : 'Łączny czas opadów (h)'}
						stroke='#ffffff'
						tick={{ fontSize: 11, fill: '#ffffff' }}
						tickMargin={15}
					/>
					<YAxis
						type='number'
						dataKey='sunlight'
						name='Czas nasłonecznienia (h)'
						stroke='#ffffff'
						tick={{ fontSize: 12, fill: '#ffffff' }}
						tickMargin={10}
					/>
					<ZAxis range={[30, 30]} />
					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c',
							borderColor: '#1e202c',
							color: '#fff',
							fontSize: '0.8rem',
						}}
						labelStyle={{ color: '#fff' }}
						itemStyle={{ color: '#fff' }}
						formatter={formatTooltipValue}
					/>
					<Legend
						verticalAlign='bottom'
						align='center'
						iconType='circle'
						iconSize={10}
						wrapperStyle={{
							fontSize: '14px',
							paddingTop: '15px',
						}}
					/>
					<Scatter
						name='Opady vs Nasłonecznienie'
						data={chartData}
						fill='#FF4500'
						width={55}
						height={55}
					/>
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	)
}

export default PrecipitationVsSunlightDurationChart
