import { useEffect, useState } from 'react';

const Timer = ({ duration = 600, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 60;

  return (
    <div className={`text-center p-4 rounded-lg ${isWarning ? 'bg-red-100' : 'bg-blue-100'}`}>
      <p className={`text-2xl font-bold ${isWarning ? 'text-red-600' : 'text-blue-600'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
      <p className={`text-sm ${isWarning ? 'text-red-500' : 'text-blue-500'}`}>
        Time Remaining
      </p>
    </div>
  );
};

export default Timer;
