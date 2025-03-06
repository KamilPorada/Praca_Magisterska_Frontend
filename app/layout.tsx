import type { Metadata } from 'next'
import MainNavigation from '../components/Navigation/MainNavigation'
import Provider from '@/components/Provider'
import Sidebar from '@/components/Navigation/Sidebar'
import './globals.css'

export const metadata: Metadata = {
	title: 'Weather App',
	description: 'Interactive weather data visualization platform',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en'>
			<body>
				<Provider>
					<Sidebar />
					{children}
				</Provider>
			</body>
		</html>
	)
}
