'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
interface ToDoItem {
	id: string;
	title: string;
	completed: boolean;
}

export default function Home() {
	const [toDoList, setToDoList] = useState<ToDoItem[]>([]);
	//const [filteredToDoList, setFilteredToDoList] = useState<ToDoItem[]>([]);
	const [toDoListTitle, setToDoListTitle] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);
	const [isCompleted, setIsCompleted] = useState<boolean>(false);
	const [filterOn, setFilterOn] = useState<boolean>(false);

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

	const deleteToDoItem = useCallback((item: ToDoItem) => {
		setToDoList(prev => prev.filter(el => el.id !== item.id));
	}, []);


	function completeToDoItem(item: ToDoItem) {
		const completedItem = toDoList.map(el => {
			if (el.id === item.id) {
				return { ...el, completed: !el.completed };
			}
			return el;
		});
		setToDoList(completedItem);
	}

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
		return filterOn
			? toDoList.filter(el => el.completed === isCompleted)
			: toDoList;
	}, [toDoList, isCompleted, filterOn]);

	return (
		<div className='container mx-auto p-4 items-center gap-4'>
			<h1 className='text-3xl text-center'>Список дел</h1>
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
