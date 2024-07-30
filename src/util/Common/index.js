/* eslint-disable no-magic-numbers */
import cardValidator from "card-validator";
import { isArabic } from "Util/App";

export const CONST_TEN = 10;

export const CONST_HUNDRED = 100;

export const DEFAULT_MAX_PRODUCTS = 10;

export const appendOrdinalSuffix = (number) => {
  const mod10x = number % CONST_TEN;
  const mod100x = number % CONST_HUNDRED;

  if (mod10x === 1 && mod100x !== 11) {
    return `${number}st`;
  }

  if (mod10x === 2 && mod100x !== 12) {
    return `${number}nd`;
  }

  if (mod10x === 3 && mod100x !== 13) {
    return `${number}rd`;
  }

  return `${number}th`;
};

export const INTL_BRAND = isArabic()
  ? ["ترينديول", "كوتون"]
  : ["trendyol", "koton"];
export const INTL_BRAND_ARABIC = ["ترينديول", "كوتون"];

export const YES = "Yes"

export const YES_IN_ARABIC = "نعم"

export const NO = "No"

export const NO_IN_ARABIC = "لا"

export const DEFAULT_MESSAGE = "Delivery by";

export const DEFAULT_ARRIVING_MESSAGE = "Arriving by";

export const DEFAULT_READY_MESSAGE = "Ready by";

export const DEFAULT_SPLIT_KEY = isArabic() ? "بواسطه" : "by";

export const DEFAULT_READY_SPLIT_KEY = isArabic() ? "جاهز في غضون" : "Ready by";

export const EDD_MESSAGE_ARABIC_TRANSLATION = {
  "Delivery by": "التوصيل بواسطه",
  "Arriving by": "الوصول بواسطه",
  "Ready by": "جاهز في غضون"
};

export const TRENDING_BRANDS_ENG = "Trending brands";
export const TRENDING_BRANDS_AR = "العلامات التجارية الأكثر رواجاً";

export const SPECIAL_COLORS = {
  beige: "#f5f5dc",
  clear: "#ffffff",
  cream: "#ffe4b5",
  metallic: "#cdb5cd",
  multi: "#000000",
  nude: "#faebd7",
  opaque_color: "#FBFBFB",
  gray400: "#222222",
  darkGray: "#333333",
  lightGray: "#f9f9f9",
  pureWhite: "#FFFFFF",
  offWhite: "#f7f7f7",
  lightOrange: "#cb9f7f",
  ltPink: "#F4E3E0",
  pinkTransparent: "rgba(255, 161, 155, .8)",
  altGrey: "#554C4C",
  fadedGrey: "rgba(85, 76, 76, 0.45)",
  fadedBlack: "#434343",
  doubleDarkPink: "#7E7070",
  silver: "#CAC0C0",
  silver2: "#BFBBBB",
  silver3: "#D1D3D4",
  ltPink2: "#C0BBBB",
  salmon: "#FA8072",
  pinkLine: "#ECE5E5",
  pinkText: "#D6817B",
  pinkBg: "#FDF0EF",
  lightPinkText: "#BDB3B3",
  separator: "#ECE5E5",
  inActiveLightPink: "#ECE5E5",
  dkBlack: "#000000",
  coffee: "#D0C8C8",
  boulder: "#7C7676",
  mercury: "#E4E4E4",
  cararra: "#FAFAF8",
  spring_wood: "#FAFAF8",
  spring_wood2: "#FBFAF8",
  chambray: "#3C5193",
  corn_blue: "#4285F4",
  white_linen: "#FBF0EF",
  contessa: "#CB857E",
  desertStorm: "#EDEDEA",
  silver_chalice: "#AEA9A9",
  green: "#81BE4A",
  pink_red: "#FF918D",
  categoriesGrey: "#F3F3F3",
  yuma: "#C8B581",
  nobel: "#9B9B9B",
  fire_red: "#D12229",
  charcoal: "#4A4A4A",
  zumthor: "#D1D3D4",
  white_smoke: "#EFEFEF",
  snow: "#F9F9F9",
  alto: "#D6D6D6",
  white: "#ffffff",
  black: "#000000",
  black2: "#4A4A4A",
  black3: "#555",
  black4: "#282828",
  transparent_black: "rgba(0,0,0,0.7)",
  red: "#D12229",
  red2: "#ff3232",
  red3: "#FF0029",
  red4: "#F01136",
  pink: "#FFA19B",
  pink2: "#F4E3E0",
  gray: "#F5F5F5",
  gray2: "#D1D3D4",
  gray3: "#CCCCCC",
  gray4: "#EFEFEF",
  gray5: "#9B9B9B",
  gray6: "#F9F9F9",
  gray7: "#D8D8D8",
  gray8: "#F3F4F6",
  grey9: "#F0F0F0",
  gray10: "#ECECEC",
  orange: "#F96446",
  gold: "#C8B581",
  shamrock: "#28D9AA",
  thunder: "#231F20",
  alabaster: "#F8F8F8",
  turquoise: "#3EEDBF",
  sorell_brown: "#CCBA8A",
  wildSand: "#F6F6F6",
  resolutionBlue: "#042295",
  brightTurquoise: "#20EFBE",
  lavenderBlush: "#FFF9FA",
  peach: "#FF7355",
  blush: "#FFC0B2",
  light_pink: "#F4E3E0",
};

export const WEEK_ARABIC_TRANSLATION = {
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
};

export const MONTHS_ARABIC_TRANSLATION = {
  Jan: "يناير",
  Feb: "فبراير",
  Mar: "مارس",
  Apr: "أبريل",
  May: "مايو",
  Jun: "يونيو",
  Jul: "يوليو",
  Aug: "أغسطس",
  Sep: "سبتمبر",
  Oct: "أكتوبر",
  Nov: "نوفمبر",
  Dec: "ديسمبر",
};

export const translateArabicColor = (color = "") => {
  switch (color) {
    case "أسود": {
      return "black";
    }
    case "أزرق": {
      return "blue";
    }
    case "أبيض": {
      return "white";
    }
    case "وردي": {
      return "pink";
    }
    case "بني": {
      return "brown";
    }
    case "أحمر": {
      return "red";
    }
    case "متعدد": {
      return "multi";
    }
    case "أخضر": {
      return "green";
    }
    case "معدني": {
      return "metallic";
    }
    case "ذهبي": {
      return "gold";
    }
    case "بنفسجي": {
      return "purple";
    }
    case "أصفر": {
      return "yellow";
    }
    case "برتقالي": {
      return "orange";
    }
    case "فضي": {
      return "silver";
    }
    case "بيج": {
      return "beige";
    }
    case "طبيعي": {
      return "natural";
    }
    case "كحلي": {
      return "dark_blue";
    }
    case "Cream": {
      return "cream";
    }
    case "ذهبي وردي": {
      return "rose_gold";
    }
    case "خوخي": {
      return "peach";
    }
    case "رمادي داكن": {
      return "taupe";
    }
    case "أوف وايت": {
      return "off_white";
    }
    case "عنابي": {
      return "burgundy";
    }
    case "بني داكن": {
      return "dark_brown";
    }
    case "زيتوني": {
      return "olive";
    }
    case "وردي فاتح": {
      return "light_pink";
    }
    case "عاجي": {
      return "ivory";
    }
    case "كاكي": {
      return "khaki";
    }
    case "برونزي": {
      return "bronze";
    }
    case "رصاصي": {
      return "grey";
    }
    case "جلد الجمل": {
      return "camel";
    }
    case "جلد الفهد": {
      return "leopard";
    }
    case "بني فاتح": {
      return "light_brown";
    }
    case "ماروني": {
      return "maroon";
    }
    case "فيروزي": {
      return "turquoise";
    }
    case "رمادي فاتح": {
      return "light_grey";
    }
    case "شفاف": {
      return "transparent";
    }
    case "بني محمر": {
      return "edocha";
    }
    case "لحمي": {
      return "neutral";
    }
    case "حنطي": {
      return "tan";
    }
    case "بني مائل للأصفر": {
      return "camel";
    }
    case "أزرق مائي":
    case "أزرق فاتح": {
      return "light_blue";
    }
    case "gray":
    case "رمادي": {
      return "grey";
    }
    case "Black / White": {
      return "black_white";
    }
    case "Ivory": {
      return "عاجي";
    }
    case "Fuchsia": {
      return "فوشي";
    }
    case "Magenta": {
      return "ماجنتي";
    }
    case "Rose": {
      return "زهري";
    }
    case "Mauve": {
      return "موف";
    }
    case "عاجي": {
      return "Ivory";
    }
    case "Mint": {
      return "النعناع";
    }
    case "Navy Blue": {
      return "الأزرق الداك";
    }
    case "Sand": {
      return "رملي";
    }
    case "Teal": {
      return "موف";
    }
    case "Transparent": {
      return "شفاف";
    }
    case "Wine": {
      return "نبيذي";
    }
    case "Coral": {
      return "مرجاني";
    }
    case "Khaki": {
      return "كاكي";
    }
    case "Light Honey": {
      return "عسلي فاتح";
    }
    case "Fancy Rose": {
      return "فانسي روز";
    }
    case "Naughty Mauve": {
      return "نوتي موف";
    }
    case "Pretty Kiss": {
      return "بريتي كيس";
    }
    case "Stay Currant": {
      return "ستاي كرانت";
    }
    case "Ultimate Wine": {
      return "التيميت واين";
    }
    case "Chocolate": {
      return "شوكولاتة";
    }
    case "Multicolour": {
      return "متعدد الألوان";
    }
    case "Raspberry": {
      return "توت";
    }
    case "Addiction": {
      return "اديكشن";
    }
    case "Almond": {
      return "ألموند";
    }
    case "Berry": {
      return "كرزي";
    }
    case "Caramel": {
      return "كارميل";
    }
    case "Everlasting Rum": {
      return "ايفر لاستينغ رم";
    }
    case "Fancy Rose": {
      return "فانسي روز";
    }
    case "Forever Scarlet": {
      return "فوريفر سكارليت";
    }
    case "Heather": {
      return "هيثر";
    }
    case "Leopard": {
      return "فهد";
    }
    case "Light": {
      return "فاتح";
    }
    case "Mahogany": {
      return "ماهوغني";
    }
    case "Passion": {
      return "باشون";
    }
    case "Pink Sapphire": {
      return "سفير وردي";
    }
    case "Plum": {
      return "برقوقي";
    }
    case "Porcelain": {
      return "بورسلان";
    }
    case "Twilight": {
      return "تويلايت";
    }
    case "Lightbeige": {
      return "بيج فاتح";
    }

    default: {
      // eslint-disable-next-line no-undef
      const color_code = color.toLowerCase().replace(" ", "_");

      if (color_code.includes("beige")) {
        return "beige";
      }
      if (color_code.includes("mauve")) {
        return "mauve";
      }
      if (color_code.includes("rum")) {
        return "rum";
      }
      if (color_code.includes("raspberry")) {
        return "raspberry";
      }
      if (color_code.includes("honey")) {
        return "honey";
      }

      return color_code;
    }
  }
};

const MADA_BINS = new Set([
  "588845",
  "440647",
  "440795",
  "446404",
  "457865",
  "968208",
  "588846",
  "493428",
  "539931",
  "558848",
  "557606",
  "968210",
  "636120",
  "417633",
  "468540",
  "468541",
  "468542",
  "468543",
  "968201",
  "446393",
  "588847",
  "400861",
  "409201",
  "458456",
  "484783",
  "968205",
  "462220",
  "455708",
  "588848",
  "455036",
  "968203",
  "486094",
  "486095",
  "486096",
  "504300",
  "440533",
  "489317",
  "489318",
  "489319",
  "445564",
  "968211",
  "401757",
  "410685",
  "432328",
  "428671",
  "428672",
  "428673",
  "968206",
  "446672",
  "543357",
  "434107",
  "431361",
  "604906",
  "521076",
  "588850",
  "968202",
  "535825",
  "529415",
  "543085",
  "524130",
  "554180",
  "549760",
  "588849",
  "968209",
  "524514",
  "529741",
  "537767",
  "535989",
  "536023",
  "513213",
  "585265",
  "588983",
  "588982",
  "589005",
  "508160",
  "531095",
  "530906",
  "532013",
  "588851",
  "605141",
  "968204",
  "422817",
  "422818",
  "422819",
  "428331",
  "483010",
  "483011",
  "483012",
  "589206",
  "968207",
  "419593",
  "439954",
  "407197",
  "407395",
  "520058",
  "530060",
  "531196",
]);

export const getCardType = (cardNumber = "") => {
  try {
    const bin = cardNumber.replace(/\s?/g, "").substr(0, 6);
    if (MADA_BINS.has(bin)) {
      return {
        type: "mada",
        niceType: "Mada",
      };
    }

    const { card } = cardValidator.number(cardNumber);
    return {
      type: card.type,
      niceType: card.niceType,
    };
  } catch (err) {
    return {
      type: "",
      niceType: "",
    };
  }
};

export const camelCase = (str) => {
  return str.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const getBambuserChannelID=(country)=>{
  switch (country) {
    case "ae":
      return process.env.REACT_APP_BAMBUSER_CHANNEL_ID_AE;
    case "sa":
      return process.env.REACT_APP_BAMBUSER_CHANNEL_ID_SA;
    case "kw":
      return process.env.REACT_APP_BAMBUSER_CHANNEL_ID_KW;
    case "om":
      return process.env.REACT_APP_BAMBUSER_CHANNEL_ID_OM;
    case "bh":
      return process.env.REACT_APP_BAMBUSER_CHANNEL_ID_BH;
    case "qa":
      return process.env.REACT_APP_BAMBUSER_CHANNEL_ID_QA;
    default:
      return process.env.REACT_APP_BAMBUSER_CHANNEL_ID_AE;
  }
}

export const DecimalCountries = ["KW", 'OM', 'BH'];

export const getEnvIDForInfluencer = () => {
  if (process.env.REACT_APP_INFLUENCER_ENV === "production") {
    return "20190121";
  } else {
    return "20191010_staging";
  }
};

export const exchangeFormatGroupStatus = (status) => {
  // use toLowerCase because sometimes the response from backend is not consistent
  switch (status?.toLowerCase()) {
    case "pickup_failed": {
      return __("Failed");
    }
    case "cancelled": {
      return __("Cancelled");
    }
    case "autocancel": {
      return __("Cancelled");
    }
    case "canceled": {
      return __("Cancelled");
    }
    case "delivery_failed": {
      return __("Failed");
    }
    case "pickupfailed": {
      return __("Failed");
    }
    case "exchange_failed": {
      return __("Failed");
    }
    default: {
      return null;
    }
  }
};

export const getShippingFees = (country) => {
  switch (country) {
    case "ae":
      return 20;
    case "sa":
      return 20;
    case "kw":
      return 3;
    case "om":
      return 3;
    case "bh":
      return 3;
    case "qa":
      return 20;
    default:
      return 20;
  }
};

export function formatDate(inputDate) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const parts = inputDate.split('-');
  const day = parts[2];
  const month = months[parseInt(parts[1]) - 1];
  const year = parts[0];

  return `${day} ${month} ${year}`;
}

export const getTodaysWeekDay = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const currentDayIndex = today.getDay();
  const currentDayName = daysOfWeek[currentDayIndex];

  return currentDayName?.toLowerCase();
};

export const getAddressType = (addressType) => {
  const currentSelectedAddress = addressType
    ? addressType
    : JSON.parse(localStorage.getItem("currentSelectedAddress")) || {};
  switch (currentSelectedAddress?.mailing_address_type) {
    case "37303":
      return "home";
    case "37304":
      return "work";
    case "37305":
      return "other";
    default:
      return "home";
  }
};

export const getCurrentTimeForCountry = (countryCode) => {
  const now = new Date();
  switch (countryCode) {
    case "ae":
      now.setUTCHours(now.getUTCHours() + 4); // Example: UTC+4 for UAE
      break;
    case "sa":
      now.setUTCHours(now.getUTCHours() + 3); // Example: UTC+3 for KSA
      break;
    case "qa":
      now.setUTCHours(now.getUTCHours() + 3); // Example: UTC+3 for Qatar
      break;
    case "kw":
      now.setUTCHours(now.getUTCHours() + 3); // Example: UTC+3 for Kuwait
      break;
    case "om":
      now.setUTCHours(now.getUTCHours() + 4); // Example: UTC+4 for Oman
      break;
    case "bh":
      now.setUTCHours(now.getUTCHours() + 3); // Example: UTC+3 for Bahrain
      break;
    default:
      now.setUTCHours(now.getUTCHours() + 4); // Example: UTC+4 for UAE
      break;
  }
  return now;
};

export const getNumericAddressType = () => {
  const addressType =
    JSON.parse(localStorage.getItem("currentSelectedAddress"))
      ?.mailing_address_type || "37303";
  return addressType;
};

export const checkProductOfficeServicable = ({
  addressType = "37303",
  isOfficeSameDayExpressServicable = true,
  isOfficeNextDayExpressServicable = true,
  isTimeExpired = false,
  express_delivery_key = "",
}) => {
  if (addressType === "37304") {
    if (
      isOfficeSameDayExpressServicable &&
      !isOfficeNextDayExpressServicable &&
      isTimeExpired
    ) {
      return false;
    } else if (
      !isOfficeSameDayExpressServicable &&
      !isOfficeNextDayExpressServicable
    ) {
      return false;
    } else if (
      !isOfficeSameDayExpressServicable &&
      isOfficeNextDayExpressServicable &&
      isTimeExpired
    ) {
      return true;
    } else if (
      isOfficeSameDayExpressServicable &&
      !isOfficeNextDayExpressServicable &&
      express_delivery_key?.toLowerCase()?.includes("tomorrow")
    ) {
      return false;
    }
  }
  return true;
};

export const inventoryCheck = (quantity, cutoffTime) => {
  return +quantity !== 0 ? cutoffTime : "00:00";
};

export const checkProductExpressEligible = (express_delivery_key) => {
  return ["today delivery", "tomorrow delivery"].includes?.(
    express_delivery_key?.toLowerCase()
  );
};

export const getTodaysCutOffTime = ({
  cutOffTime = {},
  isPDP = false,
  simple_products = {},
  selectedSizeCode = "",
  express_delivery_key = "",
  whs_quantity = 0,
  store_quantity = 0,
  mp_quantity = 0,
}) => {
  let tempTodaysCutOffTime = "00:00";
  const todaysWeekDayName = getTodaysWeekDay();
  const addressType = getNumericAddressType();

  const data =
    cutOffTime?.data?.find((item) => {
      return (
        item.day?.toLowerCase() === todaysWeekDayName &&
        item?.address_type === addressType
      );
    }) || {};

  const {
    warehouse_cutoff_time = "00:00",
    store_cutoff_time = "00:00",
    mp_cutoff_time = "00:00",
  } = data;

  tempTodaysCutOffTime =
    isPDP && selectedSizeCode
      ? (+simple_products?.[selectedSizeCode]?.whs_quantity != 0 &&
          inventoryCheck(
            simple_products?.[selectedSizeCode]?.whs_quantity,
            warehouse_cutoff_time
          )) ||
        (+simple_products?.[selectedSizeCode]?.store_quantity != 0 &&
          inventoryCheck(
            simple_products?.[selectedSizeCode]?.store_quantity,
            store_cutoff_time
          )) ||
        (+simple_products?.[selectedSizeCode]?.mp_quantity != 0 &&
          inventoryCheck(
            simple_products?.[selectedSizeCode]?.mp_quantity,
            mp_cutoff_time
          ))
      : (+whs_quantity != 0 &&
          inventoryCheck(whs_quantity, warehouse_cutoff_time)) ||
        (+store_quantity != 0 &&
          inventoryCheck(store_quantity, store_cutoff_time)) ||
        (+mp_quantity != 0 && inventoryCheck(mp_quantity, mp_cutoff_time));

  if (
    !tempTodaysCutOffTime &&
    !selectedSizeCode &&
    express_delivery_key?.toLowerCase()?.includes("today")
  ) {
    let {
      whs = false,
      store = false,
      mp = false,
    } = knowInventoryOnPageLoad(simple_products);

    tempTodaysCutOffTime = whs
      ? warehouse_cutoff_time
      : store
      ? store_cutoff_time
      : mp
      ? mp_cutoff_time
      : "00:00";
  }

  return tempTodaysCutOffTime || "00:00";
};

export const getFinalExpressDeliveryKey = ({
  isPDP = false,
  express_delivery_home = "",
  express_delivery_work = "",
  express_delivery_other = "",
  express_delivery = "",
}) => {
  const addressType = getNumericAddressType();
  if (isPDP) {
    if (addressType === "37303") {
      return express_delivery_home;
    } else if (addressType === "37304") {
      return express_delivery_work;
    } else if (addressType === "37305") {
      return express_delivery_other;
    } else return express_delivery_home;
  } else {
    return express_delivery;
  }
};

export const productOfficeServicable = ({
  cutOffTime = {},
  express_delivery_key = "",
  isTimeExpired = false,
}) => {
  const addressType = getNumericAddressType();
  const todaysWeekDayName = getTodaysWeekDay()?.toLowerCase() || "";
  const isProductExpressEligible =
    checkProductExpressEligible(express_delivery_key);

  let isOfficeSameDayExpressServicable = true;
  let isOfficeNextDayExpressServicable = true;
  let isProductOfficeServicable = true;

  if (
    cutOffTime?.data &&
    todaysWeekDayName &&
    addressType &&
    isProductExpressEligible
  ) {
    if (
      addressType === "37304" &&
      ["friday", "saturday", "sunday"].includes?.(
        todaysWeekDayName?.toLowerCase()
      )
    ) {
      switch (todaysWeekDayName?.toLowerCase()) {
        case "friday":
          isOfficeSameDayExpressServicable = true;
          isOfficeNextDayExpressServicable = false;
          isProductOfficeServicable = checkProductOfficeServicable({
            addressType,
            isOfficeSameDayExpressServicable,
            isOfficeNextDayExpressServicable,
            isTimeExpired,
            express_delivery_key,
          });
          break;

        case "saturday":
          isOfficeSameDayExpressServicable = false;
          isOfficeNextDayExpressServicable = false;
          isProductOfficeServicable = checkProductOfficeServicable({
            addressType,
            isOfficeSameDayExpressServicable,
            isOfficeNextDayExpressServicable,
            isTimeExpired,
            express_delivery_key,
          });
          break;

        case "sunday":
          isOfficeSameDayExpressServicable = false;
          isOfficeNextDayExpressServicable = true;
          isProductOfficeServicable = checkProductOfficeServicable({
            addressType,
            isOfficeSameDayExpressServicable,
            isOfficeNextDayExpressServicable,
            isTimeExpired,
            express_delivery_key,
          });
          break;

        default:
          isOfficeSameDayExpressServicable = true;
          isOfficeNextDayExpressServicable = true;
          isProductOfficeServicable = true;
      }
    } else {
      isOfficeSameDayExpressServicable = true;
      isOfficeNextDayExpressServicable = true;
      isProductOfficeServicable = true;
    }
  }

  return isProductOfficeServicable;
};

export const knowInventoryOnPageLoad = (simple_products) => {
  let whs = false;
  let store = false;
  let mp = false;

  for (const key in simple_products) {
    if (simple_products.hasOwnProperty(key)) {
      const item = simple_products?.[key];
      if (+item?.whs_quantity > 0) {
        whs = true;
        break;
      }
      if (+item?.store_quantity > 0) {
        store = true;
        break;
      }
      if (+item?.mp_quantity > 0) {
        mp = true;
        break;
      }
    }
  }

  return { whs, store, mp };
};
