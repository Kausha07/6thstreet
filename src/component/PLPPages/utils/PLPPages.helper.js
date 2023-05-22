export const getIsShowMoreFilters = (newActiveFilters) => {
  if (newActiveFilters && newActiveFilters["categories_without_path"]) {
    const selectedFilterArr = newActiveFilters["categories_without_path"];
    if (selectedFilterArr.length === 1) {
      const selectedFilterObj = selectedFilterArr[0];
      if (
        selectedFilterObj &&
        selectedFilterObj.sub_subcategories &&
        !!!checkIsDropdownable(selectedFilterObj)
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

export const checkIsDropdownable = (option) => {
  let isDropdownable = false;
  if (option && option?.sub_subcategories) {
    let sub_subCat = [];
    const { sub_subcategories } = option;
    Object.entries(sub_subcategories).map((sub_cat) => {
      sub_subCat.push(sub_cat[1]);
    });
    if (sub_subCat.length > 0) {
      isDropdownable = true;
    }
  }
  return isDropdownable;
};
