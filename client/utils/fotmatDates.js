import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDates = (date) => {
  return dayjs(date).fromNow();
};
