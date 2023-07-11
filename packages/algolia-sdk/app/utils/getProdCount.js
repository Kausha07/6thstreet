export const getFinalProdCountObj = (prodCountObj = {}) => {
  let regex = new RegExp("\\s///\\s|\\s", "gm");
  let outputObj = {};

  Object.entries(prodCountObj).map((entry, index) => {
    let categoryKey = entry[0].replace(regex, "_");
    outputObj[categoryKey] = entry[1];
  });

  return outputObj;
};
