import { ToDoItem } from '@/types/todoitem';
import { useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface ShowDeletePopupProps {
	showDeletePopup: boolean;
	setShowDeletePopup: (value: boolean) => void;
	itemToDelete: ToDoItem | undefined;
	toDoList: ToDoItem[];
	setToDoList: React.Dispatch<React.SetStateAction<ToDoItem[]>>;
	correctedToDoListTitle: string;
	setCorrectedToDoListTitle: (title: string) => void;
	darkTheme: boolean;
}

export default function ShowDeletePopup({
	showDeletePopup,
	setShowDeletePopup,
	itemToDelete,
	toDoList,
	setToDoList,
	correctedToDoListTitle,
	setCorrectedToDoListTitle,
	darkTheme,
}: ShowDeletePopupProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const session = useSession();

	const handleClosePopup = () => {
		setShowDeletePopup(false);
	};
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
		[session?.data, setShowDeletePopup, setToDoList]
	);

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
		<div>
			{/* Всплывающее окно удаления */}
			{showDeletePopup && (
				<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div
						className={`p-6 rounded-lg shadow-lg text-center ${
							darkTheme ? 'bg-gray-600' : 'bg-white'
						}`}
					>
						<h2 className='text-xl font-bold mb-4'>Хотите удалить/изменить запись?</h2>
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
								Сохранить
							</button>
							<button className='btn btn-outline' onClick={handleClosePopup}>
								Отмена
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
