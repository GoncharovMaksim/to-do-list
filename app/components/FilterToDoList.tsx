interface FilterToDoListProps {
  isCompleted: boolean;
  setIsCompleted: (value: boolean) => void;
  filterOn: boolean;
  setFilterOn: (value: boolean) => void;
}

export default function FilterToDoList({isCompleted, setIsCompleted, filterOn, setFilterOn }: FilterToDoListProps) {
	
	return (
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
	);
}