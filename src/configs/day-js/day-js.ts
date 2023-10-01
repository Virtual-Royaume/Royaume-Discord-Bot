import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import objectSupport from "dayjs/plugin/objectSupport";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(objectSupport);

dayjs.tz.setDefault("Europe/Paris");

export const dayJS = dayjs;
export { Dayjs } from "dayjs";