import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { utcTimestampToDate } from "./date";

dayjs.extend(utc);
dayjs.extend(duration);

export const formatDateToMonthDay = (timestamp: number): string => {
	return dayjs(utcTimestampToDate(timestamp)).format("D MMMM ");
};

export const formatFullDateTime = (timestamp: number): string => {
	return dayjs(utcTimestampToDate(timestamp)).format("DD MMMM YYYY HH:mm:ss");
};

export const durationDate = (time_start: number, time_end: number): string => {
	const duration = dayjs.duration(time_end - time_start, "seconds");

	const days = duration.days();
	const hours = duration.hours();
	const minutes = duration.minutes();

	const daysString = days > 0 ? `${days}d ` : "";
	const hoursString = hours > 0 ? `${hours}h ` : "";
	const minutesString = minutes > 0 ? `${minutes}min` : "";

	return `${daysString}${hoursString}${minutesString}`.trim();
};
