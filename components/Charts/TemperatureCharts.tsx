import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

type TemperatureChartProps = {
	data: WeatherData[]
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
	// Sprawdzamy, jaki typ danych został przekazany
	const isDaily = (data[0] as DailyWeatherData).date !== undefined
	const isMonthly = (data[0] as MonthlyWeatherData).month !== undefined
	const isYearly = (data[0] as YearlyWeatherData).year !== undefined

	// Tworzymy nowy zbiór danych z obliczoną średnią temperaturą
	const processedData = data.map(item => {
		if (isDaily) {
			// Obsługuje dane dzienne
			return {
				name: (item as DailyWeatherData).date,
				avgTemperature: ((item as DailyWeatherData).maxTemperature + (item as DailyWeatherData).minTemperature) / 2,
				avgFeelsLikeTemperature:
					((item as DailyWeatherData).maxFeelTemperature + (item as DailyWeatherData).minFeelTemperature) / 2,
			}
		} else if (isMonthly) {
			// Obsługuje dane miesięczne
			return {
				name: `${(item as MonthlyWeatherData).year}-${(item as MonthlyWeatherData).month.toString().padStart(2, '0')}`,
				avgTemperature: ((item as MonthlyWeatherData).maxTemperature + (item as MonthlyWeatherData).minTemperature) / 2,
				avgFeelsLikeTemperature:
					((item as MonthlyWeatherData).maxFeelsLikeTemperature +
						(item as MonthlyWeatherData).minFeelsLikeTemperature) /
					2,
			}
		} else if (isYearly) {
			// Obsługuje dane roczne
			return {
				name: `${(item as YearlyWeatherData).year}`,
				avgTemperature: ((item as YearlyWeatherData).maxTemperature + (item as YearlyWeatherData).minTemperature) / 2,
				avgFeelsLikeTemperature:
					((item as YearlyWeatherData).maxFeelsLikeTemperature + (item as YearlyWeatherData).minFeelsLikeTemperature) /
					2,
			}
		}
		return {}
	})

	return (
		<div className='w-full h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>
            Wykres liniowy ilustrujący zmiany temperatury
			</h2>
			<ResponsiveContainer width='100%' height='90%'>
				<LineChart data={processedData}>
					<CartesianGrid vertical={false} stroke='#ffffff' strokeDasharray='6' strokeWidth={0.2} />
					<XAxis dataKey='name' stroke='#ffffff' tick={{ fontSize: 11,  fill: '#ffffff' }} tickMargin={15} />
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
						formatter={(value: any) => `${value.toFixed(2)}°C`} // Zaokrąglanie do 2 miejsc po przecinku i dodanie stopni C
					/>
					<Legend
						verticalAlign='bottom'
						align='center'
						iconType='circle' // Można zmienić na "square" lub "line", w zależności od preferencji
						iconSize={10} // Zmienia wielkość symbolu w legendzie
						wrapperStyle={{
							fontSize: '14px', // Rozmiar czcionki w legendzie
							paddingTop: '15px', // Odstęp od góry
						}}
					/>
					<Line type='monotone' dataKey='avgTemperature' stroke='#ff7300' name='Średnia temperatura' dot={false} />
					<Line
						type='monotone'
						dataKey='avgFeelsLikeTemperature'
						stroke='#387908'
						name='Średnia odczuwalna temperatura'
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default TemperatureChart
