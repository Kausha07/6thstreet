export const getIsFilters = ( newActiveFilters = {}, activeFilters = {} ) => {
    if (newActiveFilters && newActiveFilters["categories_without_path"]) {
        const selectedFilterArrAllFilters =
          newActiveFilters["categories_without_path"];
        const selectedFilterArr = selectedFilterArrAllFilters.filter((item) => {
          return item.type != "MoreFilter";
        });
        if (selectedFilterArr.length > 0) {
            return true;
        }
    }

    if(activeFilters) {
      const exceptFilterArray = ["gender", 'categories.level1', 'in_stock'];
      let isFilters = false;
      Object.entries(activeFilters).map((entry) => {
        if(!!!exceptFilterArray.includes(entry[0])) {
          if( entry[1] && entry[1].length > 0) {
            isFilters = true;
          }
        }
      });
      return isFilters;
    }
    return false;
}
