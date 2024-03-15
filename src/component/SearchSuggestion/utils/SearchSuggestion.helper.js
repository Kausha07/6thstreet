import { isArabic } from "Util/App";

export const capitalizeFirstLetter = (string = "") => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const requestedGender = (gender) => {
  if (gender === "kids") {
    return isArabic() ? "أولاد,بنات" : "Boy,Girl";
  } else if (gender === "نساء") {
    return "نساء";
  } else if (gender === "رجال") {
    return "رجال";
  } else if (gender === "أطفال") {
    return "أولاد,بنات";
  } else {
    return gender;
  }
};

export const isMsiteMegaMenuBrandsRoute = () => {
  if (window.location.pathname.includes("brands-menu")) {
    return true;
  }
  return false;
};

export const getBrandSuggetions = (megaMenuBrands, searchString) => {
  let outputArr = [];
  let count = 0;

  for (const value of Object.values(megaMenuBrands)) {
    for (const val of Object.values(value)) {
      if (
        count < 5 &&
        val?.name?.toLowerCase().includes(searchString.toLowerCase())
      ) {
        outputArr.push(val);
        count++;
      }

      // we are currently showing only 5 suggestions to users
      if (count === 5) {
        break;
      }
    }

    // if 5 suggestions are in array then break outer loop also.
    if (count === 5) {
      break;
    }
  }

  return outputArr;
};
