import Image from 'next/image'
import JoinToUsImg from '../../public/img/jointous-img.png'
import Button from '../UI/Button'

const JoinToUsSection = () => {
	return (
		<section className='w-full bg-backgroundColor text-white md:py-16  flex flex-col items-center '>
			<div className='max-w-5xl text-center px-6'>
				<h2 className='text-3xl md:text-4xl font-bold'>DOŁĄCZ DO NASZEJ SPOŁECZNOŚCI!</h2>
				<p className='text-base md:text-lg text-gray-300 mt-4'>
					Zyskaj dostęp do pełnej bazy historycznych danych pogodowych, interaktywnych wykresów i zaawansowanych analiz!
				</p>
				<Button className='mt-6 md:mt-10 px-6 py-3 text-sm md:text-base'>Zarejestruj się!</Button>
			</div>
			<div className='flex justify-center items-center mt-10 p-6 md:p-10 w-full rounded-lg bg-gray-900'>
				<Image 
					src={JoinToUsImg} 
					alt='Join to us' 
					width={600} 
					height={350} 
					className='w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl' 
				/>
			</div>
		</section>
	)
}

export default JoinToUsSection
