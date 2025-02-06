import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//import Providers from "./components/Providers";


export const metadata: Metadata = {
  title: "Список дел",
  description: "Приложение для создания списка планируемых дел и задач",
};

import { useEffect } from 'react';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then(() => console.log('Service Worker зарегистрирован'))
				.catch(err => console.error('Ошибка регистрации SW:', err));
		}
	}, []);

	return (
		<html lang='ru' className={`bg-gray-100`}>
			<head>
				{/* PWA */}
				<meta name='theme-color' content='#000000' />
				<meta name='mobile-web-app-capable' content='yes' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta
					name='apple-mobile-web-app-status-bar-style'
					content='black-translucent'
				/>
				<meta name='apple-mobile-web-app-title' content='Список дел' />

				{/* Манифест */}
				<link rel='manifest' href='/manifest.webmanifest' />

				{/* Значок для iOS */}
				<link rel='apple-touch-icon' href='/icon-192x192.png' />

				{/* Google Material Icons */}
				<link
					href='https://fonts.googleapis.com/icon?family=Material+Icons'
					rel='stylesheet'
				/>
			</head>
			<body className={`bg-gray-100 antialiased`}>{children}</body>
		</html>
	);
}
