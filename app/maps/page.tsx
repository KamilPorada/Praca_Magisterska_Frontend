'use client'

import { useState, useEffect, useRef } from 'react'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'
import MapsForm from '@/components/Forms/MapsForm'
import { useSidebar } from '@/components/contexts/SidebarProvider'
import PolandWeatherMap from '../../components/Maps/PolandWeatherMap' // Importujemy komponent mapy
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Button from '@/components/UI/Button'

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

const WeatherMap = () => {
	const [cities, setCities] = useState<City[]>([])
	const [selectedDate, setSelectedDate] = useState<string | null>(null)
	const [isFormSubmitted, setIsFormSubmitted] = useState(false)
	const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { sidebarContainer } = useSidebar()
	const resultsRef = useRef<HTMLDivElement | null>(null)

	const handleDateSubmit = async (date: string) => {
		setSelectedDate(date)
		setIsFormSubmitted(true)
		setLoading(true)
		setError(null)

		try {
			const response = await fetch(`http://localhost:8080/api/poland-weather?date=${date}`)
			if (!response.ok) throw new Error('Błąd pobierania danych pogodowych')
			const data = await response.json()
			setWeatherData(data)
			console.log(data)
		} catch (err: any) {
			setError(err.message || 'Wystąpił błąd')
			setWeatherData(null)
		} finally {
			setLoading(false)
			setTimeout(() => {
				resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
				setTimeout(() => {
					window.scrollBy({ top: 160, left: 0, behavior: 'smooth' })
				}, 300)
			}, 300)
		}
	}

	const handleExportToPDF = async () => {
		if (resultsRef.current) {
			const canvas = await html2canvas(resultsRef.current as HTMLElement, {
				useCORS: true,
				scrollY: -window.scrollY,
			})
			const imgData = canvas.toDataURL('image/png')
			const pdf = new jsPDF('p', 'mm', 'a4')

			const imgProps = pdf.getImageProperties(imgData)
			const pdfWidth = pdf.internal.pageSize.getWidth()

			// Obliczamy wysokość na podstawie proporcji obrazu
			const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

			// Sprawdzamy, czy obraz nie jest za wysoki (ponad jedną stronę A4)
			const maxHeight = pdf.internal.pageSize.getHeight()
			if (pdfHeight > maxHeight) {
				// Jeśli obraz jest za wysoki, podzielimy go na kolejne strony
				const pages = Math.ceil(pdfHeight / maxHeight)
				for (let i = 0; i < pages; i++) {
					const yOffset = -maxHeight * i
					if (i > 0) pdf.addPage()
					pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight)
				}
			} else {
				// Jeśli obraz mieści się na jednej stronie
				pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
			}

			// Data i czas
			const now = new Date()
			const date = now.toISOString().split('T')[0] // YYYY-MM-DD
			const hours = String(now.getHours()).padStart(2, '0')
			const minutes = String(now.getMinutes()).padStart(2, '0')
			const seconds = String(now.getSeconds()).padStart(2, '0')
			const time = `${hours}-${minutes}-${seconds}`

			const fileName = `Wizualizacja danych na mapie - ${date} ${time}.pdf`

			pdf.save(fileName)
		} else {
			console.error('Nie znaleziono elementu do eksportu!')
		}
	}

	useEffect(() => {
		const fetchCities = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/cities')
				const data = await response.json()

				const sortedData = data.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))

				setCities(sortedData)
			} catch (error) {
				console.error('Error fetching cities:', error)
			}
		}

		fetchCities()
	}, [])

	return (
		<section className={sidebarContainer}>
			<div className='flex flex-col justify-center items-center px-4 sm:px-6'>
				<PlatformSectionTitle title='Pogoda na mapie' />
				<div className='w-full max-w-md flex flex-col justify-center items-center'>
					<p className='font-thin my-5 text-center text-lg'>
						Wybierz datę, aby zobaczyć dane pogodowe na mapie dla wybranych miast Polski!
					</p>
					<MapsForm onSubmit={handleDateSubmit} />
				</div>

				<div ref={resultsRef} className='mt-10 w-full'>
					{loading && <p className='text-center text-white'>Ładowanie danych...</p>}

					{error && <p className='text-center text-red-400'>Błąd: {error}</p>}

					{isFormSubmitted && selectedDate && weatherData && (
						<div className='text-white text-center'>
							{/* Dodajemy mapę z danymi */}
							<PolandWeatherMap data={weatherData} cities={cities} />
						</div>
					)}
				</div>
				{isFormSubmitted && selectedDate && weatherData && (
					<div className='flex justify-center mt-4'>
						<Button onClick={handleExportToPDF}>Eksport do PDF</Button>
					</div>
				)}
			</div>
		</section>
	)
}

export default WeatherMap
