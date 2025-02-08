import { BeforeInstallPromptEvent } from "@/types/beforeInstallpromptevent";
import { useEffect, useState } from "react";



export default function useHandleBeforeInstallPrompt (){
const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPopup, setShowInstallPopup] = useState(false);
const [isInstalled, setIsInstalled] = useState(false);



useEffect(() => {

	const handleBeforeInstallPrompt = (e: Event) => {
		const promptEvent = e as BeforeInstallPromptEvent;
		e.preventDefault();
		setDeferredPrompt(promptEvent);
		setShowInstallPopup(true); // Показать всплывающее окно
	};

	const handleAppInstalled = () => {
		setIsInstalled(true);
		setShowInstallPopup(false); // Скрыть окно после установки
	};

	window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
	window.addEventListener('appinstalled', handleAppInstalled);

	return () => {
		window.removeEventListener(
			'beforeinstallprompt',
			handleBeforeInstallPrompt
		);
		window.removeEventListener('appinstalled', handleAppInstalled);
	};
}, []);

	const handleInstallClick = async () => {
		if (deferredPrompt) {
			await deferredPrompt.prompt();
			const choice = await deferredPrompt.userChoice;
			if (choice.outcome === 'accepted') {
				console.log('PWA установлено пользователем');
				setShowInstallPopup(false);
			} else {
				console.log('Пользователь отказался от установки');
			}
			setDeferredPrompt(null);
		}
	};
	const handleClosePopup = () => {
		setShowInstallPopup(false);
		
	};
  return {
		showInstallPopup,
		isInstalled,
		handleInstallClick,
		handleClosePopup,
		deferredPrompt,
	};
  
}