import { useEffect } from 'react';

export default function Stopwatch({ time, setTime, timer, className }) {
  useEffect(() => {
    let interval;

    if (timer) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!timer) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [setTime, timer]);

  return (
    <div className={className}>
      <span>{('0' + Math.floor((time / 3600e3) % 60)).slice(-2)}:</span>
      <span>{('0' + Math.floor((time / 60e3) % 60)).slice(-2)}:</span>
      <span>{('0' + Math.floor((time / 1e3) % 60)).slice(-2)}</span>
    </div>
  );
}
