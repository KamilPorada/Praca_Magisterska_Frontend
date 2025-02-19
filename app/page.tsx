'use client'
import LandingPageContenet from '../components/Home/LandingPageContent'
import { SessionProvider } from 'next-auth/react'

export default function Home() {
	return (
		<SessionProvider>
			<LandingPageContenet />
		</SessionProvider>
	)
}
