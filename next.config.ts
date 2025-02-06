// next.config.ts
import withPWA from 'next-pwa';
import { NextConfig } from 'next';
import { PWAConfig } from 'next-pwa';
interface ExtendedNextConfig extends NextConfig, PWAConfig {}

const nextConfig: ExtendedNextConfig = {
	reactStrictMode: true,
	pwa: {
		dest: 'public', // Папка для сервис-воркера
		register: true, // Автоматическая регистрация сервис-воркера
		skipWaiting: true, // Обновление сервис-воркера без ожидания
	},
	dest: ''
};

export default withPWA(nextConfig);
