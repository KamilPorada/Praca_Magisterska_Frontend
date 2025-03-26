'use client'
import { useState, useEffect } from 'react'
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
import WindDirectionChart from '@/components/Charts/WindDirectionChart'

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
		setIsFormSubmitted(true) // Ustawiamy formularz jako wysłany, aby renderować tabelę
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
					<div className='w-full mt-10 flex flex-wrap flex-row justify-between items-center gap-6'>
						<TemperatureChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>
                        <RainChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>
                        <SnowChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>
                        <WindDirectionChart
							data={selectedOption === 'days' ? dailyData : selectedOption === 'months' ? monthlyData : yearlyData}
						/>
					</div>
				)}
			</div>
		</section>
	)
}

export default Charts
