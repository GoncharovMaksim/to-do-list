import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['lh3.googleusercontent.com'], // Добавьте сюда хост, с которого хотите загружать изображения
	},
	async headers() {
		return [
			{
				source: '/manifest.webmanifest',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/manifest+json',
					},
				],
			},
		];
	},
};

export default nextConfig;
