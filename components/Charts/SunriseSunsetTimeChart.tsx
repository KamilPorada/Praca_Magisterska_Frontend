import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'

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

// Funkcja do konwersji minut na format hh:mm
const formatTime = (minutes: number) => {
	const hours = Math.floor(minutes / 60)
		.toString()
		.padStart(2, '0')
	const mins = (minutes % 60).toString().padStart(2, '0')
	return `${hours}:${mins}`
}

// Funkcja do sprawdzenia, czy dana data przypada na czas letni (CEST)
const isDaylightSavingTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1 // Miesiące w JS zaczynają się od 0 (styczeń to 0, grudzień to 11)
    const day = date.getDate()
    return (month > 3 && month < 10) || (month === 3 && day >= 31) || (month === 10 && day < 31)
  }

  const parseTime = (timeStr: string, dateStr: string) => {
    const date = new Date(timeStr) // Konwersja z ISO 8601 na obiekt Date
    let minutes = date.getHours() * 60 + date.getMinutes()
  
    if (isDaylightSavingTime(dateStr)) {
      minutes += 60 // Dodajemy 1 godzinę, jeśli obowiązuje czas letni
    }
  
    return minutes
  }

const SunriseSunsetTimeChart: React.FC<ChartProps> = ({ data }) => {
	// Przetwarzanie danych do formatu wykresu
    const chartData = data.map(item => {
        const sunriseMinutes = parseTime(item.sunrise, item.date)
        const sunsetMinutes = parseTime(item.sunset, item.date)
    
        return {
          date: item.date,
          sunrise: sunriseMinutes,
          sunset: sunsetMinutes,
        }
      })

	return (
		<div className='w-1/3 h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>Wykres ilustrujący czas wschodów i zachodów słońca</h2>
			<ResponsiveContainer width='100%' height='85%'>
				<LineChart data={chartData}>
					<CartesianGrid stroke='#ffffff' strokeDasharray='6' strokeWidth={0.2} />{' '}
					<XAxis dataKey='date' stroke='#ffffff' tick={{ fontSize: 11, fill: '#ffffff' }} tickMargin={15} />{' '}
					<YAxis stroke='#ffffff' tick={{ fontSize: 12, fill: '#ffffff' }} tickMargin={10} tickFormatter={formatTime} />
					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c', // ciemne tło
							borderColor: '#1e202c', // ciemna ramka
							color: '#fff', // biały tekst
							fontSize: '0.8rem',
						}}
						labelStyle={{ color: '#fff' }} // kolor etykiety
						itemStyle={{ color: '#fff' }} // biały tekst dla wartości w tooltipie
						formatter={formatTime}
					/>
					<Line
						type='monotone'
						dataKey='sunrise'
						stroke='#FF5733' // Neonowy pomarańczowy dla wschodu słońca
						dot={false}
						strokeDasharray='2 3'
						name='Wschód słońca'
					/>
					<Line
						type='monotone'
						dataKey='sunset'
						stroke='#1E90FF' // Neonowy niebieski dla zachodu słońca
						dot={false}
						strokeDasharray='2 3'
						name='Zachód słońca'
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
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default SunriseSunsetTimeChart
