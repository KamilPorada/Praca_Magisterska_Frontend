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
	faBolt,
	faCity,
	faCalendarAlt,
	faMoon,
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
	maxWindSpeed: { average: number; max: number; median: number; min: number; stdDev: number }
}

type FormData = {
	cityName: string
	startDate: string
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
		const h = Math.floor(hours)
		const m = Math.round((hours - h) * 60)
		return `${h}h ${m}m`
	}

	const formatStringTime = (isoString: string) => {
		return new Date(isoString).toLocaleTimeString('pl-PL', {
			hour: '2-digit',
			minute: '2-digit',
		})
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
			icon: faTemperatureHigh,
			color: 'bg-red-500',
			title: 'Średnia temperatura',
			value: `${stats.maxTemperature.average.toFixed(1)}°C`,
			subtext: (
				<>
					Najwyższa temperatura w analizowanym okresie to{' '}
					<span className='font-semibold'>{stats.maxTemperature.max.toFixed(1)}°C</span>, a najniższa{' '}
					<span className='font-semibold'>{stats.maxTemperature.min.toFixed(1)}°C</span>.
				</>
			),
		},
		{
			icon: faTemperatureHigh,
			color: 'bg-purple-500',
			title: 'Średnia temperatura odczuwalna',
			value: `${stats.feltMaxTemperature.average.toFixed(1)}°C`,
			subtext: (
				<>
					Odczuwalna temperatura osiągnęła maksymalnie{' '}
					<span className='font-semibold'>{stats.feltMaxTemperature.max.toFixed(1)}°C</span>, natomiast najniższa
					wartość wyniosła <span className='font-semibold'>{stats.feltMaxTemperature.min.toFixed(1)}°C</span>.
				</>
			),
		},
		{
			icon: faSun,
			color: 'bg-yellow-500',
			title: 'Średnie nasłonecznienie',
			value: `${formatTime(stats.sunlightDuration.average)} / dzień`,
			subtext: (
				<>
					Maksymalne nasłonecznienie wyniosło{' '}
					<span className='font-semibold'>{formatTime(stats.sunlightDuration.max)}</span>, natomiast minimalne{' '}
					<span className='font-semibold'>{formatTime(stats.sunlightDuration.min)}</span>.
				</>
			),
		},
		{
			icon: faSun,
			color: 'bg-orange-500',
			title: 'Wschód słońca',
			value: `${formatStringTime(stats.sunrise.latest)} - ${formatStringTime(stats.sunrise.earliest)}`,
			subtext: (
				<>
					Najwcześniejszy wschód słońca miał miejsce o{' '}
					<span className='font-semibold'>{formatStringTime(stats.sunrise.latest)}</span>, a najpóźniejszy o{' '}
					<span className='font-semibold'>{formatStringTime(stats.sunrise.earliest)}</span>.
				</>
			),
		},
		{
			icon: faMoon,
			color: 'bg-indigo-600',
			title: 'Zachód słońca',
			value: `${formatStringTime(stats.sunset.earliest)} - ${formatStringTime(stats.sunset.latest)}`,
			subtext: (
				<>
					Najwcześniejszy zachód słońca miał miejsce o{' '}
					<span className='font-semibold'>{formatStringTime(stats.sunset.earliest)}</span>, a najpóźniejszy o{' '}
					<span className='font-semibold'>{formatStringTime(stats.sunset.latest)}</span>.
				</>
			),
		},
		{
			icon: faLeaf,
			color: 'bg-green-500',
			title: 'Suma ewapotranspiracji',
			value: `${stats.evapotranspiration.sum.toFixed(2)} mm`,
			subtext: (
				<>
					Łączna ilość wody wyparowanej i transpirowanej przez rośliny wyniosła{' '}
					<span className='font-semibold'>{stats.evapotranspiration.sum.toFixed(2)} mm</span>.
				</>
			),
		},
		{
			icon: faSnowflake,
			color: 'bg-blue-500',
			title: 'Suma opadów śniegu',
			value: `${stats.snow.sum.toFixed(1)} mm`,
			subtext: (
				<>
					W analizowanym okresie łącznie spadło <span className='font-semibold'>{stats.snow.sum.toFixed(1)} mm</span>{' '}
					śniegu.
				</>
			),
		},
		{
			icon: faTint,
			color: 'bg-blue-400',
			title: 'Suma opadów deszczu',
			value: `${stats.totalPrecipitation.sum.toFixed(1)} mm`,
			subtext: (
				<>
					Łączna suma opadów deszczu w tym okresie wyniosła{' '}
					<span className='font-semibold'>{stats.totalPrecipitation.sum.toFixed(1)} mm</span>.
				</>
			),
		},
		{
			icon: faClock,
			color: 'bg-orange-400',
			title: 'Łączny czas opadów',
			value: `${stats.precipitationDuration.total} godz.`,
			subtext: getRainfallDescription(stats.precipitationDuration.total),
		},
		{
			icon: faCloudRain,
			color: 'bg-blue-600',
			title: 'Dni deszczowe i suche',
			value: `${stats.totalPrecipitation.rainyDays} / ${stats.totalPrecipitation.dryDays}`,
			subtext: (
				<>
					W analizowanym okresie wystąpiło <span className='font-semibold'>{stats.totalPrecipitation.rainyDays}</span>{' '}
					dni deszczowych oraz <span className='font-semibold'>{stats.totalPrecipitation.dryDays}</span> dni bez opadów.
				</>
			),
		},
		{
			icon: faWind,
			color: 'bg-gray-500',
			title: 'Średnia prędkość wiatru',
			value: `${stats.maxWindSpeed.average.toFixed(1)} km/h`,
			subtext: (
				<>
					Średnia prędkość wiatru wynosiła{' '}
					<span className='font-semibold'>{stats.maxWindSpeed.average.toFixed(1)} km/h</span>, z dominującym kierunkiem{' '}
					<span className='font-semibold'>{getWindDirection(stats.dominantWindDirection.mode)}</span>.
				</>
			),
		},
		{
			icon: faBolt,
			color: 'bg-yellow-300',
			title: 'Suma promieniowania słonecznego',
			value: `${stats.totalSolarRadiation.sum.toFixed(2)} MJ/m²`,
			subtext: (
				<>
					Łączne promieniowanie słoneczne w analizowanym okresie wyniosło{' '}
					<span className='font-semibold'>{stats.totalSolarRadiation.sum.toFixed(2)} kWh/m²</span>.
				</>
			),
		},
	]

	return (
		<div className='p-4 sm:p-6 bg-gray-900 text-white rounded-xl shadow-lg w-full max-w-5xl mx-auto font-thin'>
			<div className='text-center mb-6'>
				<h2 className='text-xl sm:text-2xl font-bold mb-4'>Analiza statystyczna danych pogodowych</h2>

				<div className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-base sm:text-lg text-gray-300'>
					<div className='flex items-center gap-2'>
						<FontAwesomeIcon icon={faCity} className='text-blue-400 text-lg sm:text-xl' />
						<span className='font-light'>Miasto:</span>
						<span className='font-bold text-white'>{formData.cityName}</span>
					</div>

					<span className='hidden sm:block text-gray-400'>|</span>

					<div className='flex items-center gap-2'>
						<FontAwesomeIcon icon={faCalendarAlt} className='text-green-400 text-lg sm:text-xl' />
						<span className='font-light'>Zakres:</span>
						<span className='font-bold text-white'>
							{formData.startDate} - {formData.endDate}
						</span>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
				{statsData.map((item, index) => (
					<motion.div
						key={index}
						className='p-3 sm:p-4 bg-gray-800 rounded-xl shadow-md flex flex-col items-start space-y-2'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1, duration: 0.5 }}>
						<div className='flex items-center space-x-3 sm:space-x-4 h-20 sm:h-24 w-full'>
							<div
								className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center ${item.color} rounded-full text-white`}>
								<FontAwesomeIcon icon={item.icon} className='text-xl sm:text-2xl' />
							</div>
							<div className='w-4/5'>
								<h3 className='text-base sm:text-lg font-semibold'>{item.title}</h3>
								<p className='text-lg sm:text-xl font-bold'>{item.value}</p>
							</div>
						</div>
						{item.subtext && <p className='text-xs sm:text-sm text-gray-300'>{item.subtext}</p>}
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default WeatherStatsNarrative
