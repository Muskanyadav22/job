import moment from "moment";

export const formatDates = (date) => {
  return moment(date).fromNow();
};
