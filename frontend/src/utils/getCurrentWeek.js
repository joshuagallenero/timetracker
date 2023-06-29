/**
 * Returns the start and end dates of the week for a given date
 *
 * @param {Date} [date=new Date()]
 * @returns {[Date, Date]}
 */
export default function getCurrentWeek(date = new Date()) {
  const first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
  const last = first + 6; // last day is the first day + 6

  const firstDayOfTheWeek = new Date(date.setDate(first));
  const lastDayOfTheWeek = new Date(date.setDate(last));

  return [firstDayOfTheWeek, lastDayOfTheWeek];
}
