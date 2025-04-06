import {
	ComposedChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Line,
	Area,
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
	sunlightDuration: number
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

type WeatherData = DailyWeatherData | MonthlyWeatherData

type ChartProps = {
	data: WeatherData[]
}

const SolarChart: React.FC<ChartProps> = ({ data }) => {
	const isDaily = (data[0] as DailyWeatherData).date !== undefined
	const isMonthly = (data[0] as MonthlyWeatherData).month !== undefined

	const processedData = data.map(item => {
		if (isDaily) {
			const d = item as DailyWeatherData
			return {
				name: d.date,
				sunlight: +(d.sunlightDuration / 3600).toFixed(2),
				daylight: +(d.daylightDuration / 3600).toFixed(2),
				radiation: d.totalSolarRadiation,
			}
		} else if (isMonthly) {
			const m = item as MonthlyWeatherData
			return {
				name: `${m.year}-${m.month.toString().padStart(2, '0')}`,
				sunlight: +(m.dailySunshine / 3600).toFixed(2),
				daylight: +(m.dailyLightHours / 3600).toFixed(2),
				radiation: m.totalSolarRadiation,
			}
		}
		return {}
	})

	return (
		<div className='w-3/5 h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>
				Wykres ilustrujący statystyki solarne
			</h2>
			<ResponsiveContainer width='100%' height='90%'>
				<ComposedChart data={processedData}>
					<CartesianGrid vertical={false} stroke='#ffffff' strokeDasharray='6' strokeWidth={0.2} />
					<XAxis dataKey='name' stroke='#ffffff' tick={{ fontSize: 11, fill: '#ffffff' }} tickMargin={10} />

					<YAxis
						yAxisId='left'
						stroke='#ffffff'
						tick={{ fontSize: 12, fill: '#ffffff' }}
						tickMargin={10}
						label={{
							value: 'Godziny',
							angle: -90,
							position: 'insideLeft',
							fill: '#ffffff',
							fontSize: 12,
						}}
					/>
					<YAxis
						yAxisId='right'
						orientation='right'
						stroke='#ffffff'
						tick={{ fontSize: 12, fill: '#ffffff' }}
						tickMargin={10}
						label={{
							value: 'MJ/m²',
							angle: 90,
							position: 'insideRight',
							fill: '#ffffff',
							fontSize: 12,
						}}
					/>

					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c',
							borderColor: '#1e202c',
							color: '#fff',
							fontSize: '0.8rem',
						}}
						labelStyle={{ color: '#fff' }}
						itemStyle={{ color: '#fff' }}
						formatter={(value: any, name: any) => {
							if (name === 'Promieniowanie') return [`${value.toFixed(2)} MJ/m²`, name]
							return [`${value.toFixed(2)} h`, name]
						}}
					/>

					<Legend
						verticalAlign='bottom'
						iconType='circle'
						iconSize={10}
						wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }}
					/>

					<Bar yAxisId='left' dataKey='sunlight' fill='#ffb300' name='Nasłonecznienie' />
					<Line
						yAxisId='left'
						type='monotone'
						dataKey='daylight'
						stroke='#0288d1'
						name='Długość dnia'
						strokeWidth={2}
						dot={false}
					/>
					<Area
						yAxisId='right'
						type='monotone'
						dataKey='radiation'
						stroke='#26a69a'
						fill='#26a69a'
						name='Promieniowanie'
						fillOpacity={0.35}
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	)
}

export default SolarChart
