import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'

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

const formatTime = (value: number) => {
	if (isNaN(value) || value < 0) return 'Nieznany czas'
	return `${value}h` // Po prostu dodajemy "h" bez zaokrąglania
}

const PrecipitationDurationChart: React.FC<ChartProps> = ({ data }) => {
	// Rozpoznanie typu danych
	const isDaily = 'sunlightDuration' in data[0] // Sprawdzenie, czy mamy dane dzienne
	const isMonthly = 'dailySunshine' in data[0] // Sprawdzenie, czy mamy dane miesięczne
	const isYearly = !isDaily && !isMonthly
	// Przetwarzanie danych do formatu wykresu
	const chartData = data.map(item => {
		if (isDaily) {
			return {
				name: (item as DailyWeatherData).date,
				precipitationHours: (item as DailyWeatherData).precipitationDuration,
			}
		} else if (isMonthly) {
			return {
				name: `${(item as MonthlyWeatherData).year}-${(item as MonthlyWeatherData).month.toString().padStart(2, '0')}`,
				precipitationHours: (item as MonthlyWeatherData).precipitationTime,
			}
		} else if (isYearly) {
			return {
				name: `${(item as YearlyWeatherData).year}`,
				precipitationHours: (item as YearlyWeatherData).precipitationTime,
			}
		}
		return {}
	})

	console.log('isDaily:', isDaily, 'isMonthly:', isMonthly, 'isYearly:', isYearly) // Logowanie warunków

	return (
		<div className={`${isYearly ? 'w-full' : 'w-3/5'} h-96 bg-secondaryColor p-4 rounded-lg shadow-lg`}>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>
				Wykrees słupkowy ilustrujący czas trwania opadów
			</h2>
			<ResponsiveContainer width='100%' height='85%'>
				<AreaChart data={chartData}>
					<CartesianGrid vertical={false} stroke='#ffffff' strokeDasharray='4' strokeWidth={0.3} />
					<XAxis dataKey='name' stroke='#ffffff' tick={{ fontSize: 11, fill: '#ffffff' }} tickMargin={15} />
					<YAxis
						stroke='#ffffff'
						tick={{ fontSize: 12, fill: '#ffffff' }} // Zmiana czcionki i koloru
						tickMargin={10}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c', // ciemne tło
							borderColor: '#1e202c', // ciemna ramka
							color: '#fff', // biały tekst
							fontSize: '0.8rem',
						}}
						labelStyle={{ color: '#fff' }} // kolor etykiety
						itemStyle={{ color: '#fff' }} // biały tekst dla wartości w tooltipie
						formatter={(value: any) => formatTime(value)} // Format hh:mm
					/>{' '}
					<Area
						type='step'
						dataKey='precipitationHours'
						name='Czas trwania opadów'
						stroke='#00CED1' // Neonowa cyjanowa
						fill='rgba(0, 206, 209, 0.4)' // Półprzezroczysty neonowy cyjan
					/>
					<Legend
						verticalAlign='bottom'
						align='center'
						iconType='circle'
						iconSize={10}
						wrapperStyle={{ fontSize: '14px', paddingTop: '15px', color: 'white' }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}

export default PrecipitationDurationChart
