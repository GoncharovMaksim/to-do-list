import { NextResponse } from 'next/server';
import connectDB from '@/configs/connectDB';
import ToDos from '@/models/ToDos';

export async function GET() {
	try {
		await connectDB();
		const toDos = await ToDos.find();
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

		// Проверяем, передано ли поле toDoItem
		if (!body.toDoItem) {
			return NextResponse.json(
				{ error: 'Поле toDoItem обязательно' },
				{ status: 400 }
			);
		}

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

		if (!userId || !toDoItem?._id) {
			return NextResponse.json(
				{ error: 'userId и toDoItem._id обязательны' },
				{ status: 400 }
			);
		}

		const updatedToDo = await ToDos.findOneAndUpdate(
			{ userId, 'toDoItem._id': toDoItem._id },
			{
				$set: {
					'toDoItem.title': toDoItem.title,
					'toDoItem.completed': toDoItem.completed,
				},
			},
			{ new: true }
		);

		if (!updatedToDo) {
			return NextResponse.json({ error: 'Задача не найдена' }, { status: 404 });
		}

		return NextResponse.json(updatedToDo);
	} catch  {
		return NextResponse.json(
			{ error: 'Ошибка при обновлении задачи' },
			{ status: 500 }
		);
	}
}

