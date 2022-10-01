import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import UpdateLocale from "dayjs/plugin/updateLocale.js";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Paris");

dayjs.extend(UpdateLocale);
dayjs.updateLocale("en", {
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]
});

const DayJS = dayjs;

export default DayJS;