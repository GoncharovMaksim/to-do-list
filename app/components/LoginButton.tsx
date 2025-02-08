import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';


export default function LoginButton() {
  const session = useSession();
	return (
		<div>
			{!session?.data ? (
				<Link
					href={'/api/auth/signin'}
					className='flex items-center justify-center p-2 sm:p-1 md:p-1 text-base sm:text-sm md:text-xs ml-4'
				>
					<span className='material-icons sm:text-lg md:text-sm'>login</span>
				</Link>
			) : (
				<Link
					href={'#'}
					onClick={() => {
						signOut();
					}}
					className='flex items-center justify-center p-2 sm:p-1 md:p-1 text-base sm:text-sm md:text-xs ml-4'
				>
					<span className='material-icons sm:text-lg md:text-sm'>logout</span>
				</Link>
			)}
		</div>
	);
}
