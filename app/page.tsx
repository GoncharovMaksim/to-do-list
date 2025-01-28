'use client';
import { useState } from 'react';
import { nanoid } from 'nanoid';
interface ToDoItem {
	id: string;
	title: string;
	completed: boolean;
}

export default function Home() {
	const [toDoList, setToDoList] = useState<ToDoItem[]>([]);

	const [toDoListTitle, setToDoListTitle] = useState('');

	function addToDoItem() {
		const item: ToDoItem = {
			id: nanoid(),
			title: toDoListTitle,
			completed: false,
		};
		if (!item.title) return;

		setToDoList([...toDoList, item]);
		setToDoListTitle('');
	}

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
				className=' p-8 flex flex-col  items-center gap-4 min-w-full '
			>
				<input
					type='text'
					value={toDoListTitle}
					onChange={el => setToDoListTitle(el.target.value)}
					className='input min-w-full text-3xl flex-auto p-8'
				/>
				<button className='btn btn-outline min-w-60'>Добавить</button>
			</form>

			{toDoList.map(el => {
				return (
					<div key={el.id} className=' p-4 flex flex-wrap  items-center gap-4'>
						<label
							htmlFor={`todo-${el.id}`}
							className='text-3xl p-4 flex items-center gap-4'
						>
							<input
								type='checkbox'
								id={`todo-${el.id}`}
								checked={el.completed}
								className='checkbox'
								onChange={() => completeToDoItem(el)}
							/>
							<span className={el.completed ? 'line-through ' : ''}>
								{el.title}
							</span>
						</label>

						<button
							onClick={() => deleteToDoItem(el)}
							className='btn btn-square btn-outline'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
				);
			})}
		</div>
	);
}
