import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCloudSun, faCloud, faCloudShowersHeavy, faSnowflake, faBolt } from '@fortawesome/free-solid-svg-icons'


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

type CapitalCoords = {
	name: string
	latitude: number
	longitude: number
}

type Props = {
	data: WeatherData[]
}

const capitalsOfVoivodeships: CapitalCoords[] = [
	{ name: 'Białystok', latitude: 53.1325, longitude: 23.1688 },
	{ name: 'Bydgoszcz', latitude: 53.1235, longitude: 18.0084 },
	{ name: 'Gdańsk', latitude: 54.352, longitude: 18.6466 },
	{ name: 'Gorzów Wielkopolski', latitude: 52.7368, longitude: 15.2288 },
	{ name: 'Katowice', latitude: 50.2649, longitude: 19.0238 },
	{ name: 'Kielce', latitude: 50.8661, longitude: 20.6286 },
	{ name: 'Kraków', latitude: 50.0647, longitude: 19.945 },
	{ name: 'Lublin', latitude: 51.2465, longitude: 22.5684 },
	{ name: 'Łódź', latitude: 51.7592, longitude: 19.456 },
	{ name: 'Olsztyn', latitude: 53.7784, longitude: 20.4801 },
	{ name: 'Opole', latitude: 50.6751, longitude: 17.9213 },
	{ name: 'Poznań', latitude: 52.4064, longitude: 16.9252 },
	{ name: 'Rzeszów', latitude: 50.0413, longitude: 21.999 },
	{ name: 'Szczecin', latitude: 53.4285, longitude: 14.5528 },
	{ name: 'Warszawa', latitude: 52.2297, longitude: 21.0122 },
	{ name: 'Wrocław', latitude: 51.1079, longitude: 17.0385 },
	{ name: 'Koszalin', latitude: 54.1947, longitude: 16.1747 },
	{ name: 'Słupsk', latitude: 54.4654, longitude: 17.0302 },
	{ name: 'Piła', latitude: 53.1416, longitude: 16.7472 },
	{ name: 'Łomża', latitude: 53.1823, longitude: 22.0869 },
	{ name: 'Suwałki', latitude: 54.1026, longitude: 22.9375 },
	{ name: 'Włocławek', latitude: 52.6462, longitude: 19.0664 },
	{ name: 'Siedlce', latitude: 52.1557, longitude: 22.2813 },
	{ name: 'Kalisz', latitude: 51.7584, longitude: 18.0907 },
	{ name: 'Zielona Góra', latitude: 51.935, longitude: 15.5065 },
	{ name: 'Wałbrzych', latitude: 50.7742, longitude: 16.6747 },
	{ name: 'Częstochowa', latitude: 50.8111, longitude: 19.1228 },
	{ name: 'Tarnobrzeg', latitude: 50.5909, longitude: 21.6786 },
	{ name: 'Zamość', latitude: 50.7152, longitude: 23.2425 },
	{ name: 'Radom', latitude: 51.4026, longitude: 21.1476 },
	{ name: 'Płock', latitude: 52.5464, longitude: 19.7075 }
]

const weatherIcons: { [key: number]: any } = {
    0: faSun, // Clear sky
    1: faCloudSun, // Mainly clear
    2: faCloudSun, // Partly cloudy
    3: faCloud, // Overcast
    45: faCloud, // Fog
    48: faCloud, // Depositing rime fog
    51: faCloudShowersHeavy, // Drizzle: Light
    53: faCloudShowersHeavy, // Drizzle: Moderate
    55: faCloudShowersHeavy, // Drizzle: Dense
    56: faCloudShowersHeavy, // Freezing Drizzle: Light
    57: faCloudShowersHeavy, // Freezing Drizzle: Dense
    61: faCloudShowersHeavy, // Rain: Slight
    63: faCloudShowersHeavy, // Rain: Moderate
    65: faCloudShowersHeavy, // Rain: Heavy
    66: faCloudShowersHeavy, // Freezing Rain: Light
    67: faCloudShowersHeavy, // Freezing Rain: Heavy
    71: faSnowflake, // Snow fall: Slight
    73: faSnowflake, // Snow fall: Moderate
    75: faSnowflake, // Snow fall: Heavy
    77: faSnowflake, // Snow grains
    80: faCloudShowersHeavy, // Rain showers: Slight
    81: faCloudShowersHeavy, // Rain showers: Moderate
    82: faCloudShowersHeavy, // Rain showers: Violent
    85: faSnowflake, // Snow showers slight
    86: faSnowflake, // Snow showers heavy
    95: faBolt, // Thunderstorm: Slight
    96: faBolt, // Thunderstorm: Moderate
    99: faBolt // Thunderstorm: Heavy
  }
  
const PolandWeatherMap = ({ data }: Props) => {
	// Ustawienie niestandardowej ikony
	const customIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [20, 33], // Zmniejszenie rozmiaru markera (szerokość, wysokość)
        iconAnchor: [10, 33], // Ustawienie punktu, w którym ikona jest zaczepiona
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41]
    })

    return (
		<div className='w-full h-[600px] mt-10 rounded-2xl overflow-hidden shadow-xl'>
			<MapContainer
				center={[52.2297, 21.0122]}
				zoom={6.2}
				style={{ width: '100%', height: '100%' }}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>

				{capitalsOfVoivodeships.map(capital => {
					const weather = data.find(
						item => item.cityName.toLowerCase() === capital.name.toLowerCase()
					)

					if (!weather) return null

					// Get the weather icon based on the weatherCode
					const weatherIcon = weatherIcons[weather.weatherCode]

					return (
						<Marker
							key={capital.name}
							position={[capital.latitude, capital.longitude]}
                            icon={customIcon}
						>
							<Popup>
								<div className='flex items-center'>
									<FontAwesomeIcon icon={weatherIcon} size="2x" className="mr-2" />
									<div>
										<strong>{capital.name}</strong>
										<br />
										Temp max: {weather.maxTemperature}°C
										<br />
										Temp min: {weather.minTemperature}°C
									</div>
								</div>
							</Popup>
						</Marker>
					)
				})}
			</MapContainer>
		</div>
	)
}

export default PolandWeatherMap
