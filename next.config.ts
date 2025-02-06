import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['lh3.googleusercontent.com'], // Разрешенные домены для изображений
	},
	async headers() {
		return [
			{
				source: '/(.*)', // Общие заголовки для всех файлов
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
			{
				source: '/manifest.json', // Добавлен manifest.json
				headers: [
					{
						key: 'Content-Type',
						value: 'application/manifest+json; charset=utf-8',
					},
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
				],
			},
			{
				source: '/sw.js', // Добавлен Service Worker
				headers: [
					{
						key: 'Content-Type',
						value: 'application/javascript; charset=utf-8',
					},
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
					{
						key: 'Content-Security-Policy',
						value: "default-src 'self'; script-src 'self'",
					},
					{
						key: 'Service-Worker-Allowed',
						value: '/',
					},
				],
			},
		];
	},
};

export default nextConfig;
