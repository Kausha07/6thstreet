import React, { useState, useEffect, useRef } from "react";
import "./ExpressTimer.style";

export const ExpressTimer = (props) => {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const timerRef = useRef(null);

  const { todaysCutOffTime = "00:00", setTimerStateThroughProps } = props;

  const getTimeRemaining = () => {
    const now = new Date();
    const cutoffTimeParts = todaysCutOffTime?.split(":");
    const deadline = new Date();
    deadline.setHours(cutoffTimeParts?.[0]);
    deadline.setMinutes(cutoffTimeParts?.[1]);

    const time = deadline - now;
    if (time <= 0) {
      setHours("00");
      setMinutes("00");
      setIsTimeExpired(true);
      setTimerStateThroughProps(true);
      clearInterval(timerRef.current);
      return;
    }

    const Hours =
      Math.floor(time / (1000 * 60 * 60)) > 9
        ? Math.floor(time / (1000 * 60 * 60))
        : "0" + Math.floor(time / (1000 * 60 * 60));
    const Minutes =
      Math.floor((time / 1000 / 60) % 60) > 9
        ? Math.floor((time / 1000 / 60) % 60)
        : "0" + Math.floor((time / 1000 / 60) % 60);

    setHours(Hours.toString());
    setMinutes(Minutes.toString());
  };

  useEffect(() => {
    const initializeTimer = () => {
      const now = new Date();
      const cutoffTimeParts = todaysCutOffTime?.split(":");
      const deadline = new Date();
      deadline.setHours(cutoffTimeParts?.[0]);
      deadline.setMinutes(cutoffTimeParts?.[1]);

      const time = deadline - now;
      if (time > 0) {
        timerRef.current = setInterval(() => {
          getTimeRemaining();
          setIsTimeExpired(false);
          setTimerStateThroughProps(false);
        }, 1000);
      } else {
        setHours("00");
        setMinutes("00");
        setIsTimeExpired(true);
        setTimerStateThroughProps(true);
      }
    };

    initializeTimer();

    const checkMidnight = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        1,
        0
      );

      const timeUntilMidnight = midnight - now;
      setTimeout(() => {
        setIsTimeExpired(false);
        setTimerStateThroughProps(false);
        initializeTimer();
      }, timeUntilMidnight);
    };

    checkMidnight();

    return () => clearInterval(timerRef?.current);
  }, [todaysCutOffTime, isTimeExpired]);

  useEffect(() => {
    if (isTimeExpired) {
      clearInterval(timerRef?.current);
    }
  }, [isTimeExpired]);
  return (
    <>
      {!isTimeExpired && (
        <div block="EddExpressDeliveryCutOffTime">
          {__("Order within %sHrs %sMins", hours, minutes)}
        </div>
      )}
    </>
  );
};

export default ExpressTimer;
