import LoadingBars from "@/app/components/LoadingBars";

export default function Loading() {
	return (
		<div className='container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center '>
			<div className='p-8 flex flex-col items-center space-y-6'>
				<h1 className='text-3xl text-center font-bold tracking-tight text-gray-900'>
					Школа112 - Лучший проект для помощи ученику
				</h1>
				<h3 className='text-2xl text-center font-bold mb-4'>
					Загрузка данных...
				</h3>
				<LoadingBars />
			</div>
		</div>
	);
}
