'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
interface ToDoItem {
	id: string;
	title: string;
	completed: boolean;
}

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function Home() {
	const [toDoList, setToDoList] = useState<ToDoItem[]>([]);
	const [toDoListTitle, setToDoListTitle] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const [isCompleted, setIsCompleted] = useState<boolean>(false);
	const [filterOn, setFilterOn] = useState<boolean>(false);
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [showInstallPopup, setShowInstallPopup] = useState(false);

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

	function addToDoItem() {
		if (!toDoListTitle.trim()) return;
		const item: ToDoItem = {
			id: nanoid(),
			title: toDoListTitle,
			completed: false,
		};

		setToDoList([...toDoList, item]);
		setToDoListTitle('');
		inputRef.current?.focus();
	}

	function completeToDoItem(item: ToDoItem) {
		const completedItem = toDoList.map(el => {
			if (el.id === item.id) {
				return { ...el, completed: !el.completed };
			}
			return el;
		});
		setToDoList(completedItem);
	}

	const deleteToDoItem = useCallback((item: ToDoItem) => {
		setToDoList(prev => prev.filter(el => el.id !== item.id));
	}, []);

	useEffect(() => {
		try {
			const storedList = localStorage.getItem('toDoList');
			setToDoList(storedList ? JSON.parse(storedList) : []);
		} catch (error) {
			console.error('Ошибка загрузки списка дел:', error);
			setToDoList([]);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('toDoList', JSON.stringify(toDoList));
	}, [toDoList]);

	const filteredToDoList = useMemo(() => {
		return (
			filterOn ? toDoList.filter(el => el.completed === isCompleted) : toDoList
		).filter(el =>
			el.title.toLowerCase().includes(toDoListTitle.toLowerCase())
		);
	}, [filterOn, toDoList, isCompleted, toDoListTitle]);

	return (
		<div className='container mx-auto p-4 items-center gap-4'>
			<h1 className='text-3xl text-center'>Список дел</h1>
			{/* Всплывающее окно установки */}
			{!isInstalled && deferredPrompt && showInstallPopup && (
				<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg text-center'>
						<h2 className='text-xl font-bold mb-4'>
							Хотите установить приложение?
						</h2>
						<div className='flex justify-center gap-4'>
							<button className='btn btn-outline' onClick={handleInstallClick}>
								Установить
							</button>
							<button className='btn btn-outline' onClick={handleClosePopup}>
								Позже
							</button>
						</div>
					</div>
				</div>
			)}
			<div className='text-3xl text-center'>
				<ul className='menu menu-horizontal bg-base-200'>
					<li
						onClick={() => setFilterOn(false)}
						className={filterOn ? '' : 'disabled opacity-50'}
					>
						<a>Все</a>
					</li>
					<li
						onClick={() => {
							setIsCompleted(true);
							setFilterOn(true);
						}}
						className={!filterOn || !isCompleted ? '' : 'disabled opacity-50'}
					>
						<a>Сделано</a>
					</li>
					<li
						onClick={() => {
							setIsCompleted(false);
							setFilterOn(true);
						}}
						className={!filterOn || isCompleted ? '' : 'disabled opacity-50'}
					>
						<a>Не сделано</a>
					</li>
				</ul>
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					addToDoItem();
				}}
				action=''
				className=' p-8 flex flex-col  items-center gap-4 w-full '
			>
				<input
					ref={inputRef}
					type='text'
					value={toDoListTitle}
					onChange={el => setToDoListTitle(el.target.value)}
					className='input w-full text-xl flex-auto px-8'
				/>
				<button className='btn btn-outline min-w-60'>Добавить</button>
			</form>

			{filteredToDoList.map((el, index) => {
				return (
					<div
						key={el.id}
						className={`p-4 flex items-center gap-4 w-full rounded-lg ${
							index % 2 ? 'bg-gray-300' : ''
						}`}
					>
						<label
							htmlFor={`todo-${el.id}`}
							className='text-xl flex items-center gap-4 flex-grow'
						>
							<input
								type='checkbox'
								id={`todo-${el.id}`}
								checked={el.completed}
								className='checkbox'
								onChange={() => completeToDoItem(el)}
							/>
							<span className={el.completed ? 'line-through' : ''}>
								{el.title}
							</span>
						</label>

						<button
							onClick={() => deleteToDoItem(el)}
							className='flex items-center justify-center p-2 sm:p-1 md:p-1 text-base sm:text-sm md:text-xs ml-4'
						>
							<span className='material-icons sm:text-lg md:text-sm'>
								delete
							</span>
						</button>
					</div>
				);
			})}
		</div>
	);
}
