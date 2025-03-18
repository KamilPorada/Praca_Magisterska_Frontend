import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faSun,
	faCloudRain,
	faWind,
	faTemperatureHigh,
	faSnowflake,
	faTint,
	faClock,
	faLeaf,
	faRadiation,
	faBolt,
} from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'

type WeatherStats = {
	city: string
	startDate: string
	endDate: string
	daylightDuration: { average: number; max: number; median: number; min: number; stdDev: number }
	dominantWindDirection: { mode: number }
	evapotranspiration: { averageDaily: number; maxDaily: number; minDaily: number; sum: number }
	feltMaxTemperature: { average: number; max: number; median: number; min: number; stdDev: number }
	feltMinTemperature: { average: number; max: number; median: number; min: number; stdDev: number }
	maxTemperature: { average: number; max: number; median: number; min: number; stdDev: number }
	minTemperature: { average: number; max: number; median: number; min: number; stdDev: number }
	precipitationDuration: { longest: number; total: number }
	rain: { max: number; sum: number }
	snow: { max: number; sum: number }
	sunlightDuration: { average: number; max: number; median: number; min: number; stdDev: number }
	sunrise: { earliest: string; latest: string }
	sunset: { earliest: string; latest: string }
	totalPrecipitation: { dryDays: number; max: number; rainyDays: number; sum: number }
	totalSolarRadiation: { averageDaily: number; maxDaily: number; minDaily: number; sum: number }
	weatherCode: { mode: number }
	windGusts: { average: number; max: number; median: number; min: number; stdDev: number }
	maxWindSpeed: { average: number; max: number; median: number; min: number; stdDev: number } // Dodane
}

type City = {
	id: number
	name: string
}

type FormData = {
	selectedCity: City, // ✅ Poprawna nazwa
	startDate: string,
	endDate: string
}


const WeatherStatsNarrative = ({ stats, formData }: { stats: WeatherStats; formData: FormData }) => {
	const getWindDirection = (degrees: number) => {
		const directions = [
			'północnego',
			'północno-wschodniego',
			'wschodniego',
			'południowo-wschodniego',
			'południowego',
			'południowo-zachodniego',
			'zachodniego',
			'północno-zachodniego',
		]
		const index = Math.round(degrees / 45) % 8
		return directions[index]
	}

	const formatTime = (hours: number) => {
		const h = Math.floor(hours) // Część godzinowa
		const m = Math.round((hours - h) * 60) // Zamiana dziesiętnej części na minuty
		return `${h}h ${m}m`
	}

	const getRainfallDescription = (totalHours: number) => {
		const days = totalHours / 24
		if (days < 1) {
			return `W badanym okresie deszcz padał przez około ${totalHours.toFixed(0)} godzin.`
		} else {
			return `W badanym okresie deszcz padał przez około ${Math.round(days)} dni.`
		}
	}

	const statsData = [
		{
			icon: faSun,
			color: 'bg-yellow-500',
			title: 'Średnie nasłonecznienie',
			value: `${formatTime(stats.sunlightDuration.average)} / dzień`,
			subtext: `Maksymalne nasłonecznienie wyniosło ${formatTime(
				stats.sunlightDuration.max
			)}, natomiast minimalne ${formatTime(stats.sunlightDuration.min)}.`,
		},
		{
			icon: faTemperatureHigh,
			color: 'bg-red-500',
			title: 'Średnia temperatura',
			value: `${stats.maxTemperature.average.toFixed(1)}°C`,
			subtext: `Najwyższa temperatura w analizowanym okresie to ${stats.maxTemperature.max.toFixed(
				1
			)}°C, a najniższa ${stats.maxTemperature.min.toFixed(1)}°C.`,
		},
		{
			icon: faLeaf,
			color: 'bg-green-500',
			title: 'Suma ewapotranspiracji',
			value: `${stats.evapotranspiration.sum.toFixed(2)} mm`,
			subtext: `Łączna ilość wody wyparowanej i transpirowanej przez rośliny wyniosła ${stats.evapotranspiration.sum.toFixed(
				2
			)} mm.`,
		},
		{
			icon: faSnowflake,
			color: 'bg-blue-500',
			title: 'Suma opadów śniegu',
			value: `${stats.snow.sum.toFixed(1)} mm`,
			subtext: `W analizowanym okresie łącznie spadło ${stats.snow.sum.toFixed(1)} mm śniegu.`,
		},
		{
			icon: faTint,
			color: 'bg-blue-400',
			title: 'Suma opadów deszczu',
			value: `${stats.totalPrecipitation.sum.toFixed(1)} mm`,
			subtext: `Łączna suma opadów deszczu w tym okresie wyniosła ${stats.totalPrecipitation.sum.toFixed(1)} mm.`,
		},
		{
			icon: faClock,
			color: 'bg-orange-400',
			title: 'Łączny czas opadów',
			value: `${stats.precipitationDuration.total} godz.`,
			subtext: getRainfallDescription(stats.precipitationDuration.total),
		},
		{
			icon: faWind,
			color: 'bg-gray-500',
			title: 'Średnia prędkość wiatru',
			value: `${stats.maxWindSpeed.average.toFixed(1)} km/h`,
			subtext: `Średnia prędkość wiatru wynosiła ${stats.maxWindSpeed.average.toFixed(
				1
			)} km/h, z dominującym kierunkiem ${getWindDirection(stats.dominantWindDirection.mode)}.`,
		},
		{
			icon: faBolt,
			color: 'bg-yellow-300',
			title: 'Suma promieniowania słonecznego',
			value: `${stats.totalSolarRadiation.sum.toFixed(2)} MJ/m²`,
			subtext: `Łączne promieniowanie słoneczne w analizowanym okresie wyniosło ${stats.totalSolarRadiation.sum.toFixed(
				2
			)} kWh/m².`,
		},
		{
			icon: faTemperatureHigh,
			color: 'bg-purple-500',
			title: 'Średnia temperatura odczuwalna',
			value: `${stats.feltMaxTemperature.average.toFixed(1)}°C`,
			subtext: `Odczuwalna temperatura osiągnęła maksymalnie ${stats.feltMaxTemperature.max.toFixed(
				1
			)}°C, natomiast najniższa wartość wyniosła ${stats.feltMaxTemperature.min.toFixed(1)}°C.`,
		},
	]

	return (
		<div className='p-6 bg-gray-900 text-white rounded-xl shadow-lg w-full max-w-5xl mx-auto'>
			<h2 className='text-3xl font-bold text-center mb-6'>Analiza statystyczna</h2>
			<p className='text-center text-lg font-light mb-6'>
				Lokalizacja: <span className='font-bold'>{formData.selectedCity.name}</span> | Okres:{' '}
				<span className='font-bold'>{stats.startDate}</span> - <span className='font-bold'>{stats.endDate}</span>
			</p>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{statsData.map((item, index) => (
					<motion.div
						key={index}
						className='p-4 bg-gray-800 rounded-xl shadow-md flex flex-col items-start space-y-2'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1, duration: 0.5 }}>
						<div className='flex items-center space-x-4 h-24 w-full'>
							<div className={`w-14 h-14 flex items-center justify-center ${item.color} rounded-full text-white`}>
								<FontAwesomeIcon icon={item.icon} className='text-2xl' />
							</div>
							<div className='w-4/5'>
								<h3 className='text-lg font-semibold'>{item.title}</h3>
								<p className='text-xl font-bold'>{item.value}</p>
							</div>
						</div>
						{item.subtext && <p className='text-sm text-gray-400'>{item.subtext}</p>}
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default WeatherStatsNarrative
