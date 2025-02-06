import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Заметки112',
		short_name: 'Заметки112',
		description: 'Приложение для создания списка планируемых дел и задач',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
		screenshots: [
			{
				src: '/screenshot-desktop.png',
				sizes: '1280x800',
				type: 'image/png',
				form_factor: 'wide', // Для десктопа
			},
			{
				src: '/screenshot-mobile.png',
				sizes: '750x1334',
				type: 'image/png',
				form_factor: 'narrow', // Для мобильных устройств (не wide)
			},
		],
	};
}
