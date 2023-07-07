export const getIsFilters = ( newActiveFilters = {} ) => {
    if (newActiveFilters && newActiveFilters["categories_without_path"]) {
        const selectedFilterArrAllFilters =
          newActiveFilters["categories_without_path"];
        const selectedFilterArr = selectedFilterArrAllFilters.filter((item) => {
          return item.type != "MoreFilter";
        });
        if (selectedFilterArr.length > 0) {
            return true;
        }else return false;
    }
    return false;
}
