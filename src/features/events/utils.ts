// src/features/events/utils.ts

export const formatDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const getDateRangeFromPeriod = (period: string | null) => {
	const now = new Date();

	switch (period) {
		case "nearest": {
			const endDate = new Date(now);
			endDate.setMonth(endDate.getMonth() + 3);
			return {
				startDate: formatDate(now),
				endDate: formatDate(endDate),
			};
		}

		case "current_week": {
			const startDate = new Date(now);
			const currentDay = startDate.getDay();
			const diff =
				startDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
			startDate.setDate(diff);

			const endDate = new Date(startDate);
			endDate.setDate(endDate.getDate() + 6);

			return {
				startDate: formatDate(startDate),
				endDate: formatDate(endDate),
			};
		}

		case "next_month": {
			const startDate = new Date(now);
			startDate.setDate(1);
			startDate.setMonth(startDate.getMonth() + 1);

			const endDate = new Date(startDate);
			endDate.setMonth(endDate.getMonth() + 1);
			endDate.setDate(0);

			return {
				startDate: formatDate(startDate),
				endDate: formatDate(endDate),
			};
		}

		case "quarter": {
			const startDate = new Date(now);
			startDate.setMonth(Math.floor(startDate.getMonth() / 3) * 3);
			startDate.setDate(1);

			const endDate = new Date(startDate);
			endDate.setMonth(endDate.getMonth() + 3);
			endDate.setDate(0);

			return {
				startDate: formatDate(startDate),
				endDate: formatDate(endDate),
			};
		}

		case "half_year": {
			const startDate = new Date(now);
			startDate.setMonth(Math.floor(startDate.getMonth() / 6) * 6);
			startDate.setDate(1);

			const endDate = new Date(startDate);
			endDate.setMonth(endDate.getMonth() + 6);
			endDate.setDate(0);

			return {
				startDate: formatDate(startDate),
				endDate: formatDate(endDate),
			};
		}

		default:
			return { startDate: null, endDate: null };
	}
};
