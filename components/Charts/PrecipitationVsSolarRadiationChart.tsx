import React from 'react'
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	ZAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
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
	sunlightDuration: number // W sekundach
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
	dailySunshine: number // W sekundach
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

const PrecipitationVsSunlightDurationChart: React.FC<ChartProps> = ({ data }) => {
	// Filtrowanie tylko danych dziennych i miesięcznych, ponieważ dane roczne nie zawierają promieniowania słonecznego
	const filteredData = data.filter(
		item => 'sunlightDuration' in item || 'dailySunshine' in item // Użycie odpowiednich pól
	)

	// Przygotowanie danych do wykresu
	const chartData = filteredData.map(item => ({
		precipitationDuration: 'precipitationDuration' in item ? item.precipitationDuration : 0, // Czas trwania opadów
		sunlightDuration:
			'sunlightDuration' in item
				? item.sunlightDuration / 3600 // Konwersja na godziny
				: 0, // Czas nasłonecznienia w godzinach dla danych dziennych
		dailySunshine:
			'dailySunshine' in item
				? item.dailySunshine / 3600 // Konwersja na godziny
				: 0, // Dla miesięcznych danych
	}))

	// Funkcja formatująca dane w tooltipie (zaokrąglanie do 2 miejsc po przecinku)
	const formatTooltipValue = (value: number) => (value ? value.toFixed(2) + 'h' : '0.00')

	return (
		<div className='w-[400px] h-96 bg-secondaryColor p-4 rounded-lg shadow-lg'>
			<h2 className='text-sm sm:text-base font-thin text-center text-gray-200 mb-4'>
				Czas trwania opadów a nasłonecznienienie
			</h2>
			<ResponsiveContainer width='100%' height='90%'>
				<ScatterChart>
					<CartesianGrid stroke='#ffffff' strokeDasharray='6' strokeWidth={0.2} />
					<XAxis
						type='number'
						dataKey='precipitationDuration'
						name='Czas trwania opadów (h)'
						stroke='#ffffff'
						tick={{ fontSize: 11, fill: '#ffffff' }}
						tickMargin={15}
					/>
					<YAxis
						type='number'
						dataKey='sunlightDuration'
						name='Czas nasłonecznienia (h)'
						stroke='#ffffff'
						tick={{ fontSize: 12, fill: '#ffffff' }} // Zmiana czcionki i koloru
						tickMargin={10}
					/>
					<ZAxis range={[30, 30]} />
					<Tooltip
						contentStyle={{
							backgroundColor: '#1e202c', // ciemne tło
							borderColor: '#1e202c', // ciemna ramka
							color: '#fff', // biały tekst
							fontSize: '0.8rem',
						}}
						labelStyle={{ color: '#fff' }} // kolor etykiety
						itemStyle={{ color: '#fff' }} // biały tekst dla wartości w tooltipie
						formatter={formatTooltipValue} // Zaokrąglanie do 2 miejsc po przecinku i dodanie stopni C
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
					/>{' '}
					<Scatter
						name='Opady vs Nasłonecznienie'
						data={chartData}
						fill='#FF4500' // Zielony kolor punktów
						width={55}
						height={55}
					/>{' '}
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	)
}

export default PrecipitationVsSunlightDurationChart
