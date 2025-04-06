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

type ChartProps = {
	data: WeatherData[]
}

const WindChart: React.FC<ChartProps> = ({ data }) => {
	const isDaily = (data[0] as DailyWeatherData).date !== undefined
	const isMonthly = (data[0] as MonthlyWeatherData).month !== undefined
	const isYearly = (data[0] as YearlyWeatherData).year !== undefined

	const processedData = data.map(item => {
		if (isDaily) {
			return {
				name: (item as DailyWeatherData).date,
				maxWindSpeed: (item as DailyWeatherData).maxWindSpeed,
				windGusts: (item as DailyWeatherData).windGusts,
			}
		} else if (isMonthly) {
			return {
				name: `${(item as MonthlyWeatherData).year}-${(item as MonthlyWeatherData).month.toString().padStart(2, '0')}`,
				maxWindSpeed: (item as MonthlyWeatherData).maxWindSpeed,
				windGusts: (item as MonthlyWeatherData).windGusts,
			}
		} else if (isYearly) {
			return {
				name: `${(item as YearlyWeatherData).year}`,
				maxWindSpeed: (item as YearlyWeatherData).maxWindSpeed,
				windGusts: (item as YearlyWeatherData).windGusts,
			}
		}
		return {}
	})

	return (
		<div className='w-3/5 h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>
				Wykres liniowy ilustrujący prędkość wiatru oraz porywy
			</h2>
			<ResponsiveContainer width='100%' height='90%'>
				<LineChart data={processedData}>
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
						formatter={(value: any) => `${value.toFixed(2)} km/h`}
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
					<Line type='linear' dataKey='maxWindSpeed' stroke='#00BFFF' name='Prędkość wiatru' dot={false} />
					<Line type='linear' dataKey='windGusts' stroke='#32CD32' name='Porywy wiatru' dot={false} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default WindChart
