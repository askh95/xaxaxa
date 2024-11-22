// src/features/events/constants.ts

export const SPORTS_TYPES = [
	"Баскетбол",
	"Плавание",
	"Футбол",
	"Волейбол",
	"Легкая атлетика",
	"Гимнастика",
	"Теннис",
	"Хоккей",
] as const;

export type SportType = (typeof SPORTS_TYPES)[number];

export const DISCIPLINES: Record<SportType, readonly string[]> = {
	Баскетбол: ["3х3", "5х5"],
	Плавание: ["Вольный стиль", "Брасс", "Баттерфляй", "Комплексное плавание"],
	Футбол: ["11х11", "Мини-футбол", "Пляжный футбол"],
	Волейбол: ["Классический", "Пляжный"],
	"Легкая атлетика": ["Бег", "Прыжки", "Метание", "Многоборье"],
	Гимнастика: ["Спортивная", "Художественная", "Акробатическая"],
	Теннис: ["Одиночный", "Парный", "Смешанный"],
	Хоккей: ["Классический", "На траве"],
} as const;

export const COMPETITION_TYPES = [
	"Межрегиональные",
	"Окружные",
	"Кубок",
	"Чемпионат",
	"Первенство",
	"Спартакиада",
	"Турнир",
] as const;

export const TIME_FRAMES = [
	{ value: "nearest", label: "Ближайшие мероприятия" },
	{ value: "current_week", label: "Текущая неделя" },
	{ value: "next_month", label: "Следующий месяц" },
	{ value: "quarter", label: "Квартал" },
	{ value: "half_year", label: "Полугодие" },
] as const;
