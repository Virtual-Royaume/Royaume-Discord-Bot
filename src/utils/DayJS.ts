import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import UpdateLocale from "dayjs/plugin/updateLocale.js";
import fr from "dayjs/locale/fr.js";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Paris");

dayjs.extend(UpdateLocale);
dayjs.locale(fr);

const DayJS = dayjs;

export default DayJS;