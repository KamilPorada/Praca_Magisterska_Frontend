import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

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
const WindDirectionChart: React.FC<ChartProps> = ({ data }) => {
	// Konwersja wartości kierunku wiatru na czytelne etykiety (N, NE, E, SE, ...)
	const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
	const directionValues = [0, 45, 90, 135, 180, 225, 270, 315]

	// Przygotowanie danych do wykresu
	const processedData = windDirections.map((dir, index) => {
		const filteredData = data.filter(item => {
			const windAngle = item.dominantWindDirection
			const lowerBound = directionValues[index] - 22.5
			const upperBound = directionValues[index] + 22.5
			return (windAngle >= lowerBound && windAngle < upperBound) || (index === 0 && (windAngle >= 337.5 || windAngle < 22.5))
		})
		return {
			direction: dir,
			count: filteredData.length, // Liczba wystąpień danego kierunku
		}
	})

	return (
		<div className='w-full h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>
				Rozkład dominujących kierunków wiatru
			</h2>
			<ResponsiveContainer width='100%' height='90%'>
				<RadarChart cx='50%' cy='50%' outerRadius='80%' data={processedData}>
					<PolarGrid stroke='#ffffff' strokeOpacity={0.2} />
					<PolarAngleAxis dataKey='direction' tick={{ fill: '#ffffff', fontSize: 12 }} />
					<PolarRadiusAxis tick={{ fill: '#ffffff', fontSize: 10 }} />
					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c',
							borderColor: '#1e202c',
							color: '#fff',
							fontSize: '0.8rem',
						}}
					/>
					<Radar name='Częstotliwość' dataKey='count' stroke='#42a5f5' fill='#42a5f5' fillOpacity={0.6} />
				</RadarChart>
			</ResponsiveContainer>
		</div>
	)
}

export default WindDirectionChart
