/* eslint-disable import/prefer-default-export */

/**
 * Formats date to a corresponding string
 * YYYY - Full year, YY - Short year
 * MMMM - Full month, MMM - Short month, MM - Numeric month
 * DD - Day, hh - Hours, mm - Minutes, ss - Seconds
 * @param {string} template - Date format template string
 * @param {Date} dateObject - Date object to format
 * @param {string} locale - Locale
 * @param {string} hourCycle - h12 or h24 hour cycle
 */
import { isArabic } from "Util/App";
import {
  WEEK_ARABIC_TRANSLATION,
  MONTHS_ARABIC_TRANSLATION,
} from "../Common/index";
import {
  DEFAULT_MESSAGE,
  EDD_MESSAGE_ARABIC_TRANSLATION,
} from "../../util/Common/index";

export const formatDate = (
  template,
  dateObject,
  locale = "en-US",
  hourCycle = "h24"
) => {
  const timeMapArray = [
    template.indexOf("YYYY") >= 0
      ? { placeholder: "YYYY", type: "numeric", replace: "year" }
      : null,
    template.indexOf("YY") >= 0
      ? { placeholder: "YY", type: "2-digit", replace: "year" }
      : null,
    template.indexOf("MMMM") >= 0
      ? { placeholder: "MMMM", type: "long", replace: "month" }
      : null,
    template.indexOf("MMM") >= 0
      ? { placeholder: "MMM", type: "short", replace: "month" }
      : null,
    template.indexOf("MM") >= 0
      ? { placeholder: "MM", type: "numeric", replace: "month" }
      : null,
    template.indexOf("DD") >= 0
      ? { placeholder: "DD", type: "numeric", replace: "day" }
      : null,
    template.indexOf("hh") >= 0
      ? { placeholder: "hh", type: "numeric", replace: "hour" }
      : null,
    template.indexOf("mm") >= 0
      ? { placeholder: "mm", type: "numeric", replace: "minute" }
      : null,
    template.indexOf("ss") >= 0
      ? { placeholder: "ss", type: "numeric", replace: "second" }
      : null,
  ].filter((item) => !!item);

  return timeMapArray.reduce((finalString, { placeholder, type, replace }) => {
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      [replace]: type,
      hourCycle,
    });
    const timeValue = dateFormatter.format(dateObject);

    return finalString.replace(
      placeholder,
      timeValue.length <= 1 ? `0${timeValue}` : timeValue
    );
  }, template);
};

export const getDefaultEddDate = (days) => {
  Date.prototype.addDays = function (noOfDays) {
    let tmpDate = new Date(this.valueOf());
    tmpDate.setDate(tmpDate.getDate() + noOfDays);
    return tmpDate;
  };

  let myDate = new Date();
  const defaultEddDate = myDate.addDays(days);
  const defaultEddDateString = myDate
    .addDays(days)
    .toISOString()
    .substring(0, 10);
  const defaultEddDay = defaultEddDate.toLocaleString("en-US", {
    weekday: "short",
  });
  const defaultEddMonth = defaultEddDate.toLocaleString("en-US", {
    month: "short",
  });
  const defaultEddDat = ("0" + defaultEddDate.getDate()).slice(-2);

  return {
    defaultEddDateString,
    defaultEddDay: isArabic()
      ? WEEK_ARABIC_TRANSLATION[defaultEddDay]
      : defaultEddDay,
    defaultEddMonth: isArabic()
      ? MONTHS_ARABIC_TRANSLATION[defaultEddMonth]
      : defaultEddMonth,
    defaultEddDat,
  };
};

export const getCrossBorderDefaultEddDate = (minDays, maxDays) => {
  Date.prototype.addDays = function (noOfDays) {
    let tmpDate = new Date(this.valueOf());
    tmpDate.setDate(tmpDate.getDate() + noOfDays);
    return tmpDate;
  };

  let minDate = new Date();
  let maxDate = new Date();
  const defaultMinEddDate = minDate.addDays(minDays);
  const defaultMaxEddDate = maxDate.addDays(maxDays);
  const defaultMinEddDateString = minDate
    .addDays(minDays)
    .toISOString()
    .substring(0, 10);
  const defaultMaxEddDateString = maxDate
    .addDays(maxDays)
    .toISOString()
    .substring(0, 10);
  const defaultMinEddMonth = defaultMinEddDate.toLocaleString("en-US", {
    month: "short",
  });
  const defaultMinEddDat = ("0" + defaultMinEddDate.getDate()).slice(-2);
  const defaultMaxEddMonth = defaultMaxEddDate.toLocaleString("en-US", {
    month: "short",
  });
  const defaultMaxEddDat = ("0" + defaultMaxEddDate.getDate()).slice(-2);
  return {
    defaultMinEddDateString,
    defaultMaxEddDateString,
    defaultMinEddMonth: isArabic()
      ? MONTHS_ARABIC_TRANSLATION[defaultMinEddMonth]
      : defaultMinEddMonth,
    defaultMaxEddMonth: isArabic()
      ? MONTHS_ARABIC_TRANSLATION[defaultMaxEddMonth]
      : defaultMaxEddMonth,
    defaultMinEddDat,
    defaultMaxEddDat,
  };
};

export const getDefaultEddMessage = (
  default_day,
  default_max_day,
  cross_border
) => {
  let customDefaultMess = isArabic()
    ? EDD_MESSAGE_ARABIC_TRANSLATION[DEFAULT_MESSAGE]
    : DEFAULT_MESSAGE;
  const {
    defaultEddDateString,
    defaultEddDay,
    defaultEddMonth,
    defaultEddDat,
  } = getDefaultEddDate(default_day);
  const {
    defaultMaxEddDat,
    defaultMaxEddDateString,
    defaultMaxEddMonth,
    defaultMinEddDat,
    defaultMinEddDateString,
    defaultMinEddMonth,
  } = getCrossBorderDefaultEddDate(default_day, default_max_day);
  let defaultEddMess = "";
  let defaultEdd = "";
  if (cross_border) {
    defaultEddMess = `${customDefaultMess} ${defaultMinEddDat} ${defaultMinEddMonth} - ${defaultMaxEddDat} ${defaultMaxEddMonth}`;
    defaultEdd = defaultMaxEddDateString;
  } else {
    defaultEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
    defaultEdd = defaultEddDateString;
  }
  return { defaultEddMess, defaultEdd };
};

export const formatRefundDate = (dateStr, countryCode) => {
  if (!dateStr) return null;

  // Create a new Date object from the UTC date string
  const utcDate = new Date(dateStr);

  // Define time zone offsets for the respective country codes
  const timeZoneOffsets = {
    "ae": 4,  // UAE (Asia/Dubai) is UTC+4
    "sa": 3,  // KSA (Asia/Riyadh) is UTC+3
    "bh": 3,  // Bahrain (Asia/Bahrain) is UTC+3
    "om": 4,  // Oman (Asia/Muscat) is UTC+4
    "kw": 3,  // Kuwait (Asia/Kuwait) is UTC+3
    "qa": 3   // Qatar (Asia/Qatar) is UTC+3
  };

  // Get the offset based on the country code (default to 0 if not found)
  const offset = timeZoneOffsets[countryCode.toLowerCase()] || 0;

  // Convert UTC to local time based on the offset
  utcDate.setHours(utcDate.getHours() + offset);

  // Define an array for month names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Extract the day, month, and year from the Date object
  const day = utcDate.getUTCDate(); // Get day of the month (1-31)
  let month = monthNames[utcDate.getUTCMonth()]; // Get month name
  const year = utcDate.getUTCFullYear(); // Get full year (e.g., 2023)

  console.log("day month year ", day, month, year);

  // Translate month if needed
  month = isArabic() ? MONTHS_ARABIC_TRANSLATION[month] : month;

  // Format the date as "DD Mon YYYY"
  return `${day} ${month} ${year}`;
};

export const formatExpressDate = (dayType, countryCode) => {
  const timeZoneMap = {
    bh: 'Asia/Bahrain',   // Bahrain
    om: 'Asia/Muscat',    // Oman
    kw: 'Asia/Kuwait',    // Kuwait
    sa: 'Asia/Riyadh',    // Saudi Arabia
    qa: 'Asia/Qatar',      // Qatar
    ae: 'Asia/Dubai',      // Qatar
  };
  const timeZone = timeZoneMap[countryCode.toLowerCase()];
  
  if (!timeZone) {
    return ""; // Return an empty string if the country code is not found
  }

  const options = { timeZone: timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
  const today = new Date();
  
  // Convert current time to the specified time zone
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(today);
  
  // Create a date object from the formatted date
  const [month, day, year] = formattedDate.split('/');
  const targetDate = new Date(`${year}-${month}-${day}`);

  if (dayType?.toLowerCase() === 'tomorrow delivery') {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (dayType?.toLowerCase() === 'today delivery') {
    // No change needed
  } else {
    return "";
  }

  const yearFormatted = targetDate.getFullYear();
  const monthFormatted = String(targetDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const dayFormatted = String(targetDate.getDate()).padStart(2, '0');
  
  return `${yearFormatted}-${monthFormatted}-${dayFormatted}`;
}