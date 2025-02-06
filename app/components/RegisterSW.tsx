'use client';
import { useEffect } from 'react';

export default function RegisterSW() {
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then(registration => {
					console.log('Service Worker зарегистрирован:', registration);
				})
				.catch(error => {
					console.error('Ошибка при регистрации Service Worker:', error);
				});
		}
	}, []);

	return null;
}
