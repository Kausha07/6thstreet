import React, { useEffect, useState, useRef } from "react";
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import clockIcon from "./assets/clockIcon.svg";
import "./DynamicContentCountDownTimer.style";

function DynamicContentCountDownTimer(props) {
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const deadline = props.end; 
  const getTime = () => {    
    const now = new Date();
    const utcString = now.toUTCString();
    const finalendDate = deadline.toLocaleString();
    const time = Date.parse(finalendDate) - Date.parse(utcString);
    const Days = Math.floor(time / (1000 * 60 * 60 * 24)) > 9 ? Math.floor(time / (1000 * 60 * 60 * 24)) : "0" + Math.floor(time / (1000 * 60 * 60 * 24))
    const Hours = Math.floor(((time / (1000 * 60 * 60)) % 24) + (Days * 24)) > 9 ? Math.floor(((time / (1000 * 60 * 60)) % 24) + (Days * 24)) : ("0" + Math.floor((time / (1000 * 60 * 60)) % 24))
    const Minutes = Math.floor((time / 1000 / 60) % 60) > 9 ? Math.floor((time / 1000 / 60) % 60) : "0" + Math.floor((time / 1000 / 60) % 60)
    const Seconds = Math.floor((time / 1000) % 60) > 9 ? Math.floor((time / 1000) % 60) : "0" + Math.floor((time / 1000) % 60)
    setDays(Days);
    setHours(Hours);
    setMinutes(Minutes);
    setSeconds(Seconds);
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);
    return () => clearInterval(interval);
  }, []);

  const renderCountDown = () => {
    const { infoText = "", alignment="", textAlignment="", isPLPOrPDP } = props;
    const isArabicStore = isArabic();
    return (
      <h3 block={alignment === "left" ? "TimerTitle AlignLeft" : alignment === "right" ? "TimerTitle  AlignRight" : isPLPOrPDP? "TimerTitle AlignCenter PDPPLPMarginZero": "TimerTitle AlignCenter"} mods={{isArabicStore}} >
        {
          infoText && 
          <span block={textAlignment === "right_to_the_timer" ? "InfoText AlignTextRight" : textAlignment === "left_to_the_timer" ? "InfoText AlignTextLeft" : "InfoText AlignTextCenter"} mods={{isArabicStore}}>{infoText}</span>
        }
        
        <span block= {isPLPOrPDP ?"timer PLPOrPDPTimer" : "timer"}>
          {/*
            <span block="Box"><b>{days}</b>d</span> 
            <span block="separator">:</span>
          */}
          {
            isPLPOrPDP && <span block="clock"> <img src={clockIcon} alt="countDown"/></span>
          }
          <span block={ isPLPOrPDP ? "Box isPLPorPDPBox" : "Box"}><b>{hours}</b>{__("h")}</span> 
          <span block="separator">:</span>
          <span block={ isPLPOrPDP ?"Box isPLPorPDPBox" : "Box"}><b>{minutes}</b>{__("m")}</span>
          <span block="separator">:</span>
          <span block={ isPLPOrPDP ? "Box isPLPorPDPBox" : "Box"}><b>{seconds}</b>{__("s")}</span>
        </span>
      </h3>
    )
  }

  const { start, end } = props;
  const now = Date.parse(new Date().toUTCString());
  const startDay = Date.parse(start);
  const endDay = Date.parse(end);
  if (!(endDay >= startDay) || !(now <= endDay) ||  startDay >= now) {
    return null;
  }

  return (
    <div
      block="DynamicContentCountDownTimer"
      id={`DynamicContentCountDownTimer`}
    >
      {renderCountDown()}
    </div>
  );
}


export default DynamicContentCountDownTimer;
