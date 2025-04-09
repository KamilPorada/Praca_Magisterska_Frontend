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

type CorrelationChartProps = {
	values1: number[]
	values2: number[]
	column1: string
	column2: string
}

const CorrelationChart: React.FC<CorrelationChartProps> = ({ values1, values2, column1, column2 }) => {
	// Przygotowanie danych do wykresu (łączenie values1 i values2)
	const chartData = values1.map((value1, index) => ({
		column1: value1, // Oś X
		column2: values2[index], // Oś Y
	}))

	// Tooltip formatter
	const formatTooltipValue = (value: number) => (value ? value.toFixed(2) : '0.00')

	// Mapowanie nazw kolumn na polski
	const columnNameMap: { [key: string]: string } = {
		maxTemperature: 'maksymalna temperatura',
		minTemperature: 'minimalna temperatura',
		maxFeelTemperature: 'maksymalna odczuwalna temperatura',
		minFeelTemperature: 'minimalna odczuwalna temperatura',
		totalPrecipitation: 'całkowite opady',
		rain: 'deszcz',
		rainSnow: 'deszcz/śnieg',
		snow: 'śnieg',
		precipitationDuration: 'czas opadów',
		weatherCode: 'kod pogody',
		sunlightDuration: 'czas nasłonecznienia',
		daylightDuration: 'czas światła dziennego',
		maxWindSpeed: 'maksymalna prędkość wiatru',
		windGusts: 'porywy wiatru',
		dominantWindDirection: 'dominujący kierunek wiatru',
		totalSolarRadiation: 'całkowite promieniowanie słoneczne',
		evapotranspiration: 'ewapotranspiracja',
	}

	return (
		<div className='w-full h-96 bg-gray-800 p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>
				Korelacja pomiędzy kolumną {columnNameMap[column1] || column1}
				<br /> a kolumną {columnNameMap[column2] || column2}
			</h2>
			<ResponsiveContainer width='100%' height='80%'>
				<ScatterChart>
					<CartesianGrid stroke='#ffffff' strokeDasharray='6' strokeWidth={0.2} />
					<XAxis
						type='number'
						dataKey='column1'
						name={`${columnNameMap[column1] || column1}`}
						stroke='#ffffff'
						tick={{ fontSize: 11, fill: '#ffffff' }}
						tickMargin={15}
					/>
					<YAxis
						type='number'
						dataKey='column2'
						name={`${columnNameMap[column2] || column2}`}
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
						name={`${columnNameMap[column1] || column1} vs ${columnNameMap[column2] || column2}`}
						data={chartData}
						fill='#1E90FF' // Kolor niebieski
						width={55}
						height={55}
					/>
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	)
}

export default CorrelationChart
