import { Card, CardBody } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialMinutes: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Daqiqani sekundga aylantiramiz

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer); // Tozalanish
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mt-5 justify-center">
        <Card>
          <CardBody>{formatTime(timeLeft)}</CardBody>
        </Card>
      </div>
    </div>
  );
};
