'use client';
import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
interface ToDoItem {
	id: string;
	title: string;
	completed: boolean;
}

export default function Home() {
	const [toDoList, setToDoList] = useState<ToDoItem[]>([]);

	const [toDoListTitle, setToDoListTitle] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);

	function addToDoItem() {
		const item: ToDoItem = {
			id: nanoid(),
			title: toDoListTitle,
			completed: false,
		};
		if (!item.title) return;

		setToDoList([...toDoList, item]);
		setToDoListTitle('');
		inputRef.current?.focus();
	}

	useEffect(() => {
		setToDoList(JSON.parse(localStorage.getItem('toDoList') || '[]'));
	}, []);

	useEffect(() => {
		localStorage?.setItem('toDoList', JSON.stringify(toDoList));
	}, [toDoList]);

	function deleteToDoItem(item: ToDoItem) {
		const deletedItem = toDoList.filter(el => el.id !== item.id);
		setToDoList(deletedItem);
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

	return (
		<div className='container mx-auto p-4 items-center gap-4'>
			<h1 className='text-4xl text-center'>Список дел</h1>

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
					className='input w-full text-3xl flex-auto px-8'
				/>
				<button className='btn btn-outline min-w-60'>Добавить</button>
			</form>

			{toDoList.map((el, index) => {
				return (
					<div
						key={el.id}
						className={`p-4 flex items-center gap-4 w-full rounded-lg ${
							index % 2 ? 'bg-gray-300' : ''
						}`}
					>
						<label
							htmlFor={`todo-${el.id}`}
							className='text-3xl flex items-center gap-4 flex-grow'
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
