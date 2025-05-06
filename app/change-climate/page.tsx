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
					window.scrollBy({ top: 150, left: 0, behavior: 'smooth' })
				}, 300)
			}, 300)
		} catch (error) {
			console.error('Błąd pobierania prognozy klimatycznej:', error)
		} finally {
			setLoading(false)
		}
	}

	const cityName = predictionResult[0]?.city || 'Miasto nieznane'

	const renderClimatePredictionResult = () => {
		if (!predictionResult || predictionResult.length === 0) {
			return <div>Brak wyników prognozy</div>
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

			const hottest = past.reduce((a, b) => (b.averageTemperature > a.averageTemperature ? b : a))
			const coldest = past.reduce((a, b) => (b.averageTemperature < a.averageTemperature ? b : a))

			const startYear = predictionResult.find(r => r.year === 2025)
			const endYear = predictionResult.find(r => r.year === 2100)
			const tempDiff =
				startYear && endYear ? (endYear.averageTemperature - startYear.averageTemperature).toFixed(2) : '—'

			const growDays = future.map(r => r.estimatedGrowingSeasonDays)
			const minDays = Math.min(...growDays)
			const maxDays = Math.max(...growDays)

			return [
				{
					title: 'Najcieplejszy rok (1950–2025)',
					value: `${hottest.year}: ${hottest.averageTemperature.toFixed(2)}°C`,
					subtext: 'Na podstawie danych historycznych',
					icon: faSun,
					color: 'bg-yellow-500',
				},
				{
					title: 'Najzimniejszy rok (1950–2025)',
					value: `${coldest.year}: ${coldest.averageTemperature.toFixed(2)}°C`,
					subtext: 'Na podstawie danych historycznych',
					icon: faSnowflake,
					color: 'bg-blue-400',
				},
				{
					title: 'Wzrost średniej temp. do 2100',
					value: `${tempDiff}°C`,
					subtext: 'Różnica między 2025 a 2100',
					icon: faArrowUp,
					color: 'bg-red-500',
				},
				{
					title: 'Zakres dni wegetacyjnych (prognoza)',
					value: `${minDays} – ${maxDays} dni`,
					subtext: 'Lata 2025–2100',
					icon: faSeedling,
					color: 'bg-green-500',
				},
			]
		})()

		return (
			<>
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

				<div
					ref={resultRef}
					className='bg-gray-900 p-4 sm:p-6 text-white rounded-xl shadow-lg w-full max-w-5xl mx-auto my-10'>
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

				{/* Wykresy */}
				<div className='bg-gray-900 p-4 sm:p-6 text-white rounded-xl shadow-lg w-full max-w-5xl mx-auto my-10'>
					<h3 className='text-lg text-center mb-4'>Prognozowane zmiany temperatury</h3>
					<Line
						data={temperatureChartData}
						options={{
							scales: {
								x: {
									ticks: {
										color: 'white', // Kolor tekstu na osi X
										font: {
											weight: 'lighter', // Cieńsza czcionka
										},
									},
									grid: {
										color: '#444444', // Kolor siatki na osi X
									},
								},
								y: {
									ticks: {
										color: 'white', // Kolor tekstu na osi Y
										font: {
											weight: 'lighter', // Cieńsza czcionka
										},
									},
									grid: {
										color: '#444444', // Kolor siatki na osi Y
									},
								},
							},
							plugins: {
								legend: {
									labels: {
										color: 'white', // Kolor legendy
									},
								},
							},
						}}
					/>
				</div>
				<div className='bg-gray-900 p-4 sm:p-6 text-white rounded-xl shadow-lg w-full max-w-5xl mx-auto my-10'>
					<h3 className='text-lg text-center mb-4'>Prognozowana liczba dni okresu wegetacyjnego</h3>
					<Bar
						data={growingSeasonChartData}
						options={{
							scales: {
								x: {
									ticks: {
										color: 'white', // Kolor tekstu na osi X
										font: {
											weight: 'lighter', // Cieńsza czcionka
										},
									},
									grid: {
										color: '#444444', // Kolor siatki na osi X
									},
								},
								y: {
									ticks: {
										color: 'white', // Kolor tekstu na osi Y
										font: {
											weight: 'lighter', // Cieńsza czcionka
										},
									},
									grid: {
										color: '#444444', // Kolor siatki na osi Y
									},
								},
							},
							plugins: {
								legend: {
									labels: {
										color: 'white', // Kolor legendy
									},
								},
							},
						}}
					/>
				</div>
			</>
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
			</div>
		</section>
	)
}

export default ClimatePredictionPage
