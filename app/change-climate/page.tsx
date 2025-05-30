'use client'

import { useState, useEffect, useRef } from 'react'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'
import ClimatePredictionForm from '@/components/Forms/ClimatePredictionForm'
import { useSidebar } from '@/components/contexts/SidebarProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faSnowflake, faArrowUp, faSeedling } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import { Line, Bar } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Button from '@/components/UI/Button'

// Rejestracja komponentów Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement, // Rejestracja BarElement
	Title,
	Tooltip,
	Legend
)

type City = {
	id: number
	name: string
}

type ClimatePredictionResult = {
	year: number
	city: string
	minTemperature: number
	maxTemperature: number
	averageTemperature: number
	predictionAmplitude: number
	estimatedGrowingSeasonDays: number
}[]

const ClimatePredictionPage = () => {
	const [cities, setCities] = useState<City[]>([])
	const [predictionResult, setPredictionResult] = useState<ClimatePredictionResult>([])
	const [loading, setLoading] = useState(false)
	const [isFormSubmitted, setIsFormSubmitted] = useState(false)
	const { sidebarContainer } = useSidebar()
	const resultRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const fetchCities = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/cities')
				const data = await response.json()
				const sorted = data.sort((a: City, b: City) => a.name.localeCompare(b.name))
				setCities(sorted)
			} catch (error) {
				console.error('Błąd pobierania miast:', error)
			}
		}

		fetchCities()
	}, [])

	const handleSubmit = async (formData: { cityId: number }) => {
		setLoading(true)
		setIsFormSubmitted(false)

		try {
			const queryParams = new URLSearchParams({
				cityId: String(formData.cityId),
			})

			const response = await fetch(`http://localhost:8080/api/temperature-prediction?${queryParams}`)
			const data = await response.json()

			setPredictionResult(Array.isArray(data) ? data : [])
			setIsFormSubmitted(true)

			setTimeout(() => {
				resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
				setTimeout(() => {
					window.scrollBy({ top: 80, left: 0, behavior: 'smooth' })
				}, 300)
			}, 300)
		} catch (error) {
			console.error('Błąd pobierania prognozy klimatycznej:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleExportToPDF = async () => {
		if (resultRef.current) {
			const canvas = await html2canvas(resultRef.current as HTMLElement, {
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

			const fileName = `Zmiany klimatyczne - ${date} ${time}.pdf`

			pdf.save(fileName)
		} else {
			console.error('Nie znaleziono elementu do eksportu!')
		}
	}

	const cityName = predictionResult[0]?.city || 'Miasto nieznane'

	const renderClimatePredictionResult = () => {
		if (!predictionResult || predictionResult.length === 0) {
			return
		}

		// Przekształcamy dane na wykresy
		const years = predictionResult.map(row => row.year)
		const minTemps = predictionResult.map(row => row.minTemperature)
		const maxTemps = predictionResult.map(row => row.maxTemperature)
		const avgTemps = predictionResult.map(row => row.averageTemperature)
		const growingSeasonDays = predictionResult.map(row => row.estimatedGrowingSeasonDays)

		// Konfiguracja wykresu liniowego (temperatury)
		const temperatureChartData = {
			labels: years,
			datasets: [
				{
					label: 'Minimalna temperatura (°C)',
					data: minTemps,
					borderColor: 'rgba(54, 162, 235, 1)', // Niebieski
					backgroundColor: 'rgba(54, 162, 235, 0.2)',
					fill: true,
					borderWidth: 1, // <--- tutaj ustaw cieńszą linię
					tension: 0.3,
				},
				{
					label: 'Maksymalna temperatura (°C)',
					data: maxTemps,
					borderColor: 'rgba(255, 99, 132, 1)', // Czerwony
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					fill: true,
					borderWidth: 1, // <--- tutaj ustaw cieńszą linię
					tension: 0.3,
				},
				{
					label: 'Średnia temperatura (°C)',
					data: avgTemps,
					borderColor: 'rgba(255, 206, 86, 1)', // Żółty
					backgroundColor: 'rgba(255, 206, 86, 0.2)',
					fill: true,
					borderWidth: 1, // <--- tutaj ustaw cieńszą linię
					tension: 0.3,
				},
			],
		}

		// Konfiguracja wykresu kolumnowego (dni okresu wegetacyjnego)
		const growingSeasonChartData = {
			labels: years,
			datasets: [
				{
					label: 'Liczba dni okresu wegetacyjnego',
					data: growingSeasonDays,
					backgroundColor: 'rgba(75, 255, 75, 0.8)', // Intensywny zielony
				},
			],
		}

		const statsData = (() => {
			const past = predictionResult.filter(r => r.year <= 2025)
			const future = predictionResult.filter(r => r.year >= 2025)

			const hottestPast = past.reduce((a, b) => (b.averageTemperature > a.averageTemperature ? b : a))
			const coldestPast = past.reduce((a, b) => (b.averageTemperature < a.averageTemperature ? b : a))
			const hottestFuture = future.reduce((a, b) => (b.averageTemperature > a.averageTemperature ? b : a))
			const coldestFuture = future.reduce((a, b) => (b.averageTemperature < a.averageTemperature ? b : a))

			const startPast = past.find(r => r.year === 1950)
			const endPast = past.find(r => r.year === 2025)
			const startFuture = future.find(r => r.year === 2025)
			const endFuture = future.find(r => r.year === 2100)

			const tempDiffPast =
				hottestPast && coldestPast ? (hottestPast.averageTemperature - coldestPast.averageTemperature).toFixed(2) : '—'

			const tempDiffFuture =
				hottestFuture && coldestFuture
					? (hottestFuture.averageTemperature - coldestFuture.averageTemperature).toFixed(2)
					: '—'

			const growDaysPast = past.map(r => r.estimatedGrowingSeasonDays)
			const growDaysFuture = future.map(r => r.estimatedGrowingSeasonDays)

			const minDaysPast = Math.min(...growDaysPast)
			const maxDaysPast = Math.max(...growDaysPast)
			const minDaysFuture = Math.min(...growDaysFuture)
			const maxDaysFuture = Math.max(...growDaysFuture)

			return [
				// Najcieplejszy rok
				{
					title: 'Najcieplejszy rok',
					value: `${hottestPast.year}: ${hottestPast.averageTemperature.toFixed(2)}°C`,
					subtext: 'Na podstawie danych historycznych',
					icon: faSun,
					color: 'bg-yellow-400',
				},
				{
					title: 'Najcieplejszy rok',
					value: `${hottestFuture.year}: ${hottestFuture.averageTemperature.toFixed(2)}°C`,
					subtext: 'Na podstawie danych prognozowanych',
					icon: faSun,
					color: 'bg-yellow-600',
				},

				// Najzimniejszy rok
				{
					title: 'Najzimniejszy rok',
					value: `${coldestPast.year}: ${coldestPast.averageTemperature.toFixed(2)}°C`,
					subtext: 'Na podstawie danych historycznych',
					icon: faSnowflake,
					color: 'bg-blue-400',
				},
				{
					title: 'Najzimniejszy rok',
					value: `${coldestFuture.year}: ${coldestFuture.averageTemperature.toFixed(2)}°C`,
					subtext: 'Na podstawie danych prognozowanych',
					icon: faSnowflake,
					color: 'bg-blue-700',
				},

				// Wzrost temperatury
				{
					title: 'Wzrost średniej temperatury',
					value: `${tempDiffPast}°C`,
					subtext: 'Na podstawie danych historycznych',
					icon: faArrowUp,
					color: 'bg-red-600',
				},
				{
					title: 'Wzrost średniej temperatury',
					value: `${tempDiffFuture}°C`,
					subtext: 'Na podstawie danych prognozowanych',
					icon: faArrowUp,
					color: 'bg-red-800',
				},

				// Liczba dni okresu wegetacyjnego
				{
					title: 'Zakres dni wegetacyjnych',
					value: `${minDaysPast} dni / ${maxDaysPast} dni`,
					subtext: 'Na podstawie danych historycznych',
					icon: faSeedling,
					color: 'bg-green-500',
				},
				{
					title: 'Zakres dni wegetacyjnych',
					value: `${minDaysFuture} dni / ${maxDaysFuture} dni`,
					subtext: 'Na podstawie danych prognozowanych',
					icon: faSeedling,
					color: 'bg-green-700',
				},
			]
		})()

		return (
			<div ref={resultRef}>
				<div className='bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-5xl mx-auto my-5'>
					<h2 className='text-xl font-semibold text-center mb-6'>
						Analiza statystyczna danych historycznych oraz
						<br />
						prognozowanych zmian klimatycznych dla miasta {cityName}
					</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
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

				{/* Wykresy */}
				<div className='bg-gray-900 p-4 sm:p-6 text-white rounded-xl shadow-lg w-full max-w-5xl mx-auto my-5'>
					<h3 className='text-lg text-center mb-4'>Prognozowane zmiany temperatury</h3>
					<div className='overflow-x-auto'>
						<div className='min-w-[600px]'>
							<Line
								data={temperatureChartData}
								options={{
									scales: {
										x: {
											ticks: {
												color: 'white',
												font: { weight: 'lighter' },
											},
											grid: { color: '#444444' },
										},
										y: {
											ticks: {
												color: 'white',
												font: { weight: 'lighter' },
											},
											grid: { color: '#444444' },
										},
									},
									plugins: {
										legend: {
											labels: { color: 'white' },
										},
									},
								}}
							/>
						</div>
					</div>
				</div>

				<div className='bg-gray-900 p-4 sm:p-6 text-white rounded-xl shadow-lg w-full max-w-5xl mx-auto my-5'>
					<h3 className='text-lg text-center mb-4'>Prognozowana liczba dni okresu wegetacyjnego</h3>
					<div className='overflow-x-auto'>
						<div className='min-w-[600px]'>
							<Bar
								data={growingSeasonChartData}
								options={{
									scales: {
										x: {
											ticks: {
												color: 'white',
												font: { weight: 'lighter' },
											},
											grid: { color: '#444444' },
										},
										y: {
											ticks: {
												color: 'white',
												font: { weight: 'lighter' },
											},
											grid: { color: '#444444' },
										},
									},
									plugins: {
										legend: {
											labels: { color: 'white' },
										},
									},
								}}
							/>
						</div>
					</div>
				</div>

				<div className='bg-gray-900 p-4 sm:p-6 text-white rounded-xl shadow-lg w-full max-w-5xl mx-auto my-5'>
					<h2 className='text-xl font-semibold text-center mb-6'>
						Historyczne dane meteorologiczne oraz
						<br />
						prognozowane zmiany klimatyczne dla miasta {cityName}
					</h2>

					{/* Tabela z danymi */}
					<div className='overflow-x-auto '>
						<table className='w-full table-auto border-collapse'>
							<thead>
								<tr className='bg-gray-800 text-sm uppercase '>
									<th className='px-4 py-2 border-t border-l border-gray-500'>Rok</th>
									<th className='px-4 py-2 border-t border-gray-500'>Minimalna temperatura (°C)</th>
									<th className='px-4 py-2 border-t border-gray-500'>Maksymalna temperatura (°C)</th>
									<th className='px-4 py-2 border-t border-gray-500'>Średnia temperatura (°C)</th>
									<th className='px-4 py-2 border-t border-gray-500'>Amplituda (°C)</th>
									<th className='px-4 py-2 border-t border-r border-gray-500'>Liczba dni okresu wegetacyjnego</th>
								</tr>
							</thead>
							<tbody>
								{predictionResult.map((row, index) => (
									<tr key={index} className='text-center border-t border-b border-gray-500'>
										<td className='px-4 py-2 border-l border-gray-500'>{row.year}</td>
										<td className='px-4 py-2'>{row.minTemperature?.toFixed(2)}</td>
										<td className='px-4 py-2'>{row.maxTemperature?.toFixed(2)}</td>
										<td className='px-4 py-2'>{row.averageTemperature?.toFixed(2)}</td>
										<td className='px-4 py-2'>{row.predictionAmplitude?.toFixed(2)}</td>
										<td className='px-4 py-2 border-r border-gray-500'>{row.estimatedGrowingSeasonDays}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}

	return (
		<section className={sidebarContainer}>
			<div className='flex flex-col justify-center items-center px-4 sm:px-6'>
				<PlatformSectionTitle title='Prognoza klimatyczna' />
				<div className='w-full max-w-xl flex flex-col justify-center items-center'>
					<p className='font-thin my-5 text-center text-lg'>
						Wybierz miasto, aby uzyskać prognozę zmian klimatycznych dla tego miasta.
					</p>
					<ClimatePredictionForm onSubmit={handleSubmit} cities={cities} />
				</div>

				{renderClimatePredictionResult()}
				{isFormSubmitted && (
					<div className='flex justify-center mt-4'>
						<Button onClick={handleExportToPDF}>Eksport do PDF</Button>
					</div>
				)}
			</div>
		</section>
	)
}

export default ClimatePredictionPage
