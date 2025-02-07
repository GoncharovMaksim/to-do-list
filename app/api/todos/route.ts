// pages/api/MathStatistics/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/configs/connectDB';
import ToDos from '@/models/ToDos';

export async function GET() {
	await connectDB();
	const toDos = await ToDos.find();
	return NextResponse.json(toDos);
}

export async function POST(req: Request) {
	await connectDB();
	const body = await req.json();
	const newToDos = new ToDos(body);
	await newToDos.save();
	return NextResponse.json(newToDos, { status: 201 });
}
