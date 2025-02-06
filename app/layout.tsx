import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './components/Providers';
import RegisterSW from './components/RegisterSW';
const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Список дел',
	description: 'Приложение для создания списка планируемых дел и задач',
	manifest: '/manifest.webmanifest', // ✅ Важно! Подключаем манифест здесь!
	themeColor: '#000000', // ✅ Цвет статус-бара на мобилках
	icons: [{ rel: 'apple-touch-icon', url: '/icon-192x192.png' }],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ru'>
			<head>
				<link rel='manifest' href='/manifest.json' />
				<link
					href='https://fonts.googleapis.com/icon?family=Material+Icons'
					rel='stylesheet'
				/>
			</head>
			<body
				className={`bg-gray-100 ${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<RegisterSW />
					{children}
				</Providers>
			</body>
		</html>
	);
}
