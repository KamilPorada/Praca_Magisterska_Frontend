'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useSidebar } from '../../components/contexts/SidebarProvider'
import PlatformSectionTitle from '@/components/UI/PlatformSectionTitle'

import DailyWeatherDataForm from '../../components/Forms/DailyWeatherDataForm'
import MonthlyWeatherDataForm from '../../components/Forms/MonthlyWeatherDataForm'
import YearlyWeatherDataForm from '../../components/Forms/YearlyWeatherDataForm'

import DailyWeatherDataTable from '../../components/Tables/DailyWeatherDataTable'
import MonthlyWeatherDataTable from '../../components/Tables/MonthlyWeatherDataTable'
import YearlyWeatherDataTable from '../../components/Tables/YearlyWeatherDataTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay, faCalendarAlt, faCalendar } from '@fortawesome/free-solid-svg-icons'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import autoTable from 'jspdf-autotable'
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

const SearchData: React.FC = () => {
	const [cities, setCities] = useState<City[]>([])
	const [selectedOption, setSelectedOption] = useState<'days' | 'months' | 'years'>('days')
	const [dailyData, setDailyData] = useState<DailyWeatherData[]>([])
	const [monthlyData, setMonthlyData] = useState<MonthlyWeatherData[]>([])
	const [yearlyData, setYearlyData] = useState<YearlyWeatherData[]>([])
	const [isFormSubmitted, setIsFormSubmitted] = useState(false)
	const { sidebarContainer } = useSidebar()
	const resultRef = useRef<HTMLDivElement | null>(null)

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
			resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
			setTimeout(() => {
				window.scrollBy({ top: 400, left: 0, behavior: 'smooth' })
			}, 300)
		}, 300)
	}

	const handleExportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    // Wybór nagłówków w zależności od zakresu (dni, miesiące, lata)
    if (selectedOption === 'days') {
        // Nagłówki dla danych dziennych
        csvContent += 'L.P.,Data,Maksymalna temperatura (°C),Minimalna temperatura (°C),Maksymalna odczuwalna temperatura (°C),Minimalna odczuwalna temperatura (°C),Całkowite opady (mm),Deszcz (mm),Deszcz ze śniegiem (mm),Śnieg (mm),Czas opadów (godz.),Wschód słońca,Zachód słońca,Czas nasłonecznienia (godz.),Ilość światła dziennego (godz.),Prędkość wiatru (km/h),Porywy wiatru (km/h),Dominujący kierunek wiatru (°),Suma promieniowania słonecznego (MJ/m²),Ewapotranspiracja (mm),Kod pogody\n';

        dailyData.forEach((data, index) => {
            const row = `${index + 1},${data.date},${data.maxTemperature},${data.minTemperature},${data.maxFeelTemperature},${data.minFeelTemperature},${data.totalPrecipitation},${data.rain},${data.rainSnow},${data.snow},${data.precipitationDuration},${data.sunrise},${data.sunset},${data.sunlightDuration},${data.daylightDuration},${data.maxWindSpeed},${data.windGusts},${data.dominantWindDirection},${data.totalSolarRadiation},${data.evapotranspiration},${data.weatherCode}\n`;
            csvContent += row;
        });

    } else if (selectedOption === 'months') {
        // Nagłówki dla danych miesięcznych
        csvContent += 'L.P.,Rok,Miesiąc,Średnia maksymalna temperatura (°C),Średnia minimalna temperatura (°C),Średnia maksymalna odczuwalna temperatura (°C),Średnia minimalna odczuwalna temperatura (°C),Średnie nasłonecznienie dzienne (godz.),Średnia ilość światła dziennego (godz.),Średnia prędkość wiatru (km/h),Średnie porywy wiatru (km/h),Suma opadów (mm),Suma opadów deszczu (mm),Suma opadów śniegu (mm),Sumaryczny czas opadów (godz.),Suma promieniowania słonecznego (MJ/m²),Sumaryczna ewapotranspiracja (mm),Dominujący kierunek wiatru (°),Dominujący kod pogody\n';

        monthlyData.forEach((data, index) => {
            const row = `${index + 1},${data.year},${data.month},${data.maxTemperature},${data.minTemperature},${data.maxFeelsLikeTemperature},${data.minFeelsLikeTemperature},${data.dailySunshine},${data.dailyLightHours},${data.maxWindSpeed},${data.windGusts},${data.totalPrecipitation},${data.rain},${data.snow},${data.precipitationTime},${data.totalSolarRadiation},${data.evapotranspiration},${data.dominantWindDirection},${data.weatherCode}\n`;
            csvContent += row;
        });

    } else if (selectedOption === 'years') {
        // Nagłówki dla danych rocznych
        csvContent += 'L.P.,Rok,Średnia maksymalna temperatura (°C),Średnia minimalna temperatura (°C),Średnia maksymalna odczuwalna temperatura (°C),Średnia minimalna odczuwalna temperatura (°C),Średnia prędkość wiatru (km/h),Średnie porywy wiatru (km/h),Suma opadów (mm),Suma opadów deszczu (mm),Suma opadów śniegu (mm),Sumaryczny czas opadów (godz.),Dominujący kierunek wiatru (°)\n';

        yearlyData.forEach((data, index) => {
            const row = `${index + 1},${data.year},${data.maxTemperature},${data.minTemperature},${data.maxFeelsLikeTemperature},${data.minFeelsLikeTemperature},${data.maxWindSpeed},${data.windGusts},${data.totalPrecipitation},${data.rain},${data.snow},${data.precipitationTime},${data.dominantWindDirection}\n`;
            csvContent += row;
        });
    }

    // Tworzymy link do pobrania pliku CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dane_meteorologiczne.csv');
    link.click();
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
		if (!isFormSubmitted) return null // Jeśli formularz nie został wysłany, nie renderujemy tabeli.

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
			<div className='flex flex-col justify-center items-center px-4 sm:px-6'>
				<PlatformSectionTitle title='Wyszukiwarka danych pogodowych' />

				<div className='w-full max-w-md flex flex-col justify-center items-center'>
					<p className='font-thin my-5 text-center text-lg'>
						Wybierz miasto i przedział czasowy, aby wyświetlić dane pogodowe!
					</p>
					<div className='w-full flex flex-col items-start mb-4'>
						<p className='mb-2 font-semibold'>Zakres danych:</p>
						<div className='w-full flex flex-row items-center justify-center gap-4'>
							{/* Dni */}
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

							{/* Miesiące */}
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
				<div ref={resultRef}>{renderTable()}</div>
				{isFormSubmitted && (
					<div className='flex justify-center mt-8'>
						<Button onClick={handleExportToCSV}>Eksport do CSV</Button>
					</div>
				)}
			</div>
		</section>
	)
}

export default SearchData
