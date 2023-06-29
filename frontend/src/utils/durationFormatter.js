export default function durationFormatter(durationString) {
  const hours = durationString.substring(0, 2);
  const minutes = durationString.substring(3, 5);
  const seconds = durationString.substring(6, 8);

  return `${hours}h ${minutes}m ${seconds}s`;
}
