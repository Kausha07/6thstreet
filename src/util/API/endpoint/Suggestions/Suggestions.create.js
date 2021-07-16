import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";
import { capitalizeFirstLetters } from "../../../../../packages/algolia-sdk/app/utils";

const { gender } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};

const genders = {
  all: {
    label: "All",
    value: "all",
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
    query.toUpperCase().includes("KIDS") ||
    query.toUpperCase().includes("GIRL") ||
    query.toUpperCase().includes("GIRLS") ||
    query.toUpperCase().includes("BOY") ||
    query.toUpperCase().includes("BOYS") ||
    query.toUpperCase().includes("BABY GIRL") ||
    query.toUpperCase().includes("BABY BOY")
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
  if (gender === "all") return true;
  let regexStr;
  switch (gender) {
    case "women":
      regexStr = "women";
      break;

    case "men":
      regexStr = "men";
      break;

    case "kids":
      regexStr = "KIDS|GIRL|BOY|BABY BOY|BABY GIRL";
      break;
    default:
      break;
  }
  let regex = new RegExp(`\\b${regexStr}\\b`, "i");
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
    genderModifiedQuery = `${gender} ${query}`;
  }
  // if query does include brands
  console.log("has brand", brand_name[0]);
  if (query?.toUpperCase().includes(brand_name[0]?.value.toUpperCase())) {
    console.log("found brand");
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

  if (
    value?.toUpperCase() === gender.toUpperCase() ||
    value?.toUpperCase() === "KIDS BABY GIRL" ||
    value?.toUpperCase() === "KIDS GIRL" ||
    value?.toUpperCase() === "KIDS BOY" ||
    value?.toUpperCase() === "KIDS BABY BOY"
  )
    return false;

  if (gender !== "all") {
    let { all, [gender]: selectedGender, ...filters } = genders;

    Object.keys(filters).forEach((filter) => {
      if (filter !== "all" && filter !== gender) {
        let regex = new RegExp("\\b" + filter + "\\b", "i");
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

export const getCustomQuerySuggestions = (hits, sourceIndexName) => {
  let arr = [];
  let i = 0;
  while (arr.length < 5 && i < hits.length) {
    arr.push(...createCustomQuerySuggestions(hits[i], arr, sourceIndexName));
    i++;
  }
  return arr;
};

export const formatQuerySuggestions = (query) => {
  const capitalizedQuery = capitalizeFirstLetters(query);
  let avoidFilter = gender;
  if (checkForKidsFilterQuery(capitalizedQuery)) avoidFilter = "kids";
  else if (gender === "all") return capitalizedQuery;

  let regex = new RegExp("\\b" + avoidFilter + "\\b", "i");
  return capitalizedQuery
    ?.replace(regex, "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s+/g, " ");
};

export const getHighlightedText = (text, highlight) => {
  // Split on highlight term and include term into parts, ignore case
  const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
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
