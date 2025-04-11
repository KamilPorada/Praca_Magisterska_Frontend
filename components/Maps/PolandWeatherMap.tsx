import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faSun,
	faCloudSun,
	faCloud,
	faCloudShowersHeavy,
	faSnowflake,
	faBolt,
	faSunPlantWilt,
	faMoon,
	faWind,
	faArrowUp,
	faHourglassHalf,
	faCompass,
} from '@fortawesome/free-solid-svg-icons'

type WeatherData = {
	id: number
	cityId: number
	cityName: string
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

type City = {
	id: number
	name: string
	voivodeship_id: number
	population: number
	area: number
	population_density: number
	longitude: number
	latitude: number
}

type Props = {
	data: WeatherData[] // Oczekujemy tablicy WeatherData
	cities: City[] // Oczekujemy tablicy miast
}

const weatherIcons: { [key: number]: any } = {
	0: faSun,
	1: faCloudSun,
	2: faCloudSun,
	3: faCloud,
	45: faCloud,
	48: faCloud,
	51: faCloudShowersHeavy,
	53: faCloudShowersHeavy,
	55: faCloudShowersHeavy,
	56: faCloudShowersHeavy,
	57: faCloudShowersHeavy,
	61: faCloudShowersHeavy,
	63: faCloudShowersHeavy,
	65: faCloudShowersHeavy,
	66: faCloudShowersHeavy,
	67: faCloudShowersHeavy,
	71: faSnowflake,
	73: faSnowflake,
	75: faSnowflake,
	77: faSnowflake,
	80: faCloudShowersHeavy,
	81: faCloudShowersHeavy,
	82: faCloudShowersHeavy,
	85: faSnowflake,
	86: faSnowflake,
	95: faBolt,
	96: faBolt,
	99: faBolt,
}

const PolandWeatherMap = ({ data, cities }: Props) => {
	const [selectedCity, setSelectedCity] = useState<string>('warszawa')

	const customIcon = new L.DivIcon({
		className: 'custom-icon',
		html:
			'<div style="position: relative; width: 12px; height: 12px; background-color: #F59E0B; border-radius: 50%;">' +
			'<div style="position: absolute; top: 50%; left: 50%; width: 6px; height: 6px; background-color: black; border-radius: 50%; transform: translate(-50%, -50%);"></div>' +
			'</div>',
		iconSize: [10, 10],
		iconAnchor: [5, 10],
		popupAnchor: [1, -34],
	})

	// Granice Polski do ograniczenia zoomu
	const bounds = L.latLngBounds(
		L.latLng(49.0, 14.1), // południowy zachód (Zgorzelec, Cieszyn)
		L.latLng(53.85, 24.2) // północny wschód (Suwałki, Sejny)
	)

	const getIconColor = (weatherCode: number): string => {
		// Przypisujemy kolory do różnych kodów pogody
		if ([0, 1, 2].includes(weatherCode)) {
			return '#FFCC00' // Ciemniejszy żółty dla Słońca i częściowego słońca
		} else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(weatherCode)) {
			return 'lightblue' // Deszczowe dni
		} else if ([71, 73, 75, 77, 80, 81, 82].includes(weatherCode)) {
			return 'lightblue' // Śnieg (teraz jasno niebieski)
		} else if ([95, 96, 99].includes(weatherCode)) {
			return '#FFCC00' // Ciemniejszy żółty dla burz
		} else {
			return 'gray' // Inne przypadki (np. chmurki)
		}
	}

	// Funkcja do konwersji godziny na format GG:mm
	const adjustSunTimeForDST = (time: string) => {
		const date = new Date(time)
		// Jeśli czas letni, dodajemy godzinę
		if (isDaylightSavingTime(date)) {
			date.setHours(date.getHours() + 1)
		}
		return date.toLocaleTimeString('pl-PL', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		})
	}

	const isDaylightSavingTime = (date: Date) => {
		// Funkcja do obliczania, czy data mieści się w okresie letnim (od ostatniej niedzieli marca do ostatniej niedzieli października)
		const year = date.getFullYear()
		const lastSundayMarch = new Date(year, 2, 31 - new Date(year, 2, 31).getDay()) // ostatnia niedziela marca
		const lastSundayOctober = new Date(year, 9, 31 - new Date(year, 9, 31).getDay()) // ostatnia niedziela października

		// Sprawdzamy, czy data mieści się pomiędzy ostatnią niedzielą marca a ostatnią niedzielą października
		return date >= lastSundayMarch && date <= lastSundayOctober
	}

	// Wyszukaj dane dla Warszawy
	const selectedCityWeather = data.find(item => item.cityName.toLowerCase() === selectedCity.toLowerCase())

	const getWindDirection = (angle: number): string => {
		if (angle >= 337.5 || angle < 22.5) return 'N'
		if (angle >= 22.5 && angle < 67.5) return 'NE'
		if (angle >= 67.5 && angle < 112.5) return 'E'
		if (angle >= 112.5 && angle < 157.5) return 'SE'
		if (angle >= 157.5 && angle < 202.5) return 'S'
		if (angle >= 202.5 && angle < 247.5) return 'SW'
		if (angle >= 247.5 && angle < 292.5) return 'W'
		if (angle >= 292.5 && angle < 337.5) return 'NW'
		return ''
	}

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600) // 3600 sekund = 1 godzina
		const mins = Math.floor((seconds % 3600) / 60) // Pozostałe sekundy przeliczone na minuty
		return `${hours}h ${mins}min`
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString) // Tworzymy obiekt Date z daty w formacie YYYY-MM-DD
		const day = String(date.getDate()).padStart(2, '0') // Pobieramy dzień i dodajemy wiodące zero, jeśli to konieczne
		const month = String(date.getMonth() + 1).padStart(2, '0') // Pobieramy miesiąc (dodajemy 1, ponieważ miesiące są indeksowane od 0) i dodajemy wiodące zero
		const year = date.getFullYear() // Pobieramy pełny rok

		return `${day}.${month}.${year}` // Łączymy dzień, miesiąc i rok w wymagany format
	}

	return (
		<div className='max-w-[700px] mx-auto mt-10 rounded-2xl overflow-hidden shadow-xl relative h-[450px] sm:h-[450px] md:h-[600px] lg:h-[750px]'>
			<div
				className='z-10 relative bg-mainColor bg-opacity-60'
				style={{
					position: 'absolute',
					top: '0px',
					left: '50%',
					transform: 'translateX(-50%)',
					width: '100%',
					padding: '5px 5px',
					zIndex: 1000,
				}}>
				<p className='text-sm md:text-lg font-thin text-white'>
					Dane pogodowe dla miasta <span className='font-bold'>{selectedCityWeather?.cityName}</span> z dnia <br />{' '}
					<span className='font-bold'>
						{selectedCityWeather?.date ? formatDate(selectedCityWeather.date) : 'Brak daty'}
					</span>
				</p>
			</div>
			<MapContainer
				bounds={bounds}
				boundsOptions={{ padding: [0, 0] }}
				scrollWheelZoom={true}
				maxBounds={bounds}
				maxZoom={10}
				minZoom={5}
                zoom={6}
				style={{ width: '100%', height: '100%' }}>
				<TileLayer
					url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
					attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
				/>

				{cities.map(city => {
					const weather = data.find(item => item.cityName.toLowerCase() === city.name.toLowerCase())

					if (!weather) return null

					const weatherIcon = weatherIcons[weather.weatherCode]
					const avgTemp = ((weather.maxTemperature + weather.minTemperature) / 2).toFixed(1) // Średnia temperatura
					const iconColor = getIconColor(weather.weatherCode) // Kolor ikony w zależności od pogody

					return (
						<Marker
							key={city.name}
							position={[city.latitude, city.longitude]}
							icon={customIcon}
							eventHandlers={{
								click: () => setSelectedCity(city.name),
							}}>
							<Popup>
								<div className='flex flex-col justify-center items-center gap-1'>
									<div className='uppercase text-sm md:text-base'>{city.name}</div>
									<div className='flex flex-row justify-center items-center'>
										<FontAwesomeIcon icon={weatherIcon} className='mr-2 text-2xl md:text-3xl' style={{ color: iconColor }} />
										<div className='text-xl md:text-2xl font-bold'>{avgTemp}°C</div>
									</div>
								</div>
							</Popup>
						</Marker>
					)
				})}
				{selectedCityWeather && (
					<div
						className='z-10 relative bg-mainColor bg-opacity-60'
						style={{
							position: 'absolute',
							bottom: '0px',
							left: '50%',
							transform: 'translateX(-50%)',
							width: '100%',
							padding: '10px 10px',
							zIndex: 1000,
						}}>
						<div className='grid grid-cols-3 gap-3'>
							{/* Wschód słońca */}
							<div className='flex flex-row justify-center items-center gap-2 p-3 bg-white rounded-lg shadow-md text-center'>
								<FontAwesomeIcon icon={faSun} className='text-amber-400 text-xl md:text-3xl' />
								<p className='font-semibold text-sm md:text-xl text-black'>{adjustSunTimeForDST(selectedCityWeather.sunrise)}</p>
							</div>

							{/* Zachód słońca */}
							<div className='flex flex-row justify-center items-center gap-2 p-3 bg-white rounded-lg shadow-md text-center'>
								<FontAwesomeIcon icon={faMoon} className='text-yellow-300 text-xl md:text-3xl' />
								<p className='font-semibold text-sm md:text-xl text-black'>{adjustSunTimeForDST(selectedCityWeather.sunset)}</p>
							</div>

							{/* Wiatr */}
							<div className='flex flex-row justify-center items-center gap-2 p-3 bg-white rounded-lg shadow-md text-center'>
								<FontAwesomeIcon icon={faWind} className='text-mainColor text-xl md:text-3xl' />
								<p className='font-semibold text-sm md:text-xl text-black'>{selectedCityWeather.maxWindSpeed} km/h</p>
							</div>

							{/* Długość dnia */}
							<div className='flex flex-row justify-center items-center gap-2 p-3 bg-white rounded-lg shadow-md text-center'>
								<FontAwesomeIcon icon={faHourglassHalf} className='text-orange-200 text-xl md:text-3xl' />
								<p className='font-semibold text-sm md:text-xl text-black'>{formatTime(selectedCityWeather.daylightDuration)}</p>
							</div>

							{/* Długość nocy */}
							<div className='flex flex-row justify-center items-center gap-2 p-3 bg-white rounded-lg shadow-md text-center'>
								<FontAwesomeIcon icon={faHourglassHalf} className='text-blue-950 text-xl md:text-3xl' />
								<p className='font-semibold text-sm md:text-xl text-black'>
									{formatTime(86400 - selectedCityWeather.daylightDuration)} {/* 1440 minut = 24 godziny */}
								</p>
							</div>

							<div className='flex flex-row justify-center items-center gap-2 p-3 bg-white rounded-lg shadow-md text-center'>
								<FontAwesomeIcon icon={faCompass} className='text-red-500 text-xl md:text-3xl' />
								<p className='font-semibold text-sm md:text-xl text-black'>
									{getWindDirection(selectedCityWeather.dominantWindDirection)}
								</p>
								<FontAwesomeIcon
									icon={faArrowUp}
									className='text-black text-xl md:text-3xl'
									style={{
										transform: `rotate(${selectedCityWeather.dominantWindDirection}deg)`,
									}}
								/>
							</div>
						</div>
					</div>
				)}
			</MapContainer>
		</div>
	)
}

export default PolandWeatherMap
