import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { isArabic } from "Util/App";
import BrowserDatabase from "Util/BrowserDatabase";
import { capitalizeFirstLetters } from "../../../../../packages/algolia-sdk/app/utils";
const gender = BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
  ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
  : "home";

const genders = {
  all: {
    label: "Home",
    value: "home",
  },
  women: {
    label: "Women",
    value: "women",
  },
  men: {
    label: "Men",
    value: "men",
  },
  kids: {
    label: "Kids",
    value: "kids",
  },
};

const checkForKidsFilterQuery = (query) => {
  return (
    query?.toUpperCase().includes(__("KIDS")) ||
    query?.toUpperCase().includes(__("GIRL")) ||
    query?.toUpperCase().includes(__("GIRLS")) ||
    query?.toUpperCase().includes(__("BOY")) ||
    query?.toUpperCase().includes(__("BOYS")) ||
    query?.toUpperCase().includes(__("BABY GIRL")) ||
    query?.toUpperCase().includes(__("BABY BOY"))
  );
};

const addSuggestion = (
  label,
  query,
  filter,
  count,
  isBrand,
  arr,
  operation = "push"
) => {
  if (operation === "push") {
    arr.push({
      label,
      query,
      filter,
      isBrand,
      count,
    });
  } else if (operation === "unshift") {
    arr.unshift({
      label,
      query,
      filter,
      isBrand,
      count,
    });
  }
};

const checkForQueryWithGender = (query) => {
  if (gender === "home") return true;
  let regexStr;
  switch (gender) {
    case "women":
      regexStr = __("women");
      break;

    case "men":
      regexStr = __("men");
      break;

    case "kids":
      regexStr =
        __("KIDS") | __("GIRL") | __("BOY") | __("BABY BOY") | __("BABY GIRL");
      break;
    default:
      break;
  }
  let regex = new RegExp(isArabic() ? `${regexStr}` : `\\b${regexStr}\\b`, "i");
  return regex.test(query);
};

const createCustomQuerySuggestions = (hit, resArray, sourceIndexName) => {
  let arr = [];
  const {
    query,
    [sourceIndexName]: {
      exact_nb_hits,
      facets: {
        exact_matches: {
          brand_name,
          "categories.level1": categories_level1,
          "categories.level2": categories_level2,
          "categories.level3": categories_level3,
        },
      },
    },
  } = hit;
  let genderModifiedQuery;
  let replaceStrReg = new RegExp("/// ", "g");

  if (checkForQueryWithGender(query)) {
    genderModifiedQuery = query;
  } else {
    genderModifiedQuery = `${
      isArabic() ? getGenderInArabic(gender) : gender
    } ${query}`;
  }
  // if query does include brands
  if (brand_name[0]?.value?.toUpperCase().replace(/\s/g, "").includes(query?.toUpperCase().replace(/\s/g, ""))) {
    if (checkForValidSuggestion(genderModifiedQuery, [...resArray, ...arr])) {
      addSuggestion(
        genderModifiedQuery,
        genderModifiedQuery,
        [
          {
            type: "brand",
            value: brand_name[0]?.value,
          },
        ],
        brand_name[0]?.count,
        true,
        arr
      );
    }
    categories_level1?.forEach((ele) => {
      const suggestionLabel = `${brand_name[0].value} ${ele.value.replace(
        replaceStrReg,
        ""
      )}`;

      if (checkForValidSuggestion(suggestionLabel, [...resArray, ...arr])) {
        addSuggestion(
          suggestionLabel,
          suggestionLabel,
          [
            {
              type: "brand",
              value: brand_name[0]?.value,
            },
            {
              type: "categories_level1",
              value: ele.value,
            },
          ],
          ele.count,
          false,
          arr
        );
      }
    });

    categories_level2?.forEach((ele) => {
      const val = ele.value.split(" /// ");
      const testQuery = `${brand_name[0].value} ${[
        ...val.slice(0, val.length - 2),
        ...val.slice(val.length - 1),
      ].join(" ")}`;

      if (checkForValidSuggestion(testQuery, [...resArray, ...arr])) {
        addSuggestion(
          testQuery,
          testQuery,
          [
            {
              type: "brand",
              value: brand_name[0]?.value,
            },
            {
              type: "categories_level2",
              value: ele.value,
            },
          ],
          ele.count,
          false,
          arr
        );
      }
    });

    categories_level3?.forEach((ele) => {
      const val = ele.value.split(" /// ");
      const formattedQuery = ele.value?.replace(replaceStrReg, "");
      const testQuery = `${brand_name[0].value} ${[
        ...val.slice(
          0,
          checkForKidsFilterQuery(formattedQuery) ? val.length - 2 : 1
        ),
        ...val.slice(val.length - 1),
      ].join(" ")}`;
      if (checkForValidSuggestion(testQuery, [...resArray, ...arr])) {
        addSuggestion(
          testQuery,
          testQuery,
          [
            {
              type: "categories_level3",
              value: ele.value,
            },
          ],
          ele.count,
          false,
          arr
        );
      }
    });
  }
  // if query does not include brands
  else {
    categories_level1?.forEach((ele) => {
      const suggestionLabel = ele.value?.replace(replaceStrReg, "");

      if (checkForValidSuggestion(suggestionLabel, [...resArray, ...arr])) {
        addSuggestion(
          suggestionLabel,
          suggestionLabel,
          [
            {
              type: "categories_level1",
              value: ele.value,
            },
          ],
          ele.count,
          false,
          arr
        );
      }
    });

    categories_level2?.forEach((ele) => {
      const val = ele.value.split(" /// ");
      const testQuery = `${[
        ...val.slice(0, val.length - 2),
        ...val.slice(val.length - 1),
      ].join(" ")}`;

      if (checkForValidSuggestion(testQuery, [...resArray, ...arr])) {
        addSuggestion(
          testQuery,
          testQuery,
          [
            {
              type: "categories_level2",
              value: ele.value,
            },
          ],
          ele.count,
          false,
          arr
        );
      }
    });

    categories_level3?.forEach((ele) => {
      const val = ele.value.split(" /// ");
      const formattedQuery = ele.value?.replace(replaceStrReg, "");
      const testQuery = `${[
        ...val.slice(
          0,
          checkForKidsFilterQuery(formattedQuery) ? val.length - 2 : 1
        ),
        ...val.slice(val.length - 1),
      ].join(" ")}`;
      if (checkForValidSuggestion(testQuery, [...resArray, ...arr])) {
        addSuggestion(
          testQuery,
          testQuery,
          [
            {
              type: "categories_level3",
              value: ele.value,
            },
          ],
          ele.count,
          false,
          arr
        );
      }
    });
    if (
      checkForValidSuggestion(`${brand_name[0].value} ${genderModifiedQuery}`, [
        ...resArray,
        ...arr,
      ])
    ) {
      addSuggestion(
        `${brand_name[0]?.value} ${genderModifiedQuery}`,
        `${brand_name[0]?.value} ${genderModifiedQuery}`,
        [
          {
            type: "brand",
            value: brand_name[0]?.value,
          },
        ],
        brand_name[0]?.count,
        true,
        arr
      );
    }
  }
  if (
    checkForValidSuggestion(`${genderModifiedQuery}`, [...resArray, ...arr])
  ) {
    addSuggestion(
      `${genderModifiedQuery}`,
      `${genderModifiedQuery}`,
      undefined,
      exact_nb_hits,
      false,
      arr,
      "unshift"
    );
  }
  return arr;
};

const checkForValidSuggestion = (value, arr) => {
  let valid = true;

  if (
    /\b(?:OUTLET|INFLUENCER|INFLUENCERS|NEW IN|BLACK FRIDAY|DEFAULT CATEGORY)\b/i.test(
      value
    )
  )
    return false;
  if (isArabic()) {
    if (
      value?.toUpperCase() === getGenderInArabic(gender)?.toUpperCase() ||
      value?.toUpperCase() === __("KIDS BABY GIRL") ||
      value?.toUpperCase() === __("KIDS GIRL") ||
      value?.toUpperCase() === __("KIDS BOY") ||
      value?.toUpperCase() === __("KIDS BABY BOY")
    )
      return false;
  } else {
    if (
      value?.toUpperCase() === gender?.toUpperCase() ||
      value?.toUpperCase() === "KIDS BABY GIRL" ||
      value?.toUpperCase() === "KIDS GIRL" ||
      value?.toUpperCase() === "KIDS BOY" ||
      value?.toUpperCase() === "KIDS BABY BOY"
    )
      return false;
  }

  if (gender !== "home") {
    let { all, [gender]: selectedGender, ...filters } = genders;

    Object.keys(filters).forEach((filter) => {
      if (filter !== "home" && filter !== gender) {
        let regex = new RegExp(
          isArabic() ? `${getGenderInArabic(filter)}` : `\\b${filter}\\b`,
          "i"
        );
        if (regex.test(value)) {
          valid = false;
        }
      }
    });
  }
  let hit = arr.find(
    (ele) =>
      ele.query
        .replace(/[&-]/g, "")
        .replace(/^\s+|\s+$/g, "")
        .replace(/\s+/g, " ")
        .toUpperCase()
        .split(" ")
        .sort()
        .join(" ") ===
      value
        ?.replace(/[&-]/g, "")
        .replace(/^\s+|\s+$/g, "")
        .replace(/\s+/g, " ")
        .toUpperCase()
        .split(" ")
        .sort()
        .join(" ")
  );
  if (hit) valid = false;
  return valid;
};

export const getCustomQuerySuggestions = (hits, sourceIndexName,query) => {
  let arr = [];
  let i = 0;
  while (arr.length < 5 && i < hits.length) {
    arr.push(...createCustomQuerySuggestions(hits[i], arr, sourceIndexName,query));
    i++;
  }
  return arr;
};

export const formatQuerySuggestions = (query) => {
  const capitalizedQuery = capitalizeFirstLetters(query);
  let avoidFilter = isArabic() ? getGenderInArabic(gender) : gender;
  if (checkForKidsFilterQuery(capitalizedQuery))
    avoidFilter = isArabic() ? getGenderInArabic("kids") : "kids";
  else if (gender === "home") return capitalizedQuery;
  let regex = new RegExp(
    isArabic() ? `${avoidFilter}` : `\\b${avoidFilter}\\b`,
    "i"
  );
  return capitalizedQuery
    ?.replace(regex, "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s+/g, " ");
};

export const getHighlightedText = (text, highlight) => {
  // Split on highlight term and include term into parts, ignore case
  var invalid = /[°"§%()*\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
  var filteredHighlight = highlight.replace(invalid, "");
  const parts = text?.split(new RegExp(`(${filteredHighlight})`, "gi"));
  return (
    <span>
      {" "}
      {parts?.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { fontWeight: "bold" }
              : {}
          }
        >
          {part}
        </span>
      ))}{" "}
    </span>
  );
};

export const getGenderInArabic = (gender) => {
  switch (gender) {
    case "men":
      return "رجال";
    case "women":
      return "نساء";
    case "kids":
      return "أطفال";
    case "home":
      return "منزل";
  }
};
