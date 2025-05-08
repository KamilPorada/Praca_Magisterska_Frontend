'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faClock, faSun, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useSidebar } from '@/components/contexts/SidebarProvider'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import AnalogClock from '@/components/Other/AnalogClock'
import CurrentDateCard from '@/components/Other/CurrentDateCard'
import CurrentSeasonCard from '@/components/Other/CurrentSeasonCard'
import YearProgressCard from '@/components/Other/YearProgressCard'
import SunCycleCard from '@/components/Other/SunCycleCard'
import CurrentTemperatureCard from '@/components/Other/CurrentTemperatureCard'
import WindSpeedCard from '@/components/Other/WindSpeedCard'
import UserCard from '@/components/Other/UserCard'
import CityCard from '@/components/Other/CityCard'
import WindDirectionCard from '@/components/Other/WindDirectionCard'
import CoordinatesCard from '@/components/Other/CoordinateCard'
import WeekInfoCard from '@/components/Other/WeekInfoCard'

ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
	const { sidebarContainer } = useSidebar()

	return (
		<section className={`min-h-screen flex flex-col items-center justify-center px-4 ${sidebarContainer}`}>
			<div className='w-full max-w-7xl p-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<UserCard />
					<AnalogClock />
					<YearProgressCard />
					<SunCycleCard />
					<CurrentDateCard />
					<WeekInfoCard />
					<CityCard />
					<CoordinatesCard />
					<CurrentSeasonCard />
					<CurrentTemperatureCard />
					<WindSpeedCard />
					<WindDirectionCard />
				</div>
			</div>
		</section>
	)
}

export default Dashboard
