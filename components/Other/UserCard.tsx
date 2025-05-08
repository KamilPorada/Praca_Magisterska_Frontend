import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useSession } from 'next-auth/react'

const UserCard: React.FC = () => {
	const { data: session } = useSession()

	if (!session) {
		return (
			<div className='bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center'>
				<FontAwesomeIcon icon={faUserCircle} className='text-6xl text-gray-300 mb-4' />
				<h2 className='text-xl font-semibold text-white'>Brak zalogowanego użytkownika</h2>
			</div>
		)
	}

	return (
		<div className='bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center gap-4'>
			<div className='flex flex-row justify-center items-center gap-3 mb-3'>
				<FontAwesomeIcon icon={faUser} className='text-5xl text-mainColor text-start' />
				<h4 className='uppercase tracking-wide text-white/60'>
					Zalogowany
					<br />
					użytkownik
				</h4>
			</div>
			{session.user?.image ? (
				<img
					src={session.user.image}
					alt='User Avatar'
					className='w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-700'
				/>
			) : (
				<FontAwesomeIcon icon={faUserCircle} className='text-6xl text-gray-300 mb-4' />
			)}
			<h2 className='text-xl font-semibold text-white'>{session.user?.name || 'Użytkownik'}</h2>
			<p className='text-sm text-gray-400 -mt-4'>{session.user?.email}</p>
		</div>
	)
}

export default UserCard
