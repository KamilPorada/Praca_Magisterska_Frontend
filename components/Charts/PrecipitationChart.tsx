import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, PieLabelRenderProps } from 'recharts'

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

type YearlyWeatherData = {
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

type WeatherData = DailyWeatherData | MonthlyWeatherData | YearlyWeatherData

type ChartProps = {
	data: WeatherData[]
}

// Własna funkcja do renderowania etykiety procentowej
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
	if (percent == null) return null

	const RADIAN = Math.PI / 180
	const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5
	const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN)
	const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN)

	return (
		<text x={x} y={y} fill='white' textAnchor='middle' dominantBaseline='central' fontSize={14}>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	)
}

const PrecipitationChart: React.FC<ChartProps> = ({ data }) => {
	const totalRain = data.reduce((sum, item) => sum + (item.rain || 0), 0)
	const totalSnow = data.reduce((sum, item) => sum + (item.snow || 0), 0)

	const chartData = [
		{ name: 'Deszcz', value: totalRain, color: '#1E90FF' },
		{ name: 'Śnieg', value: totalSnow, color: '#ADD8E6' },
	].filter(item => item.value > 0)

	return (
		<div className='w-1/4 h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>Procentowy udział opadów</h2>
			<ResponsiveContainer width='100%' height='90%'>
				<PieChart>
					<Pie
						data={chartData}
						dataKey='value'
						nameKey='name'
						cx='50%'
						cy='50%'
						outerRadius='80%'
						labelLine={false}
						label={renderCustomizedLabel}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c',
							borderColor: '#1e202c',
							color: '#fff',
							fontSize: '0.8rem',
						}}
						labelStyle={{ color: '#fff' }}
						itemStyle={{ color: '#fff' }}
						formatter={(value: any) => `${value.toFixed(2)}mm`}
					/>
					<Legend
						verticalAlign='bottom'
						align='center'
						iconType='circle'
						iconSize={10}
						wrapperStyle={{ fontSize: '14px', paddingTop: '15px', color: 'white' }}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}

export default PrecipitationChart
