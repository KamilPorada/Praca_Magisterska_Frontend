'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

const AnalogClock = () => {
	const [time, setTime] = useState(new Date())
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setTime(new Date())
		}, 1000)

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [])

	const hours = time.getHours()
	const minutes = time.getMinutes()
	const seconds = time.getSeconds()

	const hourDeg = (hours % 12) * 30 + minutes * 0.5
	const minuteDeg = minutes * 6
	const secondDeg = seconds * 6

	const formatTime = (num: number) => num.toString().padStart(2, '0')

	return (
		<div className='flex flex-col items-center justify-center gap-4 p-5 rounded-2xl shadow-xl bg-gray-800 text-white w-full'>
			{/* Ikonka w kółku */}
			<div className='flex flex-row justify-center items-center gap-3'>
					<FontAwesomeIcon icon={faClock} className='text-5xl text-mainColor' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Aktualny
					<br />
					czas
				</h4>
			</div>

			{/* Zegar analogowy */}
			<div className='relative w-48 h-48 rounded-full border-4 border-white/10'>
				{/* Hour marks */}
				{[...Array(12)].map((_, i) => {
					const angle = (i * 360) / 12
					return (
						<div
							key={i}
							className='absolute w-[2px] h-12 bg-white/40'
							style={{
								top: '24%',
								left: '49.5%',
								transform: `rotate(${angle}deg) translateY(-90%) translateX(-50%)`,
								transformOrigin: 'center bottom',
							}}
						/>
					)
				})}

				{/* Hour hand */}
				<div
					className='absolute w-1 h-14 bg-white left-1/2 top-1/2 origin-bottom rounded'
					style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }}
				/>
				{/* Minute hand */}
				<div
					className='absolute w-1 h-20 bg-blue-300 left-1/2 top-1/2 origin-bottom rounded'
					style={{ transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)` }}
				/>
				{/* Second hand */}
				<div
					className='absolute w-0.5 h-24 bg-red-400 left-1/2 top-1/2 origin-bottom rounded'
					style={{ transform: `translate(-50%, -100%) rotate(${secondDeg}deg)` }}
				/>

				{/* Center dot */}
				<div className='absolute w-3 h-3 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10' />
			</div>

			{/* Zegar cyfrowy */}
			<p className='mt-4 text-lg font-mono tracking-widest text-white'>
				{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
			</p>
		</div>
	)
}

export default AnalogClock
