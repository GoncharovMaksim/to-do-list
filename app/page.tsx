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
	// console.log(nanoid(), uuidv4());
	function addToDoItem() {
		const item: ToDoItem = {
			id: nanoid(),
			title: toDoListTitle,
			completed: false,
		};
		setToDoList([...toDoList, item]);
		setToDoListTitle('');
		
	}

function deleteToDoItem(item:ToDoItem){
const deletedItem = toDoList.filter(el => el.id !== item.id);
setToDoList(deletedItem);
};







	return (
		<div className='container mx-auto p-4 flex flex-col items-center gap-4'>
			<h1 className='text-4xl'>Список дел</h1>

			<form
				onSubmit={e => {
					addToDoItem();
					e.preventDefault();
				}}
				action=''
				className=' p-4 flex  items-center gap-4'
			>
				<input
					type='text'
					value={toDoListTitle}
					onChange={el => setToDoListTitle(el.target.value)}
					className='input'
				/>
				<button className='btn btn-outline '>
					Добавить
				</button>
			</form>




			{toDoList.map(el => {
				return (
					<label
						key={el.id}
						htmlFor={`todo-${el.id}`}
						className='text-3xl p-4 flex  items-center gap-4'
					>
						<input
							type='checkbox'
							id={el.id}
							defaultChecked
							className='checkbox'
						/>
						<span className='line-through'>{el.title}</span>
						<button onClick={()=>deleteToDoItem(el)}className='btn btn-square btn-outline'>
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
					</label>
				);
			})}
		
		</div>
	);
}
