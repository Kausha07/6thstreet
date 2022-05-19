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
    weekday: "long",
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
