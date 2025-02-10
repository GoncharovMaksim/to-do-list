'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';

import { useSession } from 'next-auth/react';
import { ToDoItem } from '@/types/todoitem';
import { ToDos } from '@/types/todos';
import HandleBeforeInstallPrompt from './components/HandleBeforeInstallPrompt';
import LoginButton from './components/LoginButton';
import FilterToDoList from './components/FilterToDoList';
import ShowDeletePopup from './components/ShowDeletePopup';
import ThemeSwap from './components/ThemeSwap';

export default function App() {
	const [toDoList, setToDoList] = useState<ToDoItem[]>([]);
	const [toDoListTitle, setToDoListTitle] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const [isCompleted, setIsCompleted] = useState<boolean>(false);
	const [filterOn, setFilterOn] = useState<boolean>(false);

	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<ToDoItem>();
	const [correctedToDoListTitle, setCorrectedToDoListTitle] = useState('');
	const session = useSession();

	const [darkTheme, setDarkTheme] = useState(false);

	async function addToDoItem() {
		if (!toDoListTitle.trim()) return;
		const item: ToDoItem = {
			id: nanoid(),
			title: toDoListTitle,
			completed: false,
		};

		setToDoList([...toDoList, item]);
		setToDoListTitle('');
		inputRef.current?.focus();
		if (session?.data) {
			try {
				const response = await fetch('api/todos', {
					method: 'POST',
					body: JSON.stringify({
						userId: session.data.user.id,
						toDoItem: item,
					}),
				});
				if (!response.ok) {
					throw new Error(`Ошибка HTTP: ${response.status}`);
				}
				return await response.json();
			} catch (error) {
				console.error('Ошибка запроса:', error);
			}
		}
	}

	function completeToDoItem(item: ToDoItem) {
		const completedItem = toDoList.map(el => {
			if (el.id === item.id) {
				if (session?.data) {
					async function fetchPut() {
						try {
							const response = await fetch('api/todos', {
								method: 'PUT',
								body: JSON.stringify({
									userId: session?.data?.user.id,
									toDoItem: { ...item, completed: !item.completed },
								}),
							});
							if (!response.ok) {
								throw new Error(`Ошибка HTTP: ${response.status}`);
							}
							return await response.json();
						} catch (error) {
							console.error('Ошибка запроса:', error);
						}
					}

					fetchPut();
				}

				return { ...el, completed: !el.completed };
			}
			return el;
		});
		setToDoList(completedItem);
	}

	useEffect(() => {
		if (session?.data) {
			fetch(`api/todos?userId=${session.data.user.id}`)
				.then(response => response.json())
				.then(data => {
					console.log(data);
					setToDoList(
						data.map((todos: ToDos) => {
							return todos.toDoItem;
						})
					);
				})
				.catch(error => console.error('Ошибка:', error));

			return;
		}

		try {
			const storedList = localStorage.getItem('toDoList');
			setToDoList(storedList ? JSON.parse(storedList) : []);
		} catch (error) {
			console.error('Ошибка загрузки списка дел:', error);
			setToDoList([]);
		}
	}, [session?.data]);

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

	useEffect(() => {
		const storedDarkTheme = localStorage.getItem('darkTheme');
		if (storedDarkTheme) {
			setDarkTheme(JSON.parse(storedDarkTheme));
		}
	}, []);

	return (
		<div
			className='container mx-auto p-4 items-center gap-4 min-h-screen h-[100dvh] overflow-auto'
			data-theme={darkTheme ? 'dark' : undefined}
		>
			<HandleBeforeInstallPrompt />

			<div className='flex items-center justify-between max-w-6xl mx-auto px-8 p-2 sm:p-1 md:p-1 text-base sm:text-sm md:text-xs'>
				{/* <div className='flex items-center justify-between max-w-4xl mx-auto px-8 p-2 sm:p-1 md:p-1 text-base sm:text-sm md:text-xs'> */}
				{/* <div className='flex items-center justify-center p-2 sm:p-1 md:p-1 text-base sm:text-sm md:text-xs ml-4'> */}
				<ThemeSwap darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
				<h1 className='text-2xl text-center'>Список дел</h1>
				<LoginButton />
			</div>
			<FilterToDoList
				isCompleted={isCompleted}
				setIsCompleted={setIsCompleted}
				filterOn={filterOn}
				setFilterOn={setFilterOn}
			/>

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
					className={`input w-full text-xl flex-auto px-8 ${
						darkTheme ? 'bg-gray-600' : ''
					}`}
				/>
				<button className='btn btn-outline min-w-60'>Добавить</button>
			</form>
			{filteredToDoList.map((el, index) => {
				return (
					<div
						key={el.id}
						className={`p-4 flex items-center gap-4 w-full rounded-lg ${
							index % 2 && !darkTheme ? 'bg-gray-300' : ''
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
							onClick={() => {
								setItemToDelete(el);
								setShowDeletePopup(true);
								setCorrectedToDoListTitle(el.title);
							}}
							className='flex items-center justify-center p-2 sm:p-1 md:p-1 text-base sm:text-sm md:text-xs ml-4'
						>
							<span className='material-icons sm:text-lg md:text-sm'>
								delete
							</span>
						</button>
						{/* Всплывающее окно удаления */}
						<ShowDeletePopup
							showDeletePopup={showDeletePopup}
							setShowDeletePopup={setShowDeletePopup}
							itemToDelete={itemToDelete}
							toDoList={toDoList}
							setToDoList={setToDoList}
							correctedToDoListTitle={correctedToDoListTitle}
							setCorrectedToDoListTitle={setCorrectedToDoListTitle}
							darkTheme={darkTheme}
						/>
					</div>
				);
			})}
		</div>
	);
}
