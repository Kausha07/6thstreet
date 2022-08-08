
import { capitalizeFirstLetters } from "../../../../../packages/algolia-sdk/app/utils";
const createQuerySuggestionIDRegexp = new RegExp(' ', 'g');

export const getCustomQuerySuggestions = (hits, indexName) => {
  const arr = [];
  // eslint-disable-next-line no-restricted-syntax
  for (let ele of hits) {
    const { query } = ele;
    arr.push({
      label: capitalizeFirstLetters(query),
      query,
      count: ele[indexName]?.exact_nb_hits,
      objectID: query?.replace(createQuerySuggestionIDRegexp, '_')
    });
  }
  return arr;
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