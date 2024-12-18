export const getNewFilterCount = (newActiveFilters) => {
  if (newActiveFilters && newActiveFilters["categories_without_path"]) {
    const selectedFilterArrAllFilters = newActiveFilters["categories_without_path"];
    const selectedFilterArr = selectedFilterArrAllFilters.filter((item) => {
      return item.type != "MoreFilter";
    });
    return selectedFilterArr.length;
  }
  return 0;
};

export const getSliderFiltersCount = (sliderFilters) => {
  if(sliderFilters && Object.entries(sliderFilters).length) {
    return Object.entries(sliderFilters).length;
  }
  return 0;
}
