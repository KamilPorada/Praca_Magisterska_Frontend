'use client'
import React, { useEffect, useState } from 'react'
import { useSidebar } from '../../components/contexts/SidebarProvider'
import SectionTitle from '@/components/UI/SectionTitle'

import DailyWeatherDataForm from '../../components/Forms/DailyWeatherDataForm'
import MonthlyWeatherDataForm from '../../components/Forms/MonthlyWeatherDataForm'
import YearlyWeatherDataForm from '../../components/Forms/YearlyWeatherDataForm'

import DailyWeatherDataTable from '../../components/Tables/DailyWeatherDataTable'
import MonthlyWeatherDataTable from '../../components/Tables/MonthlyWeatherDataTable'
import YearlyWeatherDataTable from '../../components/Tables/YearlyWeatherDataTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay, faCalendarAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'

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

const SearchData: React.FC = () => {
	const [cities, setCities] = useState<City[]>([])
	const [selectedOption, setSelectedOption] = useState<'days' | 'months' | 'years'>('days')
	const [dailyData, setDailyData] = useState<DailyWeatherData[]>([])
	const [monthlyData, setMonthlyData] = useState<MonthlyWeatherData[]>([])
	const [yearlyData, setYearlyData] = useState<YearlyWeatherData[]>([])
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
	}

	const handleDataFetched = (data: any) => {
		if (selectedOption === 'days') {
			setDailyData(data)
		} else if (selectedOption === 'months') {
			setMonthlyData(data)
		} else if (selectedOption === 'years') {
			setYearlyData(data)
		}
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

	const renderTable = () => {
		if (selectedOption === 'days' && dailyData.length > 0) {
			return <DailyWeatherDataTable dailyData={dailyData} />
		} else if (selectedOption === 'months' && monthlyData.length > 0) {
			return <MonthlyWeatherDataTable monthlyData={monthlyData} />
		} else if (selectedOption === 'years' && yearlyData.length > 0) {
			return <YearlyWeatherDataTable yearlyData={yearlyData} />
		}
		return null
	}

	return (
		<section className={sidebarContainer}>
			<div className='px-6'>
				<SectionTitle title='Wyszukiwarka danych pogodowych'/>

				<div className='mb-6'>
					<label className='block text-gray-700 font-semibold mb-2'>Wybierz zakres danych</label>
					<div className='flex gap-6'>
						{/* Dni */}
						<label 
							className={`cursor-pointer flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-300 ease-in-out ${
								selectedOption === 'days' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-700'
							} hover:bg-blue-100 hover:border-blue-400`}
							onClick={() => handleOptionChange({ target: { value: 'days' } } as React.ChangeEvent<HTMLInputElement>)}
						>
							<FontAwesomeIcon icon={faCalendarDay} className='text-3xl mb-2' />
							Dni
						</label>

						{/* Miesiące */}
						<label 
							className={`cursor-pointer flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-300 ease-in-out ${
								selectedOption === 'months' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-700'
							} hover:bg-blue-100 hover:border-blue-400`}
							onClick={() => handleOptionChange({ target: { value: 'months' } } as React.ChangeEvent<HTMLInputElement>)}
						>
							<FontAwesomeIcon icon={faCalendarAlt} className='text-3xl mb-2' />
							Miesiące
						</label>

						{/* Lata */}
						<label 
							className={`cursor-pointer flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-300 ease-in-out ${
								selectedOption === 'years' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-700'
							} hover:bg-blue-100 hover:border-blue-400`}
							onClick={() => handleOptionChange({ target: { value: 'years' } } as React.ChangeEvent<HTMLInputElement>)}
						>
							<FontAwesomeIcon icon={faCalendarCheck} className='text-3xl mb-2' />
							Lata
						</label>
					</div>
				</div>

				{renderForm()}

				{/* Renderowanie tabeli tylko po załadowaniu danych */}
				{renderTable()}
			</div>
		</section>
	)
}

export default SearchData
