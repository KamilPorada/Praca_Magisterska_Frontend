import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

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

type WeatherData = DailyWeatherData

type ChartProps = {
	data: WeatherData[]
}

const DayNightDurationChart: React.FC<ChartProps> = ({ data }) => {
	// Funkcja do konwersji czasu (ISO 8601 "YYYY-MM-DDTHH:mm:ss") na liczbę minut
	const parseTime = (timeStr: string) => {
		if (!timeStr) return NaN
		const timePart = timeStr.split('T')[1] // Pobieramy tylko część "HH:mm:ss"
		if (!timePart) return NaN
		const [hours, minutes] = timePart.split(':').map(Number)
		return hours * 60 + minutes
	}

	// Przetwarzanie danych
	const chartData = data.map(item => {
		const sunriseMinutes = parseTime(item.sunrise)
		const sunsetMinutes = parseTime(item.sunset)

		// Obsługa błędnych wartości
		if (isNaN(sunriseMinutes) || isNaN(sunsetMinutes)) {
			console.warn(`Nieprawidłowe dane: ${item.date} - sunrise: ${item.sunrise}, sunset: ${item.sunset}`)
			return { date: item.date, daylightHours: 0, nightHours: 24 }
		}

		const daylightHours = (sunsetMinutes - sunriseMinutes) / 60
		const nightHours = 24 - daylightHours

		return {
			date: item.date,
			daylightHours: +daylightHours.toFixed(2),
			nightHours: +nightHours.toFixed(2),
		}
	})

	return (
		<div className='w-full h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>Długość dnia i nocy</h2>
			<ResponsiveContainer width='100%' height='85%'>
				<AreaChart data={chartData}>
					<CartesianGrid vertical={false} stroke='#ffffff' strokeDasharray='6' strokeWidth={0.2} />
					<XAxis dataKey='date' stroke='#ffffff' tick={{ fontSize: 11, fill: '#ffffff' }} tickMargin={15} />
					<YAxis stroke='#ffffff' tick={{ fontSize: 12, fill: '#ffffff' }} tickMargin={10} />

					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c', // ciemne tło
							borderColor: '#1e202c', // ciemna ramka
							color: '#fff', // biały tekst
							fontSize: '0.8rem',
						}}
						labelStyle={{ color: '#fff' }} // kolor etykiety
						itemStyle={{ color: '#fff' }} // biały tekst dla wartości w tooltipie
						formatter={(value: any) => `${value.toFixed(2)}h`} // Zaokrąglanie do 2 miejsc po przecinku i dodanie stopni C
					/>
					<Area
						type='monotone'
						dataKey='daylightHours'
						name='Długość dnia'
						stackId='1'
						stroke='rgba(255, 221, 51, 0.8)'
						fill='rgba(255, 221, 51, 0.6)'
					/>
					<Area
						type='monotone'
						dataKey='nightHours'
						name='Długość nocy'
						stackId='2'
						stroke='rgba(0, 0,130, 0.8)'
						fill='rgba(19, 39, 64, 1)'
					/>

					<Legend
						verticalAlign='bottom'
						align='center'
						iconType='circle' // Można zmienić na "square" lub "line", w zależności od preferencji
						iconSize={10} // Zmienia wielkość symbolu w legendzie
						wrapperStyle={{
							fontSize: '14px', // Rozmiar czcionki w legendzie
							paddingTop: '15px',
						}}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}

export default DayNightDurationChart
