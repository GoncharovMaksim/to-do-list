'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
//import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ToDoItem } from '@/types/todoitem';
import { ToDos } from '@/types/todos';
//import useHandleBeforeInstallPrompt from './hooks/useHandleBeforeInstallPrompt';
import HandleBeforeInstallPrompt from './components/HandleBeforeInstallPrompt';
import LoginButton from './components/LoginButton';
import FilterToDoList from './components/FilterToDoList';


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



	 const handleClosePopup = () => {
	 	
	 	setShowDeletePopup(false);
	 };

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

	function correctedToDoItem(item: ToDoItem) {
		const correctedToDoItem = toDoList.map(el => {
			if (el.id === item.id) {
				if (session?.data) {
					async function fetchPut() {
						try {
							const response = await fetch('api/todos', {
								method: 'PUT',
								body: JSON.stringify({
									userId: session?.data?.user.id,
									toDoItem: { ...item, title: correctedToDoListTitle },
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

				return { ...el, title: correctedToDoListTitle };
			}
			return el;
		});
		setToDoList(correctedToDoItem);
	}

	const deleteToDoItem = useCallback(
		(item: ToDoItem) => {
			console.log('item', item);
			if (session?.data) {
				async function fetchDelete() {
					try {
						const response = await fetch('api/todos', {
							method: 'DELETE',
							body: JSON.stringify({
								userId: session?.data?.user.id,
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

				fetchDelete();
			}
			setToDoList(prev => prev.filter(el => el.id !== item.id));
			setShowDeletePopup(false);
		},
		[session?.data]
	);

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

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	useEffect(() => {
		// Устанавливаем правильную высоту при инициализации компонента
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [correctedToDoListTitle]);

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCorrectedToDoListTitle(e.target.value);
	};

	const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
		const target = e.target as HTMLTextAreaElement;
		target.style.height = 'auto'; // Сбрасываем высоту
		target.style.height = `${target.scrollHeight}px`; // Устанавливаем по контенту
	};

	return (
		<div className='container mx-auto p-4 items-center gap-4'>
			<HandleBeforeInstallPrompt />
			<div className='flex items-center justify-center p-2 sm:p-1 md:p-1 text-base sm:text-sm md:text-xs ml-4'>
				<h1 className='text-2xl text-center'>Список дел</h1>
				<LoginButton />
			</div>
			<FilterToDoList isCompleted={isCompleted} setIsCompleted={setIsCompleted} filterOn={filterOn} setFilterOn={setFilterOn} />
			{/* <div className='text-3xl text-center'>
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
			</div> */}
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
						{showDeletePopup && (
							<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
								<div className='bg-white p-6 rounded-lg shadow-lg text-center'>
									<h2 className='text-xl font-bold mb-4'>
										Хотите удалить запись?
									</h2>
									<textarea
										ref={textareaRef}
										value={correctedToDoListTitle}
										onChange={handleInputChange}
										onInput={handleInput}
										className='w-full text-xl flex-auto px-8 py-3 my-4 resize-none overflow-hidden border rounded-md shadow-md'
										rows={1}
									/>

									<div className='flex justify-center gap-4'>
										<button
											className='btn btn-outline'
											onClick={() => {
												if (itemToDelete) deleteToDoItem(itemToDelete);
											}}
										>
											Удалить
										</button>
										<button
											className='btn btn-outline'
											onClick={() => {
												if (itemToDelete) correctedToDoItem(itemToDelete);

												handleClosePopup();
											}}
										>
											Изменить
										</button>
										<button
											className='btn btn-outline'
											onClick={handleClosePopup}
										>
											Отмена
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
