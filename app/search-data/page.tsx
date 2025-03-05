'use client'
import React, { useEffect, useState } from 'react'
import DailyWeatherDataForm from '../../components/Forms/DailyWeatherDataForm'
import MonthlyWeatherDataForm from '../../components/Forms/MonthlyWeatherDataForm'
import YearlyWeatherDataForm from '../../components/Forms/YearlyWeatherDataForm'

import DailyWeatherDataTable from '../../components/Tables/DailyWeatherDataTable'
import MonthlyWeatherDataTable from '../../components/Tables/MonthlyWeatherDataTable'
import YearlyWeatherDataTable from '../../components/Tables/YearlyWeatherDataTable'

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

	useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/cities')
                const data = await response.json()
    
                const sortedData = data.sort((a: { name: string }, b: { name: string }) =>
                    a.name.localeCompare(b.name)
                )
    
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
		<div className='max-w-4xl mx-auto p-4 border border-gray-300 rounded-lg shadow-md bg-white text-black'>
			<h1 className='text-2xl font-bold text-center mb-6'>Wyszukiwanie danych pogodowych względem:</h1>

			<div className='mb-6'>
				<label className='block text-gray-700 font-semibold mb-2'>Wybierz zakres danych</label>
				<div className='flex gap-6'>
					<label>
						<input
							type='radio'
							value='days'
							checked={selectedOption === 'days'}
							onChange={handleOptionChange}
							className='mr-2'
						/>
						Dni
					</label>
					<label>
						<input
							type='radio'
							value='months'
							checked={selectedOption === 'months'}
							onChange={handleOptionChange}
							className='mr-2'
						/>
						Miesiące
					</label>
					<label>
						<input
							type='radio'
							value='years'
							checked={selectedOption === 'years'}
							onChange={handleOptionChange}
							className='mr-2'
						/>
						Lata
					</label>
				</div>
			</div>

			{renderForm()}

			{/* Renderowanie tabeli tylko po załadowaniu danych */}
			{renderTable()}
		</div>
	)
}

export default SearchData
