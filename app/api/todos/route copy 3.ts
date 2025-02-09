import { NextResponse } from 'next/server';
import connectDB from '@/configs/connectDB';
import ToDos from '@/models/ToDos';
import bcrypt from 'bcrypt';

export async function GET(req: Request) {
	try {
		await connectDB();
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('userId');

		if (!userId) {
			return NextResponse.json({ error: 'userId обязателен' }, { status: 400 });
		}

		const toDos = await ToDos.find({ userId });
		return NextResponse.json(toDos);
	} catch {
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		await connectDB();
		const body = await req.json();

		if (!body.toDoItem) {
			return NextResponse.json(
				{ error: 'Поле toDoItem обязательно' },
				{ status: 400 }
			);
		}

		// Хешируем название задачи перед сохранением
		const salt = await bcrypt.genSalt(10);
		const hashedTitle = await bcrypt.hash(body.toDoItem.title, salt);
		body.toDoItem.title = hashedTitle;

		const newToDos = new ToDos(body);
		await newToDos.save();
		return NextResponse.json(newToDos, { status: 201 });
	} catch {
		return NextResponse.json(
			{ error: 'Ошибка при создании задачи' },
			{ status: 500 }
		);
	}
}

export async function PUT(req: Request) {
	try {
		await connectDB();
		const { userId, toDoItem } = await req.json();

		if (!userId || !toDoItem?.id || !toDoItem.title) {
			return NextResponse.json(
				{ error: 'userId и toDoItem.id обязательны' },
				{ status: 400 }
			);
		}

		// Находим старую задачу
		const existingToDo = await ToDos.findOne({
			userId,
			'toDoItem.id': toDoItem.id,
		});

		if (!existingToDo) {
			return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 });
		}

		// Проверяем, изменилось ли название
		const isSameTitle = await bcrypt.compare(
			toDoItem.title,
			existingToDo.toDoItem.title
		);
		if (isSameTitle) {
			return NextResponse.json(
				{ error: 'Новое название совпадает со старым' },
				{ status: 400 }
			);
		}

		// Шифруем новое название перед сохранением
		const salt = await bcrypt.genSalt(10);
		const hashedTitle = await bcrypt.hash(toDoItem.title, salt);

		const updatedToDo = await ToDos.findOneAndUpdate(
			{ userId, 'toDoItem.id': toDoItem.id },
			{
				$set: {
					'toDoItem.title': hashedTitle,
					'toDoItem.completed': toDoItem.completed,
				},
			},
			{ new: true }
		);

		return NextResponse.json(updatedToDo);
	} catch {
		return NextResponse.json(
			{ error: 'Ошибка при обновлении задачи' },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: Request) {
	try {
		await connectDB();
		const { userId, toDoItem } = await req.json();

		if (!userId || !toDoItem?.id) {
			return NextResponse.json(
				{ error: 'userId и toDoItem.id обязательны' },
				{ status: 400 }
			);
		}

		const deletedToDo = await ToDos.findOneAndDelete({
			userId,
			'toDoItem.id': toDoItem.id,
		});

		if (!deletedToDo) {
			return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Задача удалена' });
	} catch {
		return NextResponse.json(
			{ error: 'Ошибка при удалении задачи' },
			{ status: 500 }
		);
	}
}
