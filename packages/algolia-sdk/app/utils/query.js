const getQueryValues = ({ query, path }) => {
  if (!query[path]) {
    return {};
  }
  return query[path].split(',').reduce((acc, v) => {
    acc[v] = true;
    return acc;
  }, {});
};

const getQueryValuesMoreFilters = (query, arrMoreFilters = []) => {
  let selectedMoreFilterObj = {};
  arrMoreFilters.map((item) => {
    if(query[item]){
      const keyNameArr = query[item].split(',');
      for(let i=0; i< keyNameArr.length; i++) {
        selectedMoreFilterObj[keyNameArr[i]] = true;
      }
    }
  });
  return selectedMoreFilterObj;
}

export { getQueryValues, getQueryValuesMoreFilters };
