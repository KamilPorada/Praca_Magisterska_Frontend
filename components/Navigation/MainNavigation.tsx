'use client'
import { useSession } from 'next-auth/react'
import Sidebar from './Sidebar'

const Navigation = () => {
	const { data: session } = useSession()

	return !session ? '' : <Sidebar/>
}

export default Navigation
