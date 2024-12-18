export const getIsShowMoreFilters = (newActiveFilters) => {
  if (newActiveFilters && newActiveFilters["categories_without_path"]) {
    const selectedFilterArrAllFilters = newActiveFilters["categories_without_path"];
    const selectedFilterArr = selectedFilterArrAllFilters.filter((item) => {
      return item.type != "MoreFilter";
    });
    if (selectedFilterArr.length === 1) {
      const selectedFilterObj = selectedFilterArr[0];
      if (
        selectedFilterObj &&
        selectedFilterObj.sub_subcategories &&
        !!!selectedFilterObj.isDropdown
      ) {
        return true;
      } else if (
        selectedFilterObj &&
        selectedFilterObj["category_level"] === "L4"
      ) {
        return true;
      }
    }
  }
  return false;
};
