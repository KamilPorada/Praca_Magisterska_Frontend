'use client'
import { useState, useEffect, useRef } from 'react'
import { useSidebar } from '../../components/contexts/SidebarProvider'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'

import DailyWeatherDataForm from '../../components/Forms/DailyWeatherDataForm'
import MonthlyWeatherDataForm from '../../components/Forms/MonthlyWeatherDataForm'
import YearlyWeatherDataForm from '../../components/Forms/YearlyWeatherDataForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay, faCalendarAlt, faCalendar } from '@fortawesome/free-solid-svg-icons'

import TemperatureChart from '@/components/Charts/TemperatureCharts'
import RainChart from '@/components/Charts/RainChart'
import SnowChart from '@/components/Charts/SnowChart'
import PrecipitationChart from '@/components/Charts/PrecipitationChart'
import PrecipitationDurationChart from '@/components/Charts/PrecipitationDurationChart'
import PrecipitationVsSolarRadiationChart from '@/components/Charts/PrecipitationVsSolarRadiationChart'
import WindChart from '@/components/Charts/WindChart'
import WindDirectionChart from '@/components/Charts/WindDirectionChart'
import DayNightDurationChart from '@/components/Charts/DayNightDurationChart'
import SunriseSunsetTimeChart from '@/components/Charts/SunriseSunsetTimeChart'
import EvapotranspirationChart from '@/components/Charts/EvapotranspirationChart'
import SolarChart from '@/components/Charts/SolarChart'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Button from '@/components/UI/Button'

type City = {
	id: number
	name: string
}

type DailyWeatherData = {
	id: number
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

type MonthlyWeatherData = {
	id: number
	year: number
	month: number
	maxTemperature: number
	minTemperature: number
	maxFeelsLikeTemperature: number
	minFeelsLikeTemperature: number
	dailySunshine: number
	dailyLightHours: number
	maxWindSpeed: number
	windGusts: number
	totalPrecipitation: number
	rain: number
	snow: number
	precipitationTime: number
	totalSolarRadiation: number
	evapotranspiration: number
	weatherCode: number
	dominantWindDirection: number
}

type YearlyWeatherData = {
	id: number
	year: number
	maxTemperature: number
	minTemperature: number
	maxFeelsLikeTemperature: number
	minFeelsLikeTemperature: number
	maxWindSpeed: number
	windGusts: number
	totalPrecipitation: number
	rain: number
	snow: number
	precipitationTime: number
	dominantWindDirection: number
}

const Charts = () => {
	const [cities, setCities] = useState<City[]>([])
	const [selectedOption, setSelectedOption] = useState<'days' | 'months' | 'years'>('days')
	const [dailyData, setDailyData] = useState<DailyWeatherData[]>([])
	const [monthlyData, setMonthlyData] = useState<MonthlyWeatherData[]>([])
	const [yearlyData, setYearlyData] = useState<YearlyWeatherData[]>([])
	const [isFormSubmitted, setIsFormSubmitted] = useState(false)
	const { sidebarContainer } = useSidebar()
	const resultsRef = useRef<HTMLDivElement | null>(null)

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

	const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedOption(e.target.value as 'days' | 'months' | 'years')
		setIsFormSubmitted(false) // Resetowanie stanu formularza, aby tabele były ukryte
	}

	const handleDataFetched = (data: any) => {
		if (selectedOption === 'days') {
			setDailyData(data)
		} else if (selectedOption === 'months') {
			setMonthlyData(data)
		} else if (selectedOption === 'years') {
			setYearlyData(data)
		}
		setIsFormSubmitted(true)

		setTimeout(() => {
			resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
			setTimeout(() => {
				window.scrollBy({ top: 420, left: 0, behavior: 'smooth' })
			}, 300)
		}, 300)
	}

	const renderForm = () => {
		switch (selectedOption) {
			case 'days':
				return <DailyWeatherDataForm cities={cities} onDataFetched={handleDataFetched} />
			case 'months':
				return <MonthlyWeatherDataForm cities={cities} onDataFetched={handleDataFetched} />
			case 'years':
				return <YearlyWeatherDataForm cities={cities} onDataFetched={handleDataFetched} />
			default:
				return null
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

			const fileName = `Wizualizacja danych na wykresach - ${date} ${time}.pdf`

			pdf.save(fileName)
		} else {
			console.error('Nie znaleziono elementu do eksportu!')
		}
	}
	return (
		<section className={sidebarContainer}>
			<div className='flex flex-col justify-center items-center px-4 sm:px-6'>
				<PlatformSectionTitle title='Wizualizacja danych' />

				<div className='w-full max-w-md flex flex-col justify-center items-center'>
					<p className='font-thin my-5 text-center text-lg'>
						Wybierz miasto i przedział czasowy, aby zwizualizować dane pogodowe!
					</p>
					<div className='w-full flex flex-col items-start mb-4'>
						<p className='mb-2 font-semibold'>Zakres danych:</p>
						<div className='w-full flex flex-row items-center justify-center gap-4'>
							<div
								className={`w-20 h-20 cursor-pointer flex flex-col items-center justify-between p-4 border-2 rounded-lg transition-all duration-300 ease-in-out ${
									selectedOption === 'days'
										? 'bg-mainColor border-mainColor text-white'
										: 'bg-white border-gray-300 text-secondaryColor hover:bg-blue-100 hover:border-blue-400'
								}`}
								onClick={() =>
									handleOptionChange({ target: { value: 'days' } } as React.ChangeEvent<HTMLInputElement>)
								}>
								<FontAwesomeIcon icon={faCalendarDay} className='text-xl ' />
								<p className='text-center leading-4 mt-1 text-sm '>
									Zakres
									<br />
									dat
								</p>
							</div>

							<div
								className={`w-20 h-20 cursor-pointer flex flex-col items-center justify-between p-4 border-2 rounded-lg transition-all duration-300 ease-in-out ${
									selectedOption === 'months'
										? 'bg-mainColor border-mainColor text-white'
										: 'bg-white border-gray-300 text-secondaryColor hover:bg-blue-100 hover:border-blue-400'
								}`}
								onClick={() =>
									handleOptionChange({ target: { value: 'months' } } as React.ChangeEvent<HTMLInputElement>)
								}>
								<FontAwesomeIcon icon={faCalendarAlt} className='text-xl' />
								<p className='text-center leading-4 mt-1 text-sm'>
									Zakres
									<br />
									miesięcy
								</p>
							</div>

							{/* Lata */}
							<div
								className={`w-20 h-20 cursor-pointer flex flex-col items-center justify-between p-4 border-2 rounded-lg transition-all duration-300 ease-in-out ${
									selectedOption === 'years'
										? 'bg-mainColor border-mainColor text-white'
										: 'bg-white border-gray-300 text-secondaryColor hover:bg-blue-100 hover:border-blue-400'
								}`}
								onClick={() =>
									handleOptionChange({ target: { value: 'years' } } as React.ChangeEvent<HTMLInputElement>)
								}>
								<FontAwesomeIcon icon={faCalendar} className='text-xl' />
								<p className='text-center leading-4 mt-1 text-sm'>
									Zakres
									<br />
									lat
								</p>
							</div>
						</div>
					</div>
					{renderForm()}
				</div>
				{isFormSubmitted && (
					<div ref={resultsRef} className='w-full mt-10 flex flex-wrap flex-row justify-between items-center gap-6'>
						<TemperatureChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>
						<RainChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>
						<PrecipitationChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>
						<SnowChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>

						<PrecipitationDurationChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>
						{(selectedOption === 'days' || selectedOption === 'months') && (
							<PrecipitationVsSolarRadiationChart data={selectedOption === 'days' ? dailyData : monthlyData} />
						)}
						<WindDirectionChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>
						<WindChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>

						{selectedOption === 'days' && <DayNightDurationChart data={dailyData} />}
						{selectedOption === 'days' && <SunriseSunsetTimeChart data={dailyData} />}
						{(selectedOption === 'days' || selectedOption === 'months') && (
							<EvapotranspirationChart data={selectedOption === 'days' ? dailyData : monthlyData} />
						)}
						{(selectedOption === 'days' || selectedOption === 'months') && (
							<SolarChart data={selectedOption === 'days' ? dailyData : monthlyData} />
						)}
					</div>
				)}
				{isFormSubmitted && (
					<div className='flex justify-center mt-6'>
						<Button onClick={handleExportToPDF}>Eksport do PDF</Button>
					</div>
				)}
			</div>
		</section>
	)
}

export default Charts
