import React, { useState, useEffect, useRef } from "react";
import { getCurrentTimeForCountry } from "Util/Common";
import { getLocaleFromUrl } from "Util/Url/Url";
import "./ExpressTimer.style";

export const ExpressTimer = (props) => {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const timerRef = useRef(null);

  const { todaysCutOffTime = "00:00", setTimerStateThroughProps } = props;

  const getTimeRemaining = () => {
    const locale = getLocaleFromUrl();
    const [lang, country] = locale && locale.split("-");
    const now = getCurrentTimeForCountry(country);
    const cutoffTimeParts = todaysCutOffTime.split(":");
    const deadline = new Date(now);
    deadline.setUTCHours(parseInt(cutoffTimeParts[0], 10));
    deadline.setUTCMinutes(parseInt(cutoffTimeParts[1], 10));

    const time = deadline - now;
    if (time <= 0) {
      setHours("00");
      setMinutes("00");
      setIsTimeExpired(true);
      setTimerStateThroughProps(true);
      clearInterval(timerRef.current);
      return;
    }

    const Hours = Math.floor(time / (1000 * 60 * 60))
      .toString()
      .padStart(2, "0");
    const Minutes = Math.floor((time / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");

    setHours(Hours);
    setMinutes(Minutes);
  };

  useEffect(() => {
    const initializeTimer = () => {
      const locale = getLocaleFromUrl();
      const [lang, country] = locale && locale.split("-");
      const now = getCurrentTimeForCountry(country);
      const cutoffTimeParts = todaysCutOffTime.split(":");
      const deadline = new Date(now);
      deadline.setUTCHours(parseInt(cutoffTimeParts[0], 10));
      deadline.setUTCMinutes(parseInt(cutoffTimeParts[1], 10));

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
      const locale = getLocaleFromUrl();
      const [lang, country] = locale && locale.split("-");
      const now = getCurrentTimeForCountry(country);
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
      {!isTimeExpired && parseInt(minutes) && parseInt(hours) ? (
        <div block="EddExpressDeliveryCutOffTime">
          {__("Order within %sHrs %sMins", hours, minutes)}
        </div>
      ) : null}
    </>
  );
};

export default ExpressTimer;
