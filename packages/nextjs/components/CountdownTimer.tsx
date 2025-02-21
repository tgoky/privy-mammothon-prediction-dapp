import { useEffect, useState } from "react";

const CountdownTimer = ({ deadline, resolved, status }: { 
  deadline: Date;
  resolved: boolean;
  status: string;
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const timeDiff = new Date(deadline).getTime() - now;

    if (timeDiff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    return {
      hours: Math.floor((timeDiff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeDiff / (1000 * 60)) % 60),
      seconds: Math.floor((timeDiff / 1000) % 60),
    };
  }

  useEffect(() => {
    if (resolved || status === "in_motion") return; // Stop updating if resolved or in motion

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, resolved, status]);

  if (resolved || status === "in_motion") return null; // Don't render timer

  return (
    <div className="flex justify-center items-center gap-2 bg-gray-900 p-4 rounded-lg shadow-lg">
      <div className="text-center bg-gray-800 px-4 py-2 rounded-md shadow-md text-white text-3xl font-bold border border-gray-700 relative">
        <span className="text-green-500 drop-shadow-lg">{String(timeLeft.hours).padStart(2, "0")}</span>
        <p className="text-sm text-gray-400 absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2">HRS</p>
      </div>

      <span className="text-3xl text-green-400 font-bold">:</span>

      <div className="text-center bg-gray-800 px-4 py-2 rounded-md shadow-md text-white text-3xl font-bold border border-gray-700 relative">
        <span className="text-green-500 drop-shadow-lg">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <p className="text-sm text-gray-400 absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2">MINS</p>
      </div>

      <span className="text-3xl text-green-400 font-bold">:</span>

      <div className="text-center bg-gray-800 px-4 py-2 rounded-md shadow-md text-white text-3xl font-bold border border-gray-700 relative">
        <span className="text-green-500 drop-shadow-lg">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <p className="text-sm text-gray-400 absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2">SECS</p>
      </div>
    </div>
  );
};

export default CountdownTimer;