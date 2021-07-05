import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import BrowserDatabase from "Util/BrowserDatabase";

const { gender } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};

console.log("gender", gender);
// temp
const sourceIndexName = "stage_magento_english_products";
const getHits = (hit, resArray) => {
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
  let category;
  let subCategory;
  if (
    query.toUpperCase().includes("KIDS") ||
    query.toUpperCase().includes("GIRL") ||
    query.toUpperCase().includes("GIRLS") ||
    query.toUpperCase().includes("BOY") ||
    query.toUpperCase().includes("BOYS") ||
    query.toUpperCase().includes("BABY GIRL") ||
    query.toUpperCase().includes("BABY BOY")
  ) {
    category = categories_level2;
    subCategory = categories_level3;
  } else {
    category = categories_level1;
    subCategory = categories_level2;
  }
  // if query does include brands
  if (hit.query.toUpperCase().includes(brand_name[0].value.toUpperCase())) {
    if (checkForValidSuggestion(query, [...resArray, ...arr])) {
      arr.push({
        query,
        filter: [
          {
            type: "brand",
            value: brand_name[0].value,
          },
        ],
        count: brand_name[0].count,
      });
    }
    category.forEach((ele) => {
      if (
        checkForValidSuggestion(
          brand_name[0].value + " " + ele.value.replaceAll("/// ", ""),
          [...resArray, ...arr]
        )
      ) {
        arr.push({
          query: brand_name[0].value + " " + ele.value.replaceAll("/// ", ""),
          filter: [
            {
              type: "brand",
              value: brand_name[0].value,
            },
            {
              type: "category_level1",
              value: ele.value,
            },
          ],
          count: ele.count,
        });
      }
    });
    subCategory.forEach((ele) => {
      if (
        checkForValidSuggestion(
          brand_name[0].value + " " + ele.value.replaceAll("/// ", ""),
          [...resArray, ...arr]
        )
      ) {
        let val = ele.value.split(" /// ").reverse();
        arr.push({
          query: brand_name[0].value + " " + val[0],
          filter: [
            {
              type: "brand",
              value: brand_name[0].value,
            },
            {
              type: "category_level2",
              value: ele.value,
            },
          ],
          count: ele.count,
        });
      }
    });
  }
  // if query does not include brands
  else {
    console.log("category if not brands", category);
    console.log("subcategory if not brands", subCategory);
    category.forEach((ele) => {
      if (
        checkForValidSuggestion(ele.value.replaceAll("/// ", ""), [
          ...resArray,
          ...arr,
        ])
      ) {
        arr.push({
          query: ele.value.replaceAll("/// ", ""),
          filter: [
            {
              type: "category_level1",
              value: ele.value,
            },
          ],
          count: ele.count,
        });
      }
    });
    subCategory.forEach((item) => {
      if (
        checkForValidSuggestion(item.value.replaceAll("/// ", ""), [
          ...resArray,
          ...arr,
        ])
      ) {
        let val = item.value.split(" /// ").reverse();
        console.log("val", val);
        arr.push({
          query: val[0],
          filter: [
            {
              type: "category_level2",
              value: item.value,
            },
          ],
          count: item.count,
        });
      }
    });
    if (
      checkForValidSuggestion(brand_name[0].value + " " + query, [
        ...resArray,
        ...arr,
      ])
    ) {
      console.log("value", brand_name);
      console.log("query", query);
      arr.push({
        query: brand_name[0].value + " " + query,
        filter: [
          {
            type: "brand",
            value: brand_name[0].value,
          },
        ],
        count: brand_name[0].count,
      });
    }
  }
  if (checkForValidSuggestion(query, [...resArray, ...arr])) {
    arr.unshift({
      query,
      count: exact_nb_hits,
    });
  }
  return arr;
};

const checkForValidSuggestion = (value, arr) => {
  let valid = true;

  if (/\b(?:OUTLET|INFLUENCER|INFLUENCERS)\b/i.test(value)) return false;

  if (
    value.toUpperCase() === gender.toUpperCase() ||
    value.toUpperCase() === "KIDS BABY GIRL" ||
    value.toUpperCase() === "KIDS GIRL" ||
    value.toUpperCase() === "KIDS BOY" ||
    value.toUpperCase() === "KIDS BABY BOY"
  )
    return false;

  if (gender !== "all") {
    let regex = new RegExp("\\b" + gender + "\\b", "i");
    console.log("regex", regex);
    if (regex.test(value)) {
      valid = false;
    }
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
        .replace(/[&-]/g, "")
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

export const createSuggestions = (hits) => {
  let arr = [];
  let i = 0;
  console.log("hits", hits);
  while (arr.length < 5 && i < hits.length) {
    arr.push(...getHits(hits[i], arr));
    i++;
  }
  return arr;
};
