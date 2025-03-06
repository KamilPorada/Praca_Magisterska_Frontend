import type { Metadata } from 'next'
import Head from 'next/head'
import Provider from '@/components/Provider'
import { SidebarProvider } from '../components/contexts/SidebarProvider'
import Sidebar from '@/components/Navigation/Sidebar'
import './globals.css'

export const metadata: Metadata = {
	title: 'Weather App',
	description: 'Interactive weather data visualization platform',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en'>
			<Head>
				<title>Your Title</title>
				{/* Możesz dodać inne metadane */}
			</Head>
			<body>
				<SidebarProvider>
					<Provider>
						{children}
						<Sidebar />
					</Provider>
				</SidebarProvider>
			</body>
		</html>
	)
}
