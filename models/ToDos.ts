import mongoose from 'mongoose';

const ToDoItemSchema = new mongoose.Schema(
	{
		id: { type: String, required: true },
		title: { type: String, required: true },
		completed: { type: Boolean, required: true },
	},
	{ _id: true }
);

// Основная схема
const ToDosSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		toDoItem: { type: ToDoItemSchema, required: true },
	},
	{ timestamps: true }
);

// Экспортируем модель
const ToDos = mongoose.models.ToDos || mongoose.model('ToDos', ToDosSchema);

export default ToDos;
