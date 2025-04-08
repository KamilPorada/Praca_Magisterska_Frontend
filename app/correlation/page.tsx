'use client'

import { useState, useEffect, useRef } from 'react'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'
import CorrelationForm from '@/components/Forms/CorrelationForm'
import { useSidebar } from '@/components/contexts/SidebarProvider'

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
	maxTemperature: 'Maksymalna temperatura',
	minTemperature: 'Minimalna temperatura',
	maxFeelTemperature: 'Maksymalna odczuwalna temperatura',
	minFeelTemperature: 'Minimalna odczuwalna temperatura',
	totalPrecipitation: 'Całkowite opady',
	rain: 'Deszcz',
	rainSnow: 'Deszcz/Śnieg',
	snow: 'Śnieg',
	precipitationDuration: 'Czas opadów',
	weatherCode: 'Kod pogody',
	sunlightDuration: 'Czas nasłonecznienia',
	daylightDuration: 'Czas światła dziennego',
	maxWindSpeed: 'Maksymalna prędkość wiatru',
	windGusts: 'Porywy wiatru',
	dominantWindDirection: 'Dominujący kierunek wiatru',
	totalSolarRadiation: 'Całkowite promieniowanie słoneczne',
	evapotranspiration: 'Ewapotranspiracja',
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

			const response = await fetch(`http://localhost:8080/api/weather/correlation?${queryParams}`)
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

				<div ref={resultRef} className='mt-10'>
					{isFormSubmitted && result && (
						<div className='text-center bg-secondaryColor p-6 rounded-lg shadow-lg'>
							<h3 className='text-xl font-bold mb-4'>Wynik korelacji</h3>
							<p className='mb-2'>
								📊 <strong>{result.column1}</strong> vs <strong>{result.column2}</strong>
							</p>
							<p className='text-lg'>
								👉 Współczynnik korelacji:{' '}
								<span className='font-bold text-accentColor'>{result.correlation.toFixed(4)}</span>
							</p>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default CorrelationPage
