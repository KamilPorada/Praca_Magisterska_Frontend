import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

const RainChart: React.FC<ChartProps> = ({ data }) => {
	// Sprawdzamy, jaki typ danych został przekazany
	const isDaily = (data[0] as DailyWeatherData).date !== undefined
	const isMonthly = (data[0] as MonthlyWeatherData).month !== undefined
	const isYearly = (data[0] as YearlyWeatherData).year !== undefined

	// Tworzymy nowy zbiór danych z opadami
	const processedData = data.map(item => {
		if (isDaily) {
			return {
				name: (item as DailyWeatherData).date,
				rain: (item as DailyWeatherData).rain,
			}
		} else if (isMonthly) {
			return {
				name: `${(item as MonthlyWeatherData).year}-${(item as MonthlyWeatherData).month.toString().padStart(2, '0')}`,
				rain: (item as MonthlyWeatherData).rain,
			}
		} else if (isYearly) {
			return {
				name: `${(item as YearlyWeatherData).year}`,
				rain: (item as YearlyWeatherData).rain,
			}
		}
		return {}
	})

	return (
		<div className='w-[500px] h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>
				Wykres słupkowy ilustrujący opady deszczu
			</h2>
			<ResponsiveContainer width='100%' height='90%'>
				<BarChart data={processedData}>
					<CartesianGrid vertical={false} stroke='#ffffff' strokeDasharray='6' strokeWidth={0.2} />
					<XAxis dataKey='name' stroke='#ffffff' tick={{ fontSize: 11, fill: '#ffffff' }} tickMargin={15} />
					<YAxis stroke='#ffffff' tick={{ fontSize: 12, fill: '#ffffff' }} tickMargin={10} />
					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c',
							borderColor: '#1e202c',
							color: '#fff',
							fontSize: '0.8rem',
						}}
						labelStyle={{ color: '#fff' }}
						itemStyle={{ color: '#fff' }}
						formatter={(value: any) => `${value.toFixed(2)} mm`} // Zaokrąglanie wartości do 2 miejsc po przecinku i dodanie jednostki mm
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
					<Bar dataKey='rain' fill='#4fc3f7' name='Opady deszczu' />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}

export default RainChart
