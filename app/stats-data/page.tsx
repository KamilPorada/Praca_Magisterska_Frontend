'use client'

import { useState, useEffect, useRef } from 'react'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'
import StatisticsForm from '@/components/Forms/StatisticsForm'
import { useSidebar } from '../../components/contexts/SidebarProvider'
import WeatherStatsNarrative from '@/components/Other/WeatherStatsNarrative'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Button from '@/components/UI/Button'

type City = {
	id: number
	name: string
}

type FormData = {
	cityName: string
	startDate: string
	endDate: string
}

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

const StatsData = () => {
	const [stats, setStats] = useState<WeatherStats | null>(null)
	const [cities, setCities] = useState<City[]>([])
	const [formData, setFormData] = useState<FormData | null>(null)
	const [isFormSubmitted, setIsFormSubmitted] = useState(false)
	const [loading, setLoading] = useState(false)
	const { sidebarContainer } = useSidebar()
	const resultsRef = useRef<HTMLDivElement | null>(null)

	const handleDataFetched = (data: WeatherStats) => {
		setLoading(true)
		setTimeout(() => {
			setStats(data)
			setIsFormSubmitted(true)
			setLoading(false)

			setTimeout(() => {
				resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
				setTimeout(() => {
					window.scrollBy({ top: 150, left: 0, behavior: 'smooth' })
				}, 300)
			}, 300)
		}, 1000)
	}

	const handleFormData = (data: FormData) => {
		setFormData(data)
	}

	const handleExportToPDF = async () => {
		if (resultsRef.current) {
			const canvas = await html2canvas(resultsRef.current)
			const imgData = canvas.toDataURL('image/png')
			const pdf = new jsPDF('p', 'mm', 'a4')

			const imgProps = pdf.getImageProperties(imgData)
			const pdfWidth = pdf.internal.pageSize.getWidth()
			const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

			pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

			// Pobranie daty i czasu
			const now = new Date()
			const date = now.toISOString().split('T')[0] // YYYY-MM-DD

			const hours = String(now.getHours()).padStart(2, '0')
			const minutes = String(now.getMinutes()).padStart(2, '0')
			const seconds = String(now.getSeconds()).padStart(2, '0')
			const time = `${hours}-${minutes}-${seconds}`

			const fileName = `Analiza statystyczna - ${date} ${time}.pdf`

			pdf.save(fileName)
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
				<PlatformSectionTitle title='Analiza statystyczna' />
				<div className='w-full max-w-md flex flex-col justify-center items-center'>
					<p className='font-thin my-5 text-center text-lg'>
						Wybierz miasto oraz zakres czasowy, aby przeprowadzić analizę statystyczną danych pogodowych!
					</p>
					<StatisticsForm cities={cities} onDataFetched={handleDataFetched} onFormData={handleFormData} />
				</div>
				<div ref={resultsRef} className='mt-10'>
					{isFormSubmitted && stats && formData && (
						<>
							<WeatherStatsNarrative stats={stats} formData={formData} />
						</>
					)}
				</div>
				{isFormSubmitted && stats && formData && (
					<div className='flex justify-center mt-6'>
						<Button onClick={handleExportToPDF}>Eksport do PDF</Button>
					</div>
				)}
			</div>
		</section>
	)
}

export default StatsData
