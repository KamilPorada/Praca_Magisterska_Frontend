import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

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

const PrecipitationChart: React.FC<ChartProps> = ({ data }) => {
	// Sumowanie wartości opadów
	const totalRain = data.reduce((sum, item) => sum + (item.rain || 0), 0)
	const totalSnow = data.reduce((sum, item) => sum + (item.snow || 0), 0)

	// Dane do wykresu (dodajemy tylko wartości > 0)
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
						label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c', // ciemne tło
							borderColor: '#1e202c', // ciemna ramka
							color: '#fff', // biały tekst
							fontSize: '0.8rem',
						}}
						labelStyle={{ color: '#fff' }} // kolor etykiety
						itemStyle={{ color: '#fff' }} // biały tekst dla wartości w tooltipie
						formatter={(value: any) => `${value.toFixed(2)}mm`} // Zaokrąglanie do 2 miejsc po przecinku i dodanie stopni C
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
