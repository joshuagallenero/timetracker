/**
 * Add two string time values (HH:mm:ss)
 *
 * @param {String} startTime  String time format
 * @param {String} endTime  String time format
 * @returns {String}
 */
export default function addDurationStrings(startTime, endTime) {
  let times = [0, 0, 0];
  const max = times.length;

  let a = (startTime || '').split(':');
  let b = (endTime || '').split(':');

  // normalize time values
  for (let i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
  }

  // store time values
  for (let i = 0; i < max; i++) {
    times[i] = a[i] + b[i];
  }

  let hours = times[0];
  let minutes = times[1];
  let seconds = times[2];

  if (seconds >= 60) {
    let m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    let h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  return (
    hours.toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
    ':' +
    minutes.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    }) +
    ':' +
    seconds.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })
  );
}
