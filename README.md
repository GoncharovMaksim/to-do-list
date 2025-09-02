## To‑Do List (Next.js + TypeScript)

Простое ToDo‑приложение (Mindbox test‑style) на Next.js 15, TypeScript и React Hooks. Поддерживает локальное хранение и синхронизацию с сервером при входе пользователя (NextAuth + MongoDB/Mongoose). Готово к деплою на Vercel и покрыто базовыми тестами (Vitest + Testing Library).

### Функциональность

- Поле ввода для новых задач (Enter/кнопка «Добавить»)
- Списки задач: Все, Сделано, Не сделано (переключатели)
- Количество оставшихся задач (невыполненных)
- Редактирование и удаление задачи (всплывающее окно)
- Переключение выполненности чекбоксом, зачёркнутый стиль для выполненных
- Темная тема (переключатель, сохранение в localStorage)
- Локальное хранение задач (без сессии) и серверная синхронизация (при сессии)

### Технологии

- Next.js 15 (App Router), TypeScript, React 19
- Auth: NextAuth (Google + Credentials)
- База: MongoDB/Mongoose
- UI: TailwindCSS + DaisyUI
- Тесты: Vitest + @testing-library/react + jsdom

### Быстрый старт

```bash
npm i
npm run start # соберёт и запустит прод-сервер
# для разработки
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

### Тесты

```bash
npm run test       # одноразовый прогон
npm run test:watch # запуск в watch-режиме
```

### Переменные окружения

Для серверных функций и NextAuth используйте переменные окружения:

```
MONGO_DB=<строка подключения MongoDB>
NEXTAUTH_URL=<https://your-deployment-url>
NEXTAUTH_SECRET=<случайная_строка>
GOOGLE_CLIENT_ID=<из консоли Google>
GOOGLE_SECRET=<из консоли Google>
```

### Структура проекта (важное)

- `app/page.tsx` — главная страница (список дел, ввод, фильтры, счётчик)
- `app/components/FilterToDoList.tsx` — переключатели фильтров (Все/Сделано/Не сделано)
- `app/components/ShowDeletePopup.tsx` — удаление/редактирование записи
- `app/api/todos/route.ts` — API для CRUD задач (MongoDB)
- `configs/auth.ts` — конфигурация NextAuth и коллбэки
- `models/*.ts` — схемы Mongoose (`User`, `ToDos`)
- `types/*.d.ts` — типы `ToDoItem`, `ToDos`, расширение `next-auth`
- `tests/page.test.tsx` — базовые компонентные тесты

### API

- `GET /api/todos?userId=...` — получить список задач пользователя
- `POST /api/todos` — создать задачу `{ userId, toDoItem }`
- `PUT /api/todos` — обновить задачу `{ userId, toDoItem }`
- `DELETE /api/todos` — удалить задачу `{ userId, toDoItem }`

Ответы — JSON; ошибки — с кодами 4xx/5xx.

### Деплой

- Рекомендуется Vercel. Настройте переменные окружения (см. выше) в проекте Vercel.
- Убедитесь, что подключение к MongoDB доступно из облака.

### Примечания

- При отсутствии сессии задачи хранятся в `localStorage`.
- При наличии сессии — выполняется синхронизация с MongoDB.
- Есть базовые заголовки безопасности и настройка домена изображений в `next.config.ts`.
