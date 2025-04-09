'use client'

import { useState, useEffect, useRef } from 'react'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'
import CorrelationForm from '@/components/Forms/CorrelationForm'
import { useSidebar } from '@/components/contexts/SidebarProvider'
import CorrelationChart from '@/components/Charts/CorrelationChart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

type City = {
	id: number
	name: string
}

type CorrelationResult = {
	correlation: number
	column1: string
	column2: string
	values1: number[]
	values2: number[]
}

type Column = {
	name: string
	displayName: string
}

const columnNameMap: { [key: string]: string } = {
	maxTemperature: 'maksymalna temperatura',
	minTemperature: 'minimalna temperatura',
	maxFeelTemperature: 'maksymalna odczuwalna temperatura',
	minFeelTemperature: 'minimalna odczuwalna temperatura',
	totalPrecipitation: 'całkowite opady',
	rain: 'deszcz',
	rainSnow: 'deszcz/śnieg',
	snow: 'śnieg',
	precipitationDuration: 'czas opadów',
	weatherCode: 'kod pogody',
	sunlightDuration: 'czas nasłonecznienia',
	daylightDuration: 'czas światła dziennego',
	maxWindSpeed: 'maksymalna prędkość wiatru',
	windGusts: 'porywy wiatru',
	dominantWindDirection: 'dominujący kierunek wiatru',
	totalSolarRadiation: 'całkowite promieniowanie słoneczne',
	evapotranspiration: 'ewapotranspiracja',
}

const CorrelationPage = () => {
	const [cities, setCities] = useState<City[]>([])
	const [columns, setColumns] = useState<Column[]>([])
	const [result, setResult] = useState<CorrelationResult | null>(null)
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

		const fetchColumns = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/weather/columns')
				const data = await response.json()
				const mappedColumns = data.columns.map((name: string) => ({
					name,
					displayName: columnNameMap[name] || name,
				}))
				setColumns(mappedColumns)
			} catch (error) {
				console.error('Błąd pobierania kolumn:', error)
			}
		}

		fetchCities()
		fetchColumns() // Pobieramy kolumny przy ładowaniu komponentu
	}, [])

	const handleSubmit = async (formData: {
		cityId: number
		startDate: string
		endDate: string
		column1: string
		column2: string
	}) => {
		setLoading(true)
		setIsFormSubmitted(false)

		try {
			const queryParams = new URLSearchParams({
				cityId: String(formData.cityId),
				startDate: formData.startDate,
				endDate: formData.endDate,
				column1: formData.column1,
				column2: formData.column2,
			})

			const response = await fetch(`http://localhost:8080/api/correlation?${queryParams}`)
			const data = await response.json()

			setResult(data)
			setIsFormSubmitted(true)

			setTimeout(() => {
				resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
				setTimeout(() => {
					window.scrollBy({ top: 150, left: 0, behavior: 'smooth' })
				}, 300)
			}, 300)
		} catch (error) {
			console.error('Błąd pobierania danych korelacji:', error)
		} finally {
			setLoading(false)
		}
	}

	const renderCorrelationResult = () => {
		if (!result) return <div>Brak wyników korelacji</div>

		const interpretCorrelation = (correlation: number) => {
			if (correlation > 0.8)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza bardzo silną dodatnią zależność między zmiennymi.
						Zmiany jednej zmiennej zazwyczaj powodują proporcjonalne zmiany drugiej w tym samym kierunku. Taka zależność
						może być bardzo przydatna w przewidywaniu wartości.
					</p>
				)
			if (correlation > 0.6)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza silną dodatnią zależność. Zmienne mają wyraźną
						tendencję do zmiany w tym samym kierunku, choć nie zawsze w idealnym tempie.
					</p>
				)
			if (correlation > 0.4)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza umiarkowaną dodatnią korelację. Zmienne są ze sobą
						powiązane, ale zależność nie jest wystarczająco silna, by jednoznacznie przewidywać jedną zmienną na
						podstawie drugiej.
					</p>
				)
			if (correlation > 0.2)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza słabą dodatnią zależność. Istnieje tendencja do
						wspólnego kierunku zmian, ale jest ona niewielka.
					</p>
				)
			if (correlation > 0)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza bardzo słabą dodatnią korelację. Zależność między
						zmiennymi jest minimalna i trudna do praktycznego wykorzystania.
					</p>
				)
			if (correlation === 0)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza brak zależności między zmiennymi. Zmiana jednej nie
						ma wpływu na zmianę drugiej.
					</p>
				)
			if (correlation > -0.2)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza bardzo słabą ujemną korelację. Zależność jest
						znikoma i nie pozwala wyciągać sensownych wniosków o kierunku zmian zmiennych.
					</p>
				)
			if (correlation > -0.4)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza słabą ujemną zależność. Zmienne wykazują przeciwną
						tendencję zmian, ale związek nie jest silny.
					</p>
				)
			if (correlation > -0.6)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza umiarkowaną ujemną korelację. Zmienne mają tendencję
						do zmiany w przeciwnych kierunkach w sposób zauważalny.
					</p>
				)
			if (correlation > -0.8)
				return (
					<p>
						Współczynnik korelacji Pearsona na tym poziomie oznacza silną ujemną zależność. Gdy jedna zmienna rośnie,
						druga zazwyczaj maleje w sposób wyraźny.
					</p>
				)
			return (
				<p>
					Współczynnik korelacji Pearsona na tym poziomie oznacza bardzo silną ujemną korelację. Zmienne są silnie
					powiązane, ale zmieniają się w przeciwnych kierunkach — wzrost jednej wiąże się z istotnym spadkiem drugiej.
				</p>
			)
		}

		return (
			<div
				ref={resultRef}
				className='bg-gray-900 p-4 sm:p-6 text-white rounded-xl shadow-lg w-full max-w-5xl mx-auto my-10'>
				<div className='p-4 rounded-lg'>
					<p className='font-semibold text-xl text-center'>
						Korelacja między kolumnami {columnNameMap[result.column1]} a {columnNameMap[result.column2]}
					</p>
					<p className='flex flex-row items-center justify-center gap-2 text-lg my-4 uppercase text-center font-bold text-accentColor'>
						<FontAwesomeIcon icon={faLink} className='text-3xl' /> Współczynnik korelacji Pearsona:{' '}
						{result.correlation.toFixed(2)}
					</p>
					<div className='text-center my-6 text-sm font-thin'>{interpretCorrelation(result.correlation)}</div>
					<CorrelationChart
						column1={result.column1}
						column2={result.column2}
						values1={result.values1}
						values2={result.values2}
					/>
				</div>
			</div>
		)
	}

	return (
		<section className={sidebarContainer}>
			<div className='flex flex-col justify-center items-center px-4 sm:px-6'>
				<PlatformSectionTitle title='Analiza korelacji' />
				<div className='w-full max-w-xl flex flex-col justify-center items-center'>
					<p className='font-thin my-5 text-center text-lg'>
						Wybierz miasto, zakres dat oraz dwie zmienne pogodowe, aby obliczyć korelację liniową Pearsona.
					</p>
					<CorrelationForm onSubmit={handleSubmit} cities={cities} columns={columns} />
				</div>

				{renderCorrelationResult()}
			</div>
		</section>
	)
}

export default CorrelationPage
