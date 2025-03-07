import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDroplet } from '@fortawesome/free-solid-svg-icons'

const PlatformSectionTitle: React.FC<{ title: string }> = props => {
	return (
		<div className='relative -z-10'>
			<h2 className='pb-3 text-center text-white text-lg md:text-xl lg:text-2xl uppercase font-semibold'>
				{props.title}
			</h2>
			<div className='flex flex-row justify-center items-center'>
				<div className='w-10 h-[3px] bg-gray-200 mr-2'></div>
				<FontAwesomeIcon className='text-mainColor mr-1' icon={faDroplet} />
				<FontAwesomeIcon className='text-mainColor' icon={faDroplet} />
				<FontAwesomeIcon className='text-mainColor ml-1' icon={faDroplet} />
				<div className='w-10 h-[3px] bg-gray-200 ml-2'></div>
			</div>
		</div>
	)
}

export default PlatformSectionTitle
