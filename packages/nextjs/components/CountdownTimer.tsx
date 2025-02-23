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

    if (timeDiff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
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
    <div className="flex justify-between items-center bg-gray-900 p-3 rounded-md shadow-md w-full">
      {/* Days */}
      <div className="flex flex-col items-center w-1/4 bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 ">
        <span className="text-2xl sm:text-3xl text-green-500 font-bold">
          {String(timeLeft.days).padStart(2, "0")} 
        </span>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">DAYS</p>
      </div>
  
      {/* Hours */}
      <div className="flex flex-col items-center w-1/4 bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 ">
        <span className="text-2xl sm:text-3xl text-green-500 font-bold">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">HOURS</p>
      </div>
  
      {/* Minutes */}
      <div className="flex flex-col items-center w-1/4 bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700  ">
        <span className="text-2xl sm:text-3xl text-green-500 font-bold">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">MINS</p>
      </div>
  
      {/* Seconds */}
      <div className="flex flex-col items-center w-1/4 bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 ">
        <span className="text-2xl sm:text-3xl text-green-500 font-bold">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">SECS</p>
      </div>
    </div>
  );
  
};

export default CountdownTimer;
